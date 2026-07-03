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
        strong_positive: ["we're hiring", "we are hiring", "hiring!", "join our team", "we are looking for", "we're looking for"],
            positive: ["hiring", "vacancy", "vacancies", "job opening", "opening", "looking for a", "we are looking for", "join our team", "open role", "open position", "jobs recommended for you", "friday opportunities", "job opportunities", "career opportunities"],
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
        strong_positive: ["нанимаем!", "мы ищем", "присоединяйтесь к нашей команде", "присоединяйтесь к команде", "открыта вакансия"],
            positive: ["нанимаем", "вакансия", "вакансии", "открыта вакансия", "открытие", "ищем", "мы ищем", "присоединяйтесь к нашей команде", "присоединяйтесь к команде", "открыта роль", "открыта позиция", "открытую позицию", "найм", "в поиске", "рекомендуемые вакансии", "пятничные возможности", "возможности трудоустройства", "карьерные возможности"],
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
        strong_positive: ["estamos contratando", "estamos buscando", "únete a nuestro equipo"],
            positive: ["contratando", "vacante", "vacantes", "oferta de trabajo", "apertura", "buscando un", "estamos buscando", "únete a nuestro equipo", "rol abierto", "puesto abierto", "empleos recomendados para ti", "oportunidades de empleo", "oportunidades de carrera"],
        negative: ["buscando trabajo", "buscando empleo", "marca personal", "oportunidad de negocio", "abierto a trabajar", "opentowork", "contrátame", "#busquedadeempleo", "#consejosdecurriculum", "#tendenciasdecontratacion"]
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
        strong_positive: ["wir stellen ein", "wir suchen", "trete unserem team bei"],
            positive: ["einstellen", "vakanz", "stellenangebot", "wir suchen", "trete unserem team bei", "offene rolle", "offene position", "für dich empfohlene jobs", "möglichkeiten", "stellenangebote", "karrierechancen"],
        negative: ["auf der suche nach einem job", "arbeitssuchend", "personal branding", "geschäftsmöglichkeit", "offen für arbeit", "opentowork", "stell mich ein", "#jobsuche", "#lebenslauftipps", "#einstellungstrends"]
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
        strong_positive: ["nous embauchons", "nous recrutons", "nous recherchons", "rejoignez notre équipe"],
            positive: ["embauche", "poste vacant", "postes vacants", "offre d'emploi", "ouverture", "à la recherche d'un", "nous recherchons", "rejoignez notre équipe", "rôle ouvert", "poste ouvert", "emplois recommandés pour vous", "opportunités d'emploi", "opportunités de carrière"],
        negative: ["à la recherche d'un emploi", "cherche du travail", "marque personnelle", "opportunité d'affaires", "ouvert au travail", "opentowork", "embauchez-moi", "#rechercheemploi", "#conseilscv", "#tendancesembauche"]
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
        strong_positive: ["我们在招聘", "我们正在寻找", "加入我们的团队"],
            positive: ["招聘", "空缺", "职位空缺", "寻找", "我们正在寻找", "加入我们的团队", "开放职位", "为你推荐的工作", "机会", "就业机会", "职业机会"],
        negative: ["找工作", "个人品牌", "商业机会", "开放工作", "opentowork", "雇用我", "#求职", "#简历技巧", "#招聘趋势"]
    }
};
