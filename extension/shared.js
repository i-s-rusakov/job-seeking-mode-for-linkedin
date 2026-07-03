const DICTIONARIES = {
    en: {
        name: "English",
        ui: {
            settings_title: "Language Settings",
            enable_filtering: "Enable Job Seeking Mode",
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
            enable_filtering: "Включить Режим Поиска Работы",
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
            enable_filtering: "Habilitar Modo Búsqueda de Empleo",
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
            enable_filtering: "Jobsuche-Modus Aktivieren",
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
            enable_filtering: "Activer le Mode Recherche d'Emploi",
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
            enable_filtering: "启用求职模式",
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
