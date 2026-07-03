document.addEventListener('DOMContentLoaded', () => {
    const uiLangSelect = document.getElementById('livf-ui-lang');
    const filterLangsContainer = document.getElementById('livf-filter-langs');
    const saveBtn = document.getElementById('livf-save-btn');
    const saveStatus = document.getElementById('save-status');
    const enableToggle = document.getElementById('livf-enable-toggle');
    const autoUpdateToggle = document.getElementById('livf-auto-update-toggle');
    const forceUpdateBtn = document.getElementById('livf-force-update-btn');
    const syncStatusEl = document.getElementById('sync-status');

    const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    const supportedLangs = Object.keys(DICTIONARIES);
    const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';

    let currentUiLang = defaultLang;

    // Load settings from Chrome Sync Storage
    chrome.storage.sync.get({
        ljsm_enabled: true,
        ljsm_auto_update_dict: true,
        ljsm_sync_status: 'ok',
        ljsm_sync_needs_reload: false,
        ljsm_uiLang: defaultLang,
        ljsm_filterLangs: [defaultLang, 'en']
    }, (items) => {
        enableToggle.checked = items.ljsm_enabled;
        autoUpdateToggle.checked = items.ljsm_auto_update_dict;
        currentUiLang = items.ljsm_uiLang;
        const filterLangs = [...new Set(items.ljsm_filterLangs)];
        
        renderUI(currentUiLang, filterLangs, items);
    });

    function renderUI(uiLang, filterLangs, items) {
        currentUiLang = uiLang;
        const uiDict = DICTIONARIES[uiLang].ui;

        // Apply translations
        document.getElementById('settings-title').textContent = uiDict.settings_title;
        document.getElementById('enable-filtering-label').textContent = uiDict.enable_filtering;
        document.getElementById('auto-update-dict-label').textContent = uiDict.auto_update_dict;
        document.getElementById('ui-language-label').textContent = uiDict.ui_language;
        document.getElementById('filter-languages-label').textContent = uiDict.filter_languages;
        saveBtn.textContent = uiDict.save;
        
        // Sync Status logic
        let statusText = '';
        if (!autoUpdateToggle.checked) {
            statusText = uiDict.sync_status_disabled;
        } else if (items && items.ljsm_sync_status === 'error') {
            statusText = uiDict.sync_status_error;
        } else {
            statusText = uiDict.sync_status_ok;
            if (items && items.ljsm_sync_needs_reload) {
                statusText += `<span style="color:#d11124; font-weight:bold;">${uiDict.reload_required}</span>`;
            }
        }
        syncStatusEl.innerHTML = statusText;

        // Populate UI Language Select
        uiLangSelect.innerHTML = '';
        Object.entries(DICTIONARIES).forEach(([code, dict]) => {
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = dict.name;
            if (code === uiLang) opt.selected = true;
            uiLangSelect.appendChild(opt);
        });

        // Populate Checkboxes
        filterLangsContainer.innerHTML = '';
        Object.entries(DICTIONARIES).forEach(([code, dict]) => {
            const label = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = code;
            cb.checked = filterLangs.includes(code);
            label.appendChild(cb);
            label.appendChild(document.createTextNode(dict.name));
            filterLangsContainer.appendChild(label);
        });
    }

    // Live translation update when changing UI language
    uiLangSelect.addEventListener('change', (e) => {
        const selectedFilters = Array.from(filterLangsContainer.querySelectorAll('input:checked')).map(cb => cb.value);
        chrome.storage.sync.get(['ljsm_sync_status', 'ljsm_sync_needs_reload'], (items) => {
            renderUI(e.target.value, selectedFilters, items);
        });
    });

    // Update status visually on toggle immediately
    autoUpdateToggle.addEventListener('change', () => {
        chrome.storage.sync.get(['ljsm_sync_status', 'ljsm_sync_needs_reload'], (items) => {
            renderUI(uiLangSelect.value, Array.from(filterLangsContainer.querySelectorAll('input:checked')).map(cb => cb.value), items);
        });
    });

    saveBtn.addEventListener('click', () => {
        const uiLang = uiLangSelect.value;
        const filterLangs = Array.from(filterLangsContainer.querySelectorAll('input:checked')).map(cb => cb.value);

        const settings = {
            ljsm_enabled: enableToggle.checked,
            ljsm_auto_update_dict: autoUpdateToggle.checked,
            ljsm_uiLang: uiLang,
            ljsm_filterLangs: filterLangs
        };

        chrome.storage.sync.set(settings, () => {
            saveStatus.style.opacity = 1;
            setTimeout(() => saveStatus.style.opacity = 0, 2000);
            
            // Reload LinkedIn tabs
            chrome.tabs.query({url: "*://*.linkedin.com/*"}, function(tabs) {
                for (let tab of tabs) {
                    chrome.tabs.reload(tab.id);
                }
            });
        });
    });

    forceUpdateBtn.addEventListener('click', () => {
        if (!autoUpdateToggle.checked) return;
        
        forceUpdateBtn.style.opacity = '0.5';
        const DICT_URL = 'https://raw.githubusercontent.com/i-s-rusakov/job-seeking-mode-for-linkedin/master/dictionaries.json';
        
        fetch(DICT_URL)
            .then(r => r.json())
            .then(data => {
                chrome.storage.local.set({
                    ljsm_dict_last_sync: Date.now(),
                    ljsm_cached_dict: data
                }, () => {
                    chrome.storage.sync.set({ 
                        ljsm_sync_status: 'ok',
                        ljsm_sync_needs_reload: true 
                    }, () => {
                        forceUpdateBtn.style.opacity = '1';
                        chrome.storage.sync.get(null, (newItems) => {
                           renderUI(currentUiLang, Array.from(filterLangsContainer.querySelectorAll('input:checked')).map(cb => cb.value), newItems); 
                        });
                    });
                });
            })
            .catch(e => {
                chrome.storage.sync.set({ ljsm_sync_status: 'error' }, () => {
                    forceUpdateBtn.style.opacity = '1';
                    chrome.storage.sync.get(null, (newItems) => {
                        renderUI(currentUiLang, Array.from(filterLangsContainer.querySelectorAll('input:checked')).map(cb => cb.value), newItems);
                    });
                });
            });
    });
});
