import json
import re

new_dictionaries = {
  "en": {
    "strong_positive": ["we're hiring", "we are hiring", "hiring!", "join our team", "we are looking for", "we're looking for"],
    "positive": ["hiring", "vacancy", "vacancies", "job opening", "opening", "looking for a", "we are looking for", "join our team", "open role", "open position", "jobs recommended for you", "friday opportunities", "job opportunities", "career opportunities"],
    "negative": ["looking for a job", "looking for work", "personal branding", "business opportunity", "open to work", "opentowork", "hire me", "#jobsearch", "#resumetips", "#hiringtrends"]
  },
  "ru": {
    "strong_positive": ["нанимаем!", "мы ищем", "присоединяйтесь к нашей команде", "присоединяйтесь к команде", "открыта вакансия"],
    "positive": ["нанимаем", "вакансия", "вакансии", "открыта вакансия", "открытие", "ищем", "мы ищем", "присоединяйтесь к нашей команде", "присоединяйтесь к команде", "открыта роль", "открыта позиция", "открытую позицию", "найм", "в поиске", "рекомендуемые вакансии", "пятничные возможности", "возможности трудоустройства", "карьерные возможности"],
    "negative": ["ищу работу", "поиск работы", "поискработы", "персональный бренд", "бизнес возможность", "открыт к предложениям", "найми меня", "#поискработы", "#советыпорезюме", "#трендынайма"]
  },
  "es": {
    "strong_positive": ["estamos contratando", "estamos buscando", "únete a nuestro equipo"],
    "positive": ["contratando", "vacante", "vacantes", "oferta de trabajo", "apertura", "buscando un", "estamos buscando", "únete a nuestro equipo", "rol abierto", "puesto abierto", "empleos recomendados para ti", "oportunidades de empleo", "oportunidades de carrera"],
    "negative": ["buscando trabajo", "buscando empleo", "marca personal", "oportunidad de negocio", "abierto a trabajar", "opentowork", "contrátame", "#busquedadeempleo", "#consejosdecurriculum", "#tendenciasdecontratacion"]
  },
  "de": {
    "strong_positive": ["wir stellen ein", "wir suchen", "trete unserem team bei"],
    "positive": ["einstellen", "vakanz", "stellenangebot", "wir suchen", "trete unserem team bei", "offene rolle", "offene position", "für dich empfohlene jobs", "möglichkeiten", "stellenangebote", "karrierechancen"],
    "negative": ["auf der suche nach einem job", "arbeitssuchend", "personal branding", "geschäftsmöglichkeit", "offen für arbeit", "opentowork", "stell mich ein", "#jobsuche", "#lebenslauftipps", "#einstellungstrends"]
  },
  "fr": {
    "strong_positive": ["nous embauchons", "nous recrutons", "nous recherchons", "rejoignez notre équipe"],
    "positive": ["embauche", "poste vacant", "postes vacants", "offre d'emploi", "ouverture", "à la recherche d'un", "nous recherchons", "rejoignez notre équipe", "rôle ouvert", "poste ouvert", "emplois recommandés pour vous", "opportunités d'emploi", "opportunités de carrière"],
    "negative": ["à la recherche d'un emploi", "cherche du travail", "marque personnelle", "opportunité d'affaires", "ouvert au travail", "opentowork", "embauchez-moi", "#rechercheemploi", "#conseilscv", "#tendancesembauche"]
  },
  "zh": {
    "strong_positive": ["我们在招聘", "我们正在寻找", "加入我们的团队"],
    "positive": ["招聘", "空缺", "职位空缺", "寻找", "我们正在寻找", "加入我们的团队", "开放职位", "为你推荐的工作", "机会", "就业机会", "职业机会"],
    "negative": ["找工作", "个人品牌", "商业机会", "开放工作", "opentowork", "雇用我", "#求职", "#简历技巧", "#招聘趋势"]
  }
}

with open("dictionaries.json", "w", encoding="utf-8") as f:
    json.dump(new_dictionaries, f, indent=2, ensure_ascii=False)

def update_js_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    for lang, dicts in new_dictionaries.items():
        # find the positive line for the language
        # Example: positive: ["hiring", ...],
        positive_pattern = r'(\s+)(positive:\s*\[.*?\])'
        
        # We need to target the block for the specific language, so we first find the lang block
        # Actually it is easier to replace `positive: [...]` with `strong_positive: [...],\n        positive: [...]`
        # But we must do it only for the correct language block.
        lang_pattern = r'(\b' + lang + r'\s*:\s*\{[^{}]*ui:\s*\{[^{}]*\}(.*?))positive:\s*\[.*?\]'
        
        match = re.search(lang_pattern, content, flags=re.DOTALL)
        if match:
            strong_json = json.dumps(dicts["strong_positive"], ensure_ascii=False)
            pos_json = json.dumps(dicts["positive"], ensure_ascii=False)
            neg_json = json.dumps(dicts["negative"], ensure_ascii=False)
            
            replacement = f'{match.group(1)}strong_positive: {strong_json},\n            positive: {pos_json}'
            # Also replace negative just to be sure
            content = content[:match.start()] + replacement + content[match.end():]

            # Replace negative line
            neg_pattern = r'(\s+)(negative:\s*\[.*?\])'
            # We'll just replace the first negative line after our replacement point
            neg_match = re.search(neg_pattern, content[match.start():])
            if neg_match:
                start = match.start() + neg_match.start(2)
                end = match.start() + neg_match.end(2)
                content = content[:start] + f'negative: {neg_json}' + content[end:]
                
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

update_js_file("extension/shared.js")
update_js_file("userscript/job-seeking-mode-for-linkedin.user.js")
