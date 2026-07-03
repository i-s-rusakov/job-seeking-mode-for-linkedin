(function() {
    'use strict';
    
    const DEBUG_MODE = false;
    const log = (...args) => {
        if (DEBUG_MODE) console.warn('[LJSM]', ...args);
    };

    // --- DICTIONARY SYNC ---
    const DICT_URL = 'https://raw.githubusercontent.com/i-s-rusakov/job-seeking-mode-for-linkedin/master/dictionaries.json';
    const SYNC_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours

    function syncDictionariesIfNeeded(config, callback) {
        if (!config.autoUpdateDict) {
            chrome.storage.sync.set({ ljsm_sync_status: 'disabled' });
            callback(null);
            return;
        }
        
        chrome.storage.local.get(['ljsm_dict_last_sync', 'ljsm_cached_dict'], (localItems) => {
            const now = Date.now();
            const lastSync = localItems.ljsm_dict_last_sync || 0;
            
            if (now - lastSync > SYNC_INTERVAL || !localItems.ljsm_cached_dict) {
                log('Fetching latest dictionaries from GitHub...');
                fetch(DICT_URL)
                    .then(r => r.json())
                    .then(data => {
                        chrome.storage.local.set({
                            ljsm_dict_last_sync: now,
                            ljsm_cached_dict: data
                        });
                        chrome.storage.sync.set({ 
                            ljsm_sync_status: 'ok',
                            ljsm_sync_needs_reload: true 
                        });
                        log('Dictionaries updated successfully.');
                        callback(data);
                    })
                    .catch(e => {
                        console.error('[LJSM] Failed to sync dictionaries:', e);
                        chrome.storage.sync.set({ ljsm_sync_status: 'error' });
                        callback(localItems.ljsm_cached_dict || null);
                    });
            } else {
                chrome.storage.sync.set({ ljsm_sync_status: 'ok', ljsm_sync_needs_reload: false });
                callback(localItems.ljsm_cached_dict || null);
            }
        });
    }

    // --- I18N MANAGER ---
    class I18nManager {
        constructor(config, cachedDict = null) {
            this.config = config;
            this.ui = DICTIONARIES[config.uiLang].ui;
            
            let posKeywords = [];
            let negKeywords = [];
            let feedLabels = [];
            
            Object.values(DICTIONARIES).forEach(dict => {
                feedLabels = feedLabels.concat(dict.ui.feed_post_labels);
            });

            config.filterLangs.forEach(lang => {
                if (cachedDict && cachedDict[lang]) {
                    posKeywords = posKeywords.concat(cachedDict[lang].positive);
                    negKeywords = negKeywords.concat(cachedDict[lang].negative);
                } else if (DICTIONARIES[lang]) {
                    posKeywords = posKeywords.concat(DICTIONARIES[lang].positive);
                    negKeywords = negKeywords.concat(DICTIONARIES[lang].negative);
                }
            });

            this.posRegex = new RegExp(`(?:${posKeywords.join('|')})`, 'i');
            this.negRegex = new RegExp(`(?:${negKeywords.join('|')})`, 'i');
            this.feedLabels = [...new Set(feedLabels)].map(l => l.toLowerCase());
        }

        t(key) {
            return this.ui[key] || key;
        }

        isVacancy(text) {
            const cleanText = text.replace(/#/g, '');
            return this.posRegex.test(cleanText) && !this.negRegex.test(cleanText);
        }
        
        isFeedPostLabel(text) {
            const lowerText = text.toLowerCase();
            return this.feedLabels.some(label => lowerText.includes(label));
        }
    }

    // --- FEED OBSERVER ---
    class FeedObserver {
        constructor(i18n) {
            this.i18n = i18n;
            this.processedPosts = new WeakSet();
            this.processTimeout = null;
        }

        processPost(postNode) {
            if (this.processedPosts.has(postNode)) return;
            this.processedPosts.add(postNode);

            const textContent = postNode.innerText || postNode.textContent || '';
            if (!textContent.trim()) {
                 this.processedPosts.delete(postNode); 
                 return;
            }

            if (!postNode.hasAttribute('data-ljsm-listener')) {
                postNode.setAttribute('data-ljsm-listener', 'true');
                postNode.setAttribute('data-hidden-text', this.i18n.t('post_hidden'));
                
                const collapseBtn = document.createElement('div');
                collapseBtn.className = 'ljsm-collapse-btn';
                collapseBtn.innerHTML = this.i18n.t('collapse_btn');
                collapseBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    postNode.classList.add('ljsm-collapsed');
                    postNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                postNode.appendChild(collapseBtn);

                postNode.addEventListener('click', (e) => {
                    if (postNode.classList.contains('ljsm-collapsed')) {
                        e.preventDefault();
                        e.stopPropagation();
                        postNode.classList.remove('ljsm-collapsed');
                    }
                }, true);
            }

            if (this.i18n.isVacancy(textContent)) {
                log('Vacancy found:', textContent.substring(0, 50) + '...');
                postNode.classList.remove('ljsm-collapsed');
            } else {
                postNode.classList.add('ljsm-collapsed');
            }
        }

        processFeed() {
            const h2s = document.querySelectorAll('h2');
            const posts = [];
            
            for (const h2 of h2s) {
                const text = h2.textContent || '';
                
                if (this.i18n.isFeedPostLabel(text)) {
                    let container = h2.closest('[role="listitem"]');
                    
                    if (!container) {
                        container = h2.parentElement;
                        if (container && container.parentElement && container.parentElement.getAttribute('data-display-contents') === 'true') {
                            if (container.parentElement.parentElement) {
                                container = container.parentElement.parentElement;
                            }
                        }
                    }
                    
                    if (container && !posts.includes(container)) {
                        posts.push(container);
                    }
                }
            }
            posts.forEach(post => this.processPost(post));
        }

        start() {
            const observer = new MutationObserver((mutations) => {
                const path = window.location.pathname;
                if (path !== '/' && !path.startsWith('/feed')) return;
                if (!this.i18n.config.enabled) return;

                let shouldProcess = false;
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        shouldProcess = true;
                        break;
                    }
                }

                if (shouldProcess) {
                    clearTimeout(this.processTimeout);
                    this.processTimeout = setTimeout(() => this.processFeed(), 200);
                }
            });

            // Start observing
            let feedContainer = document.querySelector('.scaffold-layout__main') || document.body;
            observer.observe(feedContainer, { childList: true, subtree: true });
            
            // Initial run
            const path = window.location.pathname;
            if ((path === '/' || path.startsWith('/feed')) && this.i18n.config.enabled) {
                this.processFeed();
            }
            log('Starting observer on feed container');
        }
    }

    // --- INITIALIZATION ---
    function init() {
        const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
        const supportedLangs = Object.keys(DICTIONARIES);
        const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';

        chrome.storage.sync.get({
            ljsm_enabled: true,
            ljsm_auto_update_dict: true,
            ljsm_uiLang: defaultLang,
            ljsm_filterLangs: [defaultLang, 'en']
        }, (items) => {
            if (!items.ljsm_enabled || !items.ljsm_filterLangs || items.ljsm_filterLangs.length === 0) return;
            const config = {
                enabled: items.ljsm_enabled,
                autoUpdateDict: items.ljsm_auto_update_dict,
                uiLang: items.ljsm_uiLang,
                filterLangs: items.ljsm_filterLangs
            };
            
            syncDictionariesIfNeeded(config, (cachedDict) => {
                const i18n = new I18nManager(config, cachedDict);
                const observer = new FeedObserver(i18n);
                observer.start();
            });
        });
    }

    init();
})();
