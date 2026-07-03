// ==UserScript==
// @name         Job Seeking Mode for LinkedIn
// @name:ru      Режим Поиска Работы для LinkedIn
// @name:es      Modo Búsqueda de Empleo para LinkedIn
// @name:de      Jobsuche-Modus für LinkedIn
// @name:fr      Mode Recherche d'Emploi pour LinkedIn
// @name:zh      LinkedIn的求职模式
// @namespace    https://github.com/i-s-rusakov/job-seeking-mode-for-linkedin
// @updateURL    https://raw.githubusercontent.com/i-s-rusakov/job-seeking-mode-for-linkedin/master/userscript/job-seeking-mode-for-linkedin.user.js
// @downloadURL  https://raw.githubusercontent.com/i-s-rusakov/job-seeking-mode-for-linkedin/master/userscript/job-seeking-mode-for-linkedin.user.js
// @supportURL   https://github.com/i-s-rusakov/job-seeking-mode-for-linkedin/issues
// @version      1.0
// @description  Hide non-vacancy posts from LinkedIn feed with multi-language support
// @description:ru Скрывает посты без вакансий из ленты LinkedIn с поддержкой нескольких языков
// @description:es Ocultar publicaciones que no sean vacantes del feed de LinkedIn con soporte multilingüe
// @description:de Blenden Sie Nicht-Vakanz-Beiträge aus dem LinkedIn-Feed aus, mit mehrsprachiger Unterstützung
// @description:fr Masquer les publications sans poste vacant du fil LinkedIn avec support multilingue
// @description:zh 隐藏 LinkedIn 动态中非职位空缺的帖子，支持多语言
// @author       You
// @match        *://*.linkedin.com/*
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    
    const DEBUG_MODE = false;
    const log = (...args) => {
        if (DEBUG_MODE) console.warn('[LJSM]', ...args);
    };

    // --- DICTIONARIES ---
    const DICTIONARIES = {
        en: {
            name: "English",
            ui: {
                settings_title: "Language Settings",
                ui_language: "UI Language",
                filter_languages: "Filtering Languages",
                save: "Save",
                cancel: "Cancel",
                collapse_btn: "Collapse ↑",
                post_hidden: "Post hidden (click to expand)",
                feed_post_labels: ["feed post", "post"]
            },
            positive: ["hiring", "vacancy", "vacancies", "job opening", "opening", "looking for a", "we are looking for", "join our team", "open role", "open position", "jobs recommended for you"],
            negative: ["looking for a job", "looking for work", "personal branding", "business opportunity", "open to work", "opentowork", "hire me"]
        },
        ru: {
            name: "Русский",
            ui: {
                settings_title: "Настройки Языков",
                ui_language: "Язык интерфейса",
                filter_languages: "Языки фильтрации",
                save: "Сохранить",
                cancel: "Отмена",
                collapse_btn: "Свернуть ↑",
                post_hidden: "Пост скрыт (кликните, чтобы развернуть)",
                feed_post_labels: ["пост в ленте", "пост"]
            },
            positive: ["нанимаем", "вакансия", "вакансии", "открыта вакансия", "открытие", "ищем", "мы ищем", "присоединяйтесь к нашей команде", "присоединяйтесь к команде", "открыта роль", "открыта позиция", "открытую позицию", "найм", "в поиске", "рекомендуемые вакансии"],
            negative: ["ищу работу", "поиск работы", "поискработы", "персональный бренд", "бизнес возможность", "открыт к предложениям", "найми меня"]
        },
        es: {
            name: "Español",
            ui: {
                settings_title: "Configuración de Idiomas",
                ui_language: "Idioma de UI",
                filter_languages: "Idiomas de filtrado",
                save: "Guardar",
                cancel: "Cancelar",
                collapse_btn: "Contraer ↑",
                post_hidden: "Publicación oculta (clic para expandir)",
                feed_post_labels: ["publicación en el feed", "publicación"]
            },
            positive: ["contratando", "vacante", "vacantes", "oferta de empleo", "apertura", "buscando un", "estamos buscando", "únete a nuestro equipo", "unete a nuestro equipo", "rol abierto", "posición abierta", "empleos recomendados"],
            negative: ["buscando trabajo", "buscando empleo", "marca personal", "oportunidad de negocio", "abierto a trabajar", "contrátame", "contratame"]
        },
        de: {
            name: "Deutsch",
            ui: {
                settings_title: "Spracheinstellungen",
                ui_language: "UI-Sprache",
                filter_languages: "Filtersprachen",
                save: "Speichern",
                cancel: "Abbrechen",
                collapse_btn: "Einklappen ↑",
                post_hidden: "Beitrag ausgeblendet (Klicken zum Erweitern)",
                feed_post_labels: ["feed-beitrag", "beitrag"]
            },
            positive: ["einstellen", "vakanz", "offene stelle", "stellenangebot", "wir suchen", "trete unserem team bei", "offene rolle", "offene position", "jobs für sie empfohlen"],
            negative: ["suche arbeit", "suche job", "personal branding", "geschäftsmöglichkeit", "offen für arbeit", "stellensuche", "stelle mich ein"]
        },
        fr: {
            name: "Français",
            ui: {
                settings_title: "Paramètres de Langue",
                ui_language: "Langue de l'interface",
                filter_languages: "Langues de filtrage",
                save: "Enregistrer",
                cancel: "Annuler",
                collapse_btn: "Réduire ↑",
                post_hidden: "Message masqué (cliquez pour développer)",
                feed_post_labels: ["post dans le fil", "post"]
            },
            positive: ["embauche", "recrutement", "vacance", "poste vacant", "offre d'emploi", "nous cherchons", "rejoignez notre équipe", "rejoignez notre equipe", "rôle ouvert", "poste ouvert", "emplois recommandés"],
            negative: ["cherche un emploi", "recherche de travail", "marque personnelle", "opportunité d'affaires", "ouvert au travail", "embauchez-moi"]
        },
        zh: {
            name: "中文",
            ui: {
                settings_title: "语言设置",
                ui_language: "界面语言",
                filter_languages: "过滤语言",
                save: "保存",
                cancel: "取消",
                collapse_btn: "折叠 ↑",
                post_hidden: "帖子已隐藏（点击展开）",
                feed_post_labels: ["动态帖子", "帖子"]
            },
            positive: ["招聘", "职位空缺", "空缺", "寻找", "我们正在寻找", "加入我们的团队", "开放职位", "为您推荐的职位"],
            negative: ["找工作", "求职", "个人品牌", "商业机会", "寻找工作", "聘用我"]
        }
    };

    // --- CONFIG MANAGER ---
    class ConfigManager {
        constructor() {
            this.supportedLangs = Object.keys(DICTIONARIES);
            const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
            const defaultLang = this.supportedLangs.includes(browserLang) ? browserLang : 'en';

            this.config = {
                uiLang: GM_getValue('ljsm_uiLang', defaultLang),
                filterLangs: JSON.parse(GM_getValue('ljsm_filterLangs', JSON.stringify([defaultLang, 'en']))) // Default to browser lang + EN
            };
            
            // Deduplicate default array
            this.config.filterLangs = [...new Set(this.config.filterLangs)];
        }

        save(uiLang, filterLangs) {
            this.config.uiLang = uiLang;
            this.config.filterLangs = filterLangs;
            GM_setValue('ljsm_uiLang', uiLang);
            GM_setValue('ljsm_filterLangs', JSON.stringify(filterLangs));
            window.location.reload(); // Reload to apply changes immediately
        }

        get uiLang() { return this.config.uiLang; }
        get filterLangs() { return this.config.filterLangs; }
    }

    // --- I18N MANAGER ---
    class I18nManager {
        constructor(config) {
            this.config = config;
            this.ui = DICTIONARIES[config.uiLang].ui;
            
            let posKeywords = [];
            let negKeywords = [];
            let feedLabels = [];

            // Combine keywords from all selected filtering languages
            config.filterLangs.forEach(lang => {
                if (DICTIONARIES[lang]) {
                    posKeywords = posKeywords.concat(DICTIONARIES[lang].positive);
                    negKeywords = negKeywords.concat(DICTIONARIES[lang].negative);
                }
            });
            
            // Combine feed labels from all supported languages to always detect posts correctly regardless of filter settings
            Object.values(DICTIONARIES).forEach(dict => {
                feedLabels = feedLabels.concat(dict.ui.feed_post_labels);
            });

            // Deduplicate
            posKeywords = [...new Set(posKeywords)];
            negKeywords = [...new Set(negKeywords)];
            this.feedLabels = [...new Set(feedLabels)];

            // Create Regexes
            this.posRegex = new RegExp(`(?:${posKeywords.join('|')})`, 'i');
            this.negRegex = new RegExp(`(?:${negKeywords.join('|')})`, 'i');
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

    // --- UI MANAGER ---
    class UIManager {
        constructor(config, i18n) {
            this.config = config;
            this.i18n = i18n;
            this.injectCSS();
            GM_registerMenuCommand("⚙️ " + this.i18n.t('settings_title'), () => this.openSettingsModal());
        }

        injectCSS() {
            GM_addStyle(`
                .livf-collapsed {
                    max-height: 100px !important;
                    overflow: hidden !important;
                    position: relative !important;
                    cursor: pointer !important;
                    opacity: 0.6 !important;
                    transition: opacity 0.2s ease !important;
                }
                .livf-collapsed:hover {
                    opacity: 1 !important;
                }
                .livf-collapsed::after {
                    content: "${this.i18n.t('post_hidden')}";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to bottom, transparent, #f3f2ef 40%, #f3f2ef 100%);
                    color: #0a66c2;
                    text-align: center;
                    font-weight: 600;
                    font-size: 13px;
                    padding: 20px 10px 5px 10px;
                    pointer-events: none;
                    border-bottom: 1px solid #e0dfdc;
                }
                [data-livf-listener="true"] {
                    position: relative;
                }
                .livf-collapse-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #ffffff;
                    color: #0a66c2;
                    border: 1px solid #0a66c2;
                    border-radius: 16px;
                    padding: 4px 12px;
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    z-index: 100;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: background 0.2s;
                }
                .livf-collapse-btn:hover {
                    background: #f3f2ef;
                }
                .livf-collapsed .livf-collapse-btn {
                    display: none !important;
                }
            `);
        }

        openSettingsModal() {
            if (document.getElementById('livf-modal-overlay')) return;

            const applyStyles = (el, styles) => Object.assign(el.style, styles);

            const overlay = document.createElement('div');
            overlay.id = 'livf-modal-overlay';
            applyStyles(overlay, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.6)', zIndex: '2147483647',
                display: 'flex', justifyContent: 'center', alignItems: 'center'
            });

            const modal = document.createElement('div');
            applyStyles(modal, {
                backgroundColor: '#ffffff', borderRadius: '8px', padding: '24px',
                width: '400px', maxWidth: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '14px', color: '#333333', display: 'flex', flexDirection: 'column', gap: '16px',
                boxSizing: 'border-box'
            });

            const title = document.createElement('h2');
            title.textContent = this.i18n.t('settings_title');
            applyStyles(title, { margin: '0', fontSize: '20px', color: '#000000', fontWeight: 'bold' });
            modal.appendChild(title);

            // UI Language Dropdown
            const uiLangGroup = document.createElement('div');
            applyStyles(uiLangGroup, { display: 'flex', flexDirection: 'column', gap: '8px' });
            
            const uiLangLabel = document.createElement('label');
            uiLangLabel.textContent = this.i18n.t('ui_language');
            applyStyles(uiLangLabel, { fontWeight: 'bold' });
            uiLangGroup.appendChild(uiLangLabel);

            const uiLangSelect = document.createElement('select');
            applyStyles(uiLangSelect, { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fff', color: '#000' });
            Object.entries(DICTIONARIES).forEach(([code, dict]) => {
                const opt = document.createElement('option');
                opt.value = code;
                opt.textContent = dict.name;
                if (this.config.uiLang === code) opt.selected = true;
                uiLangSelect.appendChild(opt);
            });
            uiLangGroup.appendChild(uiLangSelect);
            modal.appendChild(uiLangGroup);

            // Filtering Languages Checkboxes
            const filterGroup = document.createElement('div');
            applyStyles(filterGroup, { display: 'flex', flexDirection: 'column', gap: '8px' });
            
            const filterLabel = document.createElement('label');
            filterLabel.textContent = this.i18n.t('filter_languages');
            applyStyles(filterLabel, { fontWeight: 'bold' });
            filterGroup.appendChild(filterLabel);

            const checkboxContainer = document.createElement('div');
            applyStyles(checkboxContainer, { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' });
            
            const checkboxes = [];
            Object.entries(DICTIONARIES).forEach(([code, dict]) => {
                const label = document.createElement('label');
                applyStyles(label, { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: '0' });
                
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.value = code;
                cb.checked = this.config.filterLangs.includes(code);
                
                label.appendChild(cb);
                label.appendChild(document.createTextNode(dict.name));
                checkboxContainer.appendChild(label);
                checkboxes.push(cb);
            });
            filterGroup.appendChild(checkboxContainer);
            modal.appendChild(filterGroup);

            // Actions
            const actions = document.createElement('div');
            applyStyles(actions, { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' });

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = this.i18n.t('cancel');
            applyStyles(cancelBtn, { padding: '8px 16px', borderRadius: '24px', border: 'none', backgroundColor: 'transparent', color: '#666', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' });
            
            cancelBtn.onmouseover = () => cancelBtn.style.backgroundColor = '#f3f2ef';
            cancelBtn.onmouseout = () => cancelBtn.style.backgroundColor = 'transparent';
            cancelBtn.onclick = () => overlay.remove();
            
            const saveBtn = document.createElement('button');
            saveBtn.textContent = this.i18n.t('save');
            applyStyles(saveBtn, { padding: '8px 16px', borderRadius: '24px', border: 'none', backgroundColor: '#0a66c2', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' });
            
            saveBtn.onmouseover = () => saveBtn.style.backgroundColor = '#004182';
            saveBtn.onmouseout = () => saveBtn.style.backgroundColor = '#0a66c2';
            saveBtn.onclick = () => {
                const uiLang = uiLangSelect.value;
                const filterLangs = checkboxes.filter(cb => cb.checked).map(cb => cb.value);
                
                if (filterLangs.length === 0) {
                    alert("Please select at least one filtering language.");
                    return;
                }
                
                this.config.save(uiLang, filterLangs);
            };

            actions.appendChild(cancelBtn);
            actions.appendChild(saveBtn);
            modal.appendChild(actions);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);
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

            // Setup listener and collapse button for ALL posts if not already done
            if (!postNode.hasAttribute('data-livf-listener')) {
                postNode.setAttribute('data-livf-listener', 'true');
                
                const collapseBtn = document.createElement('div');
                collapseBtn.className = 'livf-collapse-btn';
                collapseBtn.innerHTML = this.i18n.t('collapse_btn');
                collapseBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    postNode.classList.add('livf-collapsed');
                    postNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                postNode.appendChild(collapseBtn);

                postNode.addEventListener('click', (e) => {
                    if (postNode.classList.contains('livf-collapsed')) {
                        e.preventDefault();
                        e.stopPropagation();
                        postNode.classList.remove('livf-collapsed');
                    }
                }, true);
            }

            if (this.i18n.isVacancy(textContent)) {
                log('Vacancy found:', textContent.substring(0, 50).replace(/\n/g, ' ') + '...');
                postNode.classList.remove('livf-collapsed');
                postNode.style.border = '2px solid #057642'; 
            } else {
                postNode.classList.add('livf-collapsed');
                postNode.style.border = 'none';
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

            const init = () => {
                const feedContainer = document.querySelector('.scaffold-layout__main') || document.body;
                if (feedContainer) {
                    log('Starting observer on feed container');
                    observer.observe(feedContainer, { childList: true, subtree: true });
                    this.processFeed();
                } else {
                    log('Feed container not found, retrying in 1s...');
                    setTimeout(init, 1000);
                }
            };

            setTimeout(init, 2000);
        }
    }

    // --- MAIN APP INIT ---
    log('TOP LEVEL SCRIPT EXECUTION STARTED');
    const config = new ConfigManager();
    const i18n = new I18nManager(config);
    const ui = new UIManager(config, i18n);
    const feed = new FeedObserver(i18n);
    
    feed.start();

})();
