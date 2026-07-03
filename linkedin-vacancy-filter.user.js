// ==UserScript==
// @name         LinkedIn Vacancy Filter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide non-vacancy posts from LinkedIn feed with multi-language support
// @author       You
// @match        *://*.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';
    
    const DEBUG_MODE = true;
    const log = (...args) => {
        if (DEBUG_MODE) console.warn('[LIVF]', ...args);
    };

    // --- DICTIONARIES ---
    const DICTIONARIES = {
        en: {
            name: "English",
            ui: {
                settings_title: "LIVF Settings",
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
                settings_title: "Настройки LIVF",
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
                settings_title: "Configuración LIVF",
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
                settings_title: "LIVF Einstellungen",
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
                settings_title: "Paramètres LIVF",
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
                settings_title: "LIVF 设置",
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
                uiLang: GM_getValue('livf_uiLang', defaultLang),
                filterLangs: JSON.parse(GM_getValue('livf_filterLangs', JSON.stringify([defaultLang, 'en']))) // Default to browser lang + EN
            };
            
            // Deduplicate default array
            this.config.filterLangs = [...new Set(this.config.filterLangs)];
        }

        save(uiLang, filterLangs) {
            this.config.uiLang = uiLang;
            this.config.filterLangs = filterLangs;
            GM_setValue('livf_uiLang', uiLang);
            GM_setValue('livf_filterLangs', JSON.stringify(filterLangs));
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
            
            GM_registerMenuCommand("⚙️ LIVF Settings", () => this.openSettingsModal());
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
                /* Modal CSS */
                #livf-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.6); z-index: 999999;
                    display: flex; justify-content: center; align-items: center;
                }
                #livf-modal {
                    background: #fff; border-radius: 8px; padding: 24px;
                    width: 400px; max-width: 90%; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, sans-serif;
                }
                #livf-modal h2 { margin-top: 0; margin-bottom: 16px; font-size: 20px; color: #000; }
                .livf-form-group { margin-bottom: 16px; }
                .livf-form-group label { display: block; font-weight: 600; margin-bottom: 8px; color: #333; }
                .livf-form-group select { width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc; font-size: 14px; }
                .livf-checkbox-group { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .livf-checkbox-group label { font-weight: normal; display: flex; align-items: center; font-size: 14px; cursor: pointer; }
                .livf-checkbox-group input { margin-right: 8px; cursor: pointer; }
                .livf-modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
                .livf-btn { padding: 8px 16px; border-radius: 24px; font-weight: 600; cursor: pointer; font-size: 14px; border: none; }
                .livf-btn-secondary { background: transparent; color: #666; }
                .livf-btn-secondary:hover { background: #f3f2ef; }
                .livf-btn-primary { background: #0a66c2; color: #fff; }
                .livf-btn-primary:hover { background: #004182; }
            `);
        }

        openSettingsModal() {
            if (document.getElementById('livf-modal-overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'livf-modal-overlay';
            
            let filterCheckboxesHtml = '';
            Object.entries(DICTIONARIES).forEach(([code, dict]) => {
                const isChecked = this.config.filterLangs.includes(code) ? 'checked' : '';
                filterCheckboxesHtml += `<label><input type="checkbox" value="${code}" ${isChecked}> ${dict.name}</label>`;
            });

            let uiSelectHtml = '';
            Object.entries(DICTIONARIES).forEach(([code, dict]) => {
                const isSelected = this.config.uiLang === code ? 'selected' : '';
                uiSelectHtml += `<option value="${code}" ${isSelected}>${dict.name}</option>`;
            });

            overlay.innerHTML = `
                <div id="livf-modal">
                    <h2>${this.i18n.t('settings_title')}</h2>
                    <div class="livf-form-group">
                        <label>${this.i18n.t('ui_language')}</label>
                        <select id="livf-ui-lang">${uiSelectHtml}</select>
                    </div>
                    <div class="livf-form-group">
                        <label>${this.i18n.t('filter_languages')}</label>
                        <div class="livf-checkbox-group" id="livf-filter-langs">
                            ${filterCheckboxesHtml}
                        </div>
                    </div>
                    <div class="livf-modal-actions">
                        <button class="livf-btn livf-btn-secondary" id="livf-cancel-btn">${this.i18n.t('cancel')}</button>
                        <button class="livf-btn livf-btn-primary" id="livf-save-btn">${this.i18n.t('save')}</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(overlay);

            document.getElementById('livf-cancel-btn').onclick = () => overlay.remove();
            
            document.getElementById('livf-save-btn').onclick = () => {
                const uiLang = document.getElementById('livf-ui-lang').value;
                const filterInputs = document.querySelectorAll('#livf-filter-langs input:checked');
                const filterLangs = Array.from(filterInputs).map(i => i.value);
                
                if (filterLangs.length === 0) {
                    alert("Please select at least one filtering language.");
                    return;
                }
                
                this.config.save(uiLang, filterLangs);
            };
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
