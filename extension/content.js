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
        constructor(config, cachedDict) {
            this.config = config;
            this.uiLang = config.uiLang || 'en';
            this.ui = DICTIONARIES[this.uiLang].ui;
            
            let strongPosKeywords = [];
            let posKeywords = [];
            let negKeywords = [];
            let feedLabels = [];
            
            Object.values(DICTIONARIES).forEach(dict => {
                feedLabels = feedLabels.concat(dict.ui.feed_post_labels);
            });

            config.filterLangs.forEach(lang => {
                if (cachedDict && cachedDict[lang]) {
                    if (cachedDict[lang].strong_positive) strongPosKeywords = strongPosKeywords.concat(cachedDict[lang].strong_positive);
                    posKeywords = posKeywords.concat(cachedDict[lang].positive);
                    negKeywords = negKeywords.concat(cachedDict[lang].negative);
                } else if (DICTIONARIES[lang]) {
                    if (DICTIONARIES[lang].strong_positive) strongPosKeywords = strongPosKeywords.concat(DICTIONARIES[lang].strong_positive);
                    posKeywords = posKeywords.concat(DICTIONARIES[lang].positive);
                    negKeywords = negKeywords.concat(DICTIONARIES[lang].negative);
                }
            });

            this.strongPosRegex = strongPosKeywords.length > 0 ? new RegExp(`(?:${strongPosKeywords.join('|')})`, 'i') : null;
            this.posRegex = new RegExp(`(?:${posKeywords.join('|')})`, 'i');
            this.negRegex = new RegExp(`(?:${negKeywords.join('|')})`, 'i');
            
            this.strongPosRegexG = strongPosKeywords.length > 0 ? new RegExp(`(${strongPosKeywords.join('|')})`, 'ig') : null;
            this.posRegexG = new RegExp(`(${posKeywords.join('|')})`, 'ig');
            this.negRegexG = new RegExp(`(${negKeywords.join('|')})`, 'ig');
            
            this.feedLabels = [...new Set(feedLabels)].map(l => l.toLowerCase());
        }

        t(key) {
            return this.ui[key] || key;
        }

        isVacancy(text) {
            const cleanText = text.replace(/#/g, '');
            const isStrong = this.strongPosRegex ? this.strongPosRegex.test(cleanText) : false;
            return isStrong || (this.posRegex.test(cleanText) && !this.negRegex.test(cleanText));
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

            if (this.i18n.config.highlightKeywords) {
                this.highlightTextNodes(postNode);
            }
        }

        createHighlightedNodes(text) {
            let result = [document.createTextNode(text)];
            
            const applyRegex = (regex, style) => {
                if (!regex) return;
                for (let i = 0; i < result.length; i++) {
                    const node = result[i];
                    if (node.nodeType === Node.TEXT_NODE) {
                        const str = node.nodeValue;
                        const matches = [...str.matchAll(regex)];
                        if (matches.length > 0) {
                            const newNodes = [];
                            let lastIndex = 0;
                            for (const match of matches) {
                                const matchIndex = match.index;
                                if (matchIndex > lastIndex) {
                                    newNodes.push(document.createTextNode(str.substring(lastIndex, matchIndex)));
                                }
                                const span = document.createElement('span');
                                span.className = 'ljsm-highlight';
                                Object.assign(span.style, style);
                                span.textContent = match[0];
                                newNodes.push(span);
                                lastIndex = matchIndex + match[0].length;
                            }
                            if (lastIndex < str.length) {
                                newNodes.push(document.createTextNode(str.substring(lastIndex)));
                            }
                            result.splice(i, 1, ...newNodes);
                            i += newNodes.length - 1;
                        }
                    }
                }
            };

            applyRegex(this.i18n.strongPosRegexG, { color: '#057642', fontWeight: 'bold', fontStyle: 'italic' });
            applyRegex(this.i18n.posRegexG, { color: '#057642', fontStyle: 'italic' });
            applyRegex(this.i18n.negRegexG, { color: '#cc0000', fontStyle: 'italic' });

            return result;
        }

        highlightTextNodes(postNode) {
            const walker = document.createTreeWalker(postNode, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    const parent = node.parentNode;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName;
                    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
                    if (parent.classList && parent.classList.contains('ljsm-highlight')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            });

            const textNodes = [];
            let node;
            while ((node = walker.nextNode())) {
                if (node.nodeValue.trim()) {
                    textNodes.push(node);
                }
            }

            textNodes.forEach(textNode => {
                const newNodes = this.createHighlightedNodes(textNode.nodeValue);
                if (newNodes.length > 1) { 
                    const fragment = document.createDocumentFragment();
                    newNodes.forEach(n => fragment.appendChild(n));
                    textNode.parentNode.replaceChild(fragment, textNode);
                }
            });
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
            ljsm_highlight_keywords: false,
            ljsm_auto_update_dict: true,
            ljsm_uiLang: defaultLang,
            ljsm_filterLangs: [defaultLang, 'en']
        }, (items) => {
            if (!items.ljsm_enabled || !items.ljsm_filterLangs || items.ljsm_filterLangs.length === 0) return;
            const config = {
                enabled: items.ljsm_enabled,
                highlightKeywords: items.ljsm_highlight_keywords,
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
