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
// @author       Ivan Rusakov
// @match        *://*.linkedin.com/*
// @icon         https://raw.githubusercontent.com/i-s-rusakov/job-seeking-mode-for-linkedin/master/extension/icons/icon48.png
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @license      MIT
// ==/UserScript==

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
            GM_setValue('ljsm_sync_status', 'disabled');
            callback(null);
            return;
        }
        
        const now = Date.now();
        const lastSync = GM_getValue('ljsm_dict_last_sync', 0);
        const cachedDict = GM_getValue('ljsm_cached_dict', null);
        
        if (now - lastSync > SYNC_INTERVAL || !cachedDict) {
            log('Fetching latest dictionaries from GitHub...');
            GM_xmlhttpRequest({
                method: "GET",
                url: DICT_URL,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        GM_setValue('ljsm_dict_last_sync', now);
                        GM_setValue('ljsm_cached_dict', data);
                        GM_setValue('ljsm_sync_status', 'ok');
                        GM_setValue('ljsm_sync_needs_reload', true);
                        log('Dictionaries updated successfully.');
                        callback(data);
                    } catch (e) {
                        console.error('[LJSM] Failed to parse dictionaries:', e);
                        GM_setValue('ljsm_sync_status', 'error');
                        callback(cachedDict);
                    }
                },
                onerror: function(e) {
                    console.error('[LJSM] Failed to fetch dictionaries:', e);
                    GM_setValue('ljsm_sync_status', 'error');
                    callback(cachedDict);
                }
            });
        } else {
            GM_setValue('ljsm_sync_status', 'ok');
            GM_setValue('ljsm_sync_needs_reload', false);
            callback(cachedDict);
        }
    }

    // --- DICTIONARIES ---
    const DICTIONARIES = {
        en: {
            name: "English",
            ui: {
                settings_title: "Language Settings",
                enable_filtering: "Enable Job Seeking Mode",
                auto_update_dict: "Auto-update keywords from GitHub",
                sync_status_ok: "Sync Status: Updated",
                sync_status_error: "Sync Status: Error",
                sync_status_disabled: "Sync Status: Disabled",
                reload_required: " (Reload page to apply!)",
                ui_language: "UI Language",
                filter_languages: "Filtering Languages",
                save: "Save",
                cancel: "Cancel",
                collapse_btn: "Collapse ↑",
                post_hidden: "Post hidden (click to expand)",
                feed_post_labels: ["feed post", "post"]
            },
            positive: ["hiring", "vacancy", "vacancies", "job opening", "opening", "looking for a", "we are looking for", "join our team", "open role", "open position", "jobs recommended for you", "opportunities", "job opportunities", "career opportunities"],
            negative: ["looking for a job", "looking for work", "personal branding", "business opportunity", "open to work", "opentowork", "hire me", "#jobsearch", "#resumetips", "#hiringtrends"]
        },
        ru: {
            name: "Русский",
            ui: {
                settings_title: "Настройки Языков",
                enable_filtering: "Включить Режим Поиска Работы",
                auto_update_dict: "Автообновление словарей с GitHub",
                sync_status_ok: "Синхронизация: Обновлено",
                sync_status_error: "Синхронизация: Ошибка",
                sync_status_disabled: "Синхронизация: Отключена",
                reload_required: " (Перезагрузите для применения!)",
                ui_language: "Язык интерфейса",
                filter_languages: "Языки фильтрации",
                save: "Сохранить",
                cancel: "Отмена",
                collapse_btn: "Свернуть ↑",
                post_hidden: "Пост скрыт (кликните, чтобы развернуть)",
                feed_post_labels: ["пост в ленте", "пост"]
            },
            positive: ["нанимаем", "вакансия", "вакансии", "открыта вакансия", "открытие", "ищем", "мы ищем", "присоединяйтесь к нашей команде", "присоединяйтесь к команде", "открыта роль", "открыта позиция", "открытую позицию", "найм", "в поиске", "рекомендуемые вакансии", "возможности", "возможности трудоустройства", "карьерные возможности"],
            negative: ["ищу работу", "поиск работы", "поискработы", "персональный бренд", "бизнес возможность", "открыт к предложениям", "найми меня", "#поискработы", "#советыпорезюме", "#трендынайма"]
        },
        es: {
            name: "Español",
            ui: {
                settings_title: "Configuración de Idiomas",
                enable_filtering: "Habilitar Modo Búsqueda de Empleo",
                auto_update_dict: "Actualización automática de GitHub",
                sync_status_ok: "Sincronización: Actualizado",
                sync_status_error: "Sincronización: Error",
                sync_status_disabled: "Sincronización: Deshabilitada",
                reload_required: " (¡Recarga para aplicar!)",
                ui_language: "Idioma de UI",
                filter_languages: "Idiomas de filtrado",
                save: "Guardar",
                cancel: "Cancelar",
                collapse_btn: "Contraer ↑",
                post_hidden: "Publicación oculta (clic para expandir)",
                feed_post_labels: ["publicación en el feed", "publicación"]
            },
            positive: ["contratando", "vacante", "vacantes", "oferta de trabajo", "apertura", "buscando un", "estamos buscando", "únete a nuestro equipo", "rol abierto", "puesto abierto", "empleos recomendados para ti", "oportunidades", "oportunidades de empleo", "oportunidades de carrera"],
            negative: ["buscando trabajo", "buscando empleo", "marca personal", "oportunidad de negocio", "abierto a trabajar", "contrátame", "contratame"]
        },
        de: {
            name: "Deutsch",
            ui: {
                settings_title: "Spracheinstellungen",
                enable_filtering: "Jobsuche-Modus Aktivieren",
                auto_update_dict: "Auto-Update-Wörterbuch von GitHub",
                sync_status_ok: "Sync-Status: Aktualisiert",
                sync_status_error: "Sync-Status: Fehler",
                sync_status_disabled: "Sync-Status: Deaktiviert",
                reload_required: " (Neu laden zum Anwenden!)",
                ui_language: "UI-Sprache",
                filter_languages: "Filtersprachen",
                save: "Speichern",
                cancel: "Abbrechen",
                collapse_btn: "Einklappen ↑",
                post_hidden: "Beitrag ausgeblendet (Klicken zum Erweitern)",
                feed_post_labels: ["feed-beitrag", "beitrag"]
            },
            positive: ["einstellen", "vakanz", "stellenangebot", "wir suchen", "trete unserem team bei", "offene rolle", "offene position", "für dich empfohlene jobs", "möglichkeiten", "stellenangebote", "karrierechancen"],
            negative: ["suche arbeit", "suche job", "personal branding", "geschäftsmöglichkeit", "offen für arbeit", "stellensuche", "stelle mich ein"]
        },
        fr: {
            name: "Français",
            ui: {
                settings_title: "Paramètres de Langue",
                enable_filtering: "Activer le Mode Recherche d'Emploi",
                auto_update_dict: "Mise à jour auto des mots-clés (GitHub)",
                sync_status_ok: "Statut: Mis à jour",
                sync_status_error: "Statut: Erreur",
                sync_status_disabled: "Statut: Désactivé",
                reload_required: " (Recharger pour appliquer!)",
                ui_language: "Langue de l'interface",
                filter_languages: "Langues de filtrage",
                save: "Enregistrer",
                cancel: "Annuler",
                collapse_btn: "Réduire ↑",
                post_hidden: "Message masqué (cliquez pour développer)",
                feed_post_labels: ["post dans le fil", "post"]
            },
            positive: ["embauche", "poste vacant", "postes vacants", "offre d'emploi", "ouverture", "à la recherche d'un", "nous recherchons", "rejoignez notre équipe", "rôle ouvert", "poste ouvert", "emplois recommandés pour vous", "opportunités", "opportunités d'emploi", "opportunités de carrière"],
            negative: ["cherche un emploi", "recherche de travail", "marque personnelle", "opportunité d'affaires", "ouvert au travail", "embauchez-moi"]
        },
        zh: {
            name: "中文",
            ui: {
                settings_title: "语言设置",
                enable_filtering: "启用求职模式",
                auto_update_dict: "从GitHub自动更新关键词",
                sync_status_ok: "同步状态: 已更新",
                sync_status_error: "同步状态: 错误",
                sync_status_disabled: "同步状态: 已禁用",
                reload_required: " (重新加载以应用！)",
                ui_language: "界面语言",
                filter_languages: "过滤语言",
                save: "保存",
                cancel: "取消",
                collapse_btn: "折叠 ↑",
                post_hidden: "帖子已隐藏（点击展开）",
                feed_post_labels: ["动态帖子", "帖子"]
            },
            positive: ["招聘", "空缺", "职位空缺", "寻找", "我们正在寻找", "加入我们的团队", "开放职位", "为你推荐的工作", "机会", "就业机会", "职业机会"],
            negative: ["找工作", "求职", "个人品牌", "商业机会", "寻找工作", "聘用我"]
        }
    };

    // --- CONFIG MANAGER ---
    class ConfigManager {
        constructor() {
            const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
            const supportedLangs = Object.keys(DICTIONARIES);
            const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';

            this.config = {
                autoUpdateDict: GM_getValue('ljsm_auto_update_dict', true),
                uiLang: GM_getValue('ljsm_uiLang', defaultLang),
                filterLangs: GM_getValue('ljsm_filterLangs', [defaultLang, 'en'])
            };
        }

        save(config) {
            GM_setValue('ljsm_auto_update_dict', config.autoUpdateDict);
            GM_setValue('ljsm_uiLang', config.uiLang);
            GM_setValue('ljsm_filterLangs', config.filterLangs);
            window.location.reload();
        }
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
            
            posKeywords = [...new Set(posKeywords)];
            negKeywords = [...new Set(negKeywords)];
            this.feedLabels = [...new Set(feedLabels)];

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
        }

        initMenu(configObj) {
            GM_registerMenuCommand("⚙️ " + this.i18n.t('settings_title'), () => this.openSettingsModal(configObj));
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

        openSettingsModal(config) {
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
            
            // Auto Update Toggle
            const updateGroup = document.createElement('div');
            applyStyles(updateGroup, { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' });
            
            const updateLabel = document.createElement('label');
            updateLabel.textContent = this.i18n.t('auto_update_dict');
            updateLabel.style.fontWeight = 'bold';
            updateLabel.style.cursor = 'pointer';
            
            const controlsDiv = document.createElement('div');
            applyStyles(controlsDiv, { display: 'flex', alignItems: 'center', gap: '8px' });
            
            const autoUpdateToggle = document.createElement('input');
            autoUpdateToggle.type = 'checkbox';
            autoUpdateToggle.checked = config.autoUpdateDict;
            autoUpdateToggle.style.width = '18px';
            autoUpdateToggle.style.height = '18px';
            autoUpdateToggle.style.cursor = 'pointer';
            
            const forceUpdateBtn = document.createElement('button');
            forceUpdateBtn.textContent = '🔄';
            applyStyles(forceUpdateBtn, { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '0' });
            forceUpdateBtn.title = 'Force Update';
            
            controlsDiv.appendChild(autoUpdateToggle);
            controlsDiv.appendChild(forceUpdateBtn);
            
            updateGroup.appendChild(updateLabel);
            updateGroup.appendChild(controlsDiv);
            modal.appendChild(updateGroup);
            
            const syncStatusEl = document.createElement('div');
            syncStatusEl.style.fontSize = '11px';
            syncStatusEl.style.color = '#666';
            syncStatusEl.style.marginTop = '-12px';
            modal.appendChild(syncStatusEl);
            
            const hr = document.createElement('hr');
            applyStyles(hr, { border: '0', borderTop: '1px solid #ccc', margin: '0' });
            modal.appendChild(hr);

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
                if (config.uiLang === code) opt.selected = true;
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
                cb.checked = config.filterLangs.includes(code);
                
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
                
                config.autoUpdateDict = autoUpdateToggle.checked;
                config.uiLang = uiLang;
                config.filterLangs = filterLangs;
                this.config.save(config);
            };
            
            const updateStatusText = () => {
                const status = GM_getValue('ljsm_sync_status', 'ok');
                const needsReload = GM_getValue('ljsm_sync_needs_reload', false);
                let text = '';
                if (!autoUpdateToggle.checked) {
                    text = this.i18n.t('sync_status_disabled');
                } else if (status === 'error') {
                    text = this.i18n.t('sync_status_error');
                } else {
                    text = this.i18n.t('sync_status_ok');
                    if (needsReload) {
                        text += '<span style="color:#d11124; font-weight:bold;">' + this.i18n.t('reload_required') + '</span>';
                    }
                }
                syncStatusEl.innerHTML = text;
            };
            updateStatusText();
            autoUpdateToggle.addEventListener('change', updateStatusText);

            forceUpdateBtn.onclick = () => {
                if (!autoUpdateToggle.checked) return;
                forceUpdateBtn.style.opacity = '0.5';
                GM_setValue('ljsm_dict_last_sync', 0); // Force sync
                syncDictionariesIfNeeded(this.config, () => {
                    updateStatusText();
                    forceUpdateBtn.style.opacity = '1';
                });
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
                const path = window.location.pathname;
                if (path !== '/' && !path.startsWith('/feed')) return;

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
                    const path = window.location.pathname;
                    if (path === '/' || path.startsWith('/feed')) {
                        this.processFeed();
                    }
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
    const configMgr = new ConfigManager();
    
    syncDictionariesIfNeeded(configMgr.config, (cachedDict) => {
        const i18n = new I18nManager(configMgr.config, cachedDict);
        const ui = new UIManager(configMgr, i18n);
        
        if (configMgr.config.filterLangs && configMgr.config.filterLangs.length > 0) {
            const feed = new FeedObserver(i18n);
            feed.start();
        }
        ui.initMenu(configMgr.config);
    });

})();
