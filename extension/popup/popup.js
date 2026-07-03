document.addEventListener('DOMContentLoaded', () => {
    const uiLangSelect = document.getElementById('livf-ui-lang');
    const filterLangsContainer = document.getElementById('livf-filter-langs');
    const saveBtn = document.getElementById('livf-save-btn');
    const saveStatus = document.getElementById('save-status');
    const enableToggle = document.getElementById('livf-enable-toggle');

    const browserLang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    const supportedLangs = Object.keys(DICTIONARIES);
    const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';

    let currentUiLang = defaultLang;

    // Load settings from Chrome Sync Storage
    chrome.storage.sync.get({
        ljsm_enabled: true,
        ljsm_uiLang: defaultLang,
        ljsm_filterLangs: [defaultLang, 'en']
    }, (items) => {
        enableToggle.checked = items.ljsm_enabled;
        currentUiLang = items.ljsm_uiLang;
        const filterLangs = [...new Set(items.ljsm_filterLangs)];
        
        renderUI(currentUiLang, filterLangs);
    });

    function renderUI(uiLang, filterLangs) {
        currentUiLang = uiLang;
        const uiDict = DICTIONARIES[uiLang].ui;

        // Apply translations
        document.getElementById('settings-title').textContent = uiDict.settings_title;
        document.getElementById('enable-filtering-label').textContent = uiDict.enable_filtering;
        document.getElementById('ui-language-label').textContent = uiDict.ui_language;
        document.getElementById('filter-languages-label').textContent = uiDict.filter_languages;
        saveBtn.textContent = uiDict.save;

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
        renderUI(e.target.value, selectedFilters);
    });

    saveBtn.addEventListener('click', () => {
        const uiLang = uiLangSelect.value;
        const filterLangs = Array.from(filterLangsContainer.querySelectorAll('input:checked')).map(cb => cb.value);

        if (filterLangs.length === 0) {
            alert("Please select at least one filtering language.");
            return;
        }

        chrome.storage.sync.set({
            ljsm_enabled: enableToggle.checked,
            ljsm_uiLang: uiLang,
            ljsm_filterLangs: filterLangs
        }, () => {
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
});
