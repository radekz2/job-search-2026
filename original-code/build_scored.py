#!/usr/bin/env python3
"""
Job search report builder with 0-10 skill-match scoring.

Scoring is grounded in Radek Zajkowski's aggregate resume profile:
  - 20+ yrs technology leadership (enterprise software/services, SaaS, cloud)
  - Enterprise applications / business-systems management (TVO, ~$2M budget, 20+ apps)
  - SaaS governance, vendor management, RFP / procurement / licensing
  - AI enablement & responsible-AI governance (authored TVO GenAI policy)
  - Cloud migration (AWS/Azure/SaaS); DevOps & CI/CD strategy (not hands-on)
  - Atlassian Suite (Jira/JSM/Confluence), Microsoft Copilot 365 / M365
  - ITIL4, service management (SLAs, change management)
  - People leadership (8-11 reports), Agile/Scrum, cross-functional stakeholders
  - Prior roles: CTO, VP Technology, Director of Development, Technical Architect
Target: Manager/Director in technology (Software Manager, IT Manager, Director of
Technology / Enterprise Applications). NOT hands-on development-manager roles.
"""
import json, re, html
from collections import Counter
from datetime import date

def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()

def esc(s):
    return html.escape(s or "")

# ---------------- load ----------------
li = json.load(open('/opt/data/resumes/results.json'))['li']
jb = json.load(open('/opt/data/resumes/results.json'))['jb']
ca = json.load(open('/opt/data/resumes/results_ca_remote.json'))

records = []
for r in li:
    if r.get('remote'):
        continue
    records.append(dict(title=r['title'], company=r['company'], location=r['location'],
        link=r['link'], source='LinkedIn', remote=False, salary='', date='', telework=''))
for r in ca:
    records.append(dict(title=r['title'], company=r['company'], location=r['location'],
        link=r['link'], source='LinkedIn', remote=True, salary='', date='', telework=''))
for r in jb:
    records.append(dict(title=r['title'].title(), company=r['company'],
        location=strip_tags(r['location']).replace('Location', '').strip(),
        link=r['link'], source='Job Bank', remote=False,
        salary=strip_tags(r['salary']).replace('Salary', '').strip(),
        date=r['date'], telework=r['telework']))
try:
    ats = json.load(open('/opt/data/resumes/results_ats.json'))
except (FileNotFoundError, ValueError):
    ats = []
for r in ats:
    records.append(dict(title=r['title'], company=r['company'], location=r['location'],
        link=r['link'], source=r.get('source', 'ATS'), remote=bool(r.get('remote')),
        salary=r.get('salary', ''), date=r.get('date', ''), telework=r.get('telework', ''),
        description=r.get('description', '')))
try:
    wd = json.load(open('/opt/data/resumes/results_workday.json'))
except (FileNotFoundError, ValueError):
    wd = []
for r in wd:
    records.append(dict(title=r['title'], company=r['company'], location=r['location'],
        link=r['link'], source='Workday', remote=bool(r.get('remote')),
        salary=r.get('salary', ''), date=r.get('date', ''), telework=r.get('telework', ''),
        description=r.get('description', '')))
try:
    az = json.load(open('/opt/data/resumes/results_adzuna.json'))
except (FileNotFoundError, ValueError):
    az = []
for r in az:
    records.append(dict(title=r['title'], company=r['company'], location=r['location'],
        link=r['link'], source='Adzuna', remote=bool(r.get('remote')),
        salary=r.get('salary', ''), date=r.get('date', ''), telework=r.get('telework', ''),
        description=r.get('description', '')))

# ---------------- filters (unchanged) ----------------
MGMT = re.compile(
    r'\b(manager|director|head|head of|vp|vice[- ]president|avp|svp|evp|chief|cto|cio|lead'
    r'|supervisor|responsable|directeur|directrice|chef d[\u2019\']\u00e9quipe|gestionnaire)\b', re.I)
DEV_EXCLUDE = re.compile(
    r'\b(software development manager|development manager|team lead|tech lead|technical lead'
    r'|software development director|director of software development|manager, software development'
    r'|application development director|software development)\b', re.I)

def is_management(t): return bool(MGMT.search(t))
def is_dev_excluded(t): return bool(DEV_EXCLUDE.search(t))

# non-tech FUNCTION managers (sales/marketing/HR/etc.) — not the target audience
NON_TECH_FN = re.compile(
    r'\b(sales|account executive|account manager|business development|revenue operations|revenue growth'
    r'|marketing|brand|communications|content|creative|social media'
    r'|human resources|\bhr\b|people operations|people &|recruiting|talent acquisition'
    r'|customer success|customer operations|client success|client services|customer experience'
    r'|finance|accounting|payroll|treasury|financial planning'
    r'|legal|counsel|public policy|government affairs|regulatory'
    r'|supply chain|logistics|warehouse|purchasing'
    r'|store operations|retail operations|field operations)\b', re.I)
TECH_SIGNAL = re.compile(
    r'\b(it|information technology|technology|software|engineering|platform|infrastructure|data'
    r'|analytics|\bai\b|artificial intelligence|machine learning|cloud|devops|cyber|security'
    r'|systems|digital|saas|automation|technical|enterprise|erp|sap|workday|salesforce|oracle)\b', re.I)

def is_nontech_fn(t):
    # clearly non-tech function AND no tech signal -> drop
    return bool(NON_TECH_FN.search(t)) and not bool(TECH_SIGNAL.search(t))

# ---------------- scoring model ----------------
DIRECTOR = re.compile(r'\b(director|vp|vice president|head of|chief|cto|cio|directeur|directrice)\b', re.I)

NARROW_FN = re.compile(r'\b(sap|oracle|workday|d365|dynamics|salesforce|plm|cad|help desk|service desk'
                       r'|endpoint|license|licensing|asset|support|business analyst)\b', re.I)

IT_TECH = re.compile(r'\b(it|information technology|technology|tech|informatique|num\u00e9rique)\b', re.I)
ENTERPRISE = re.compile(r'\b(enterprise|business systems|business system|business applications|business application'
                        r'|application|applications|portfolio|corporate systems|information systems)\b', re.I)
SAAS_CLOUD = re.compile(r'\b(saas|software as a service|cloud|cloud platform|cloud enablement|aws|azure)\b', re.I)
AI = re.compile(r'\b(ai|a\.i\.|agentic|llm|large language model|copilot|generative|automation|innovation'
                r'|digital transformation|transformation|responsible ai|machine learning|ml)\b', re.I)
COLLAB = re.compile(r'\b(collaboration|productivity|atlassian|jira|confluence|microsoft 365|office 365|microsoft|m365|365)\b', re.I)
VENDOR = re.compile(r'\b(vendor|procurement|rfp|governance|licensing|compliance|budget|contract|contracts|negotiation)\b', re.I)
SERVICE = re.compile(r'\b(service management|it service management|itil|service delivery|itsm|it operations|it ops|techops|operations|sla)\b', re.I)
DATA = re.compile(r'\b(data platform|data engineering|data governance|analytics|data|business intelligence|power bi|fabric|reporting|dashboard)\b', re.I)
PLATFORM = re.compile(r'\b(platform|developer platform|developer experience|developer excellence)\b', re.I)
INFRA = re.compile(r'\b(infrastructure|network|endpoint|workspace|virtual workspace)\b', re.I)
SECURITY = re.compile(r'\b(security|cyber|cybersecurity)\b', re.I)
ERP = re.compile(r'\b(erp|sap|oracle|workday|d365|dynamics|crm|salesforce|plm|hcm)\b', re.I)
HELPDESK = re.compile(r'\b(help desk|service desk|support)\b', re.I)

# dev-lean (software engineering / engineering manager — user open to "Software Manager" but these lean dev)
SW_DEV = re.compile(r'(software engineering|engineering manager|engineering director|manager software engineering'
                    r'|director of engineering|director, engineering|head of engineering|vp of engineering'
                    r'|software manager|software engineering manager)', re.I)

def loc_rank(loc):
    l = loc.lower()
    if 'toronto' in l: return 'toronto'
    if any(x in l for x in ['mississauga','vaughan','markham','north york','etobicoke','scarborough',
        'greater toronto','richmond hill','oakville','woodbridge','courtice','milton','st. catharines',
        'georgetown','hamilton','waterloo','cambridge','kitchener','guelph','oshawa','lindsay','concord',
        'brampton','ajax','pickering','newmarket','aurora','whitby']):
        return 'gta'
    if 'ontario' in l or 'ontario' in l.replace(', canada',''):
        return 'ontario'
    return 'canada'

def score(r):
    t = r['title'].lower()
    loc = (r['location'] or '').lower()

    # 1) Seniority / level  (0 - 3.0)
    if DIRECTOR.search(t):
        seniority = 3.0
    else:
        seniority = 2.5
    if NARROW_FN.search(t):
        seniority -= 0.5

    # 2) Domain fit  (0.5 - 3.0)
    dom = 1.5
    if IT_TECH.search(t): dom += 0.5
    if ENTERPRISE.search(t): dom += 0.5
    if SAAS_CLOUD.search(t): dom += 0.5
    if AI.search(t): dom += 0.5
    if COLLAB.search(t): dom += 0.5
    if VENDOR.search(t): dom += 0.5
    if SERVICE.search(t): dom += 0.5
    if DATA.search(t): dom += 0.25
    if PLATFORM.search(t): dom += 0.25
    if SECURITY.search(t): dom -= 0.5
    if ERP.search(t): dom -= 0.5
    if HELPDESK.search(t): dom -= 1.0
    dom = max(0.5, min(3.0, dom))

    dev_lean = bool(SW_DEV.search(t))
    if dev_lean:
        dom = min(dom, 1.5)

    # 3) Location  (0 - 2.0)
    lk = loc_rank(loc)
    if r['remote']:
        location = 1.5
    else:
        location = {'toronto': 2.0, 'gta': 1.6, 'ontario': 1.3, 'canada': 1.0}[lk]

    # 4) Differentiators  (0 - 2.0)
    diff = 0.0
    if AI.search(t):
        diff += 1.0
    if re.search(r'\b(enterprise|portfolio|global|strategy|platform|products)\b', t):
        diff += 1.0
    diff = min(2.0, diff)

    total = seniority + dom + location + diff
    if dev_lean:
        total -= 1.0   # user explicitly does NOT want dev-manager roles
    total = round(max(0.0, min(10.0, total)), 1)

    # rationale signals
    flags = []
    if dev_lean: flags.append('leans hands-on dev')
    if SECURITY.search(t): flags.append('security-heavy')
    if INFRA.search(t): flags.append('infrastructure-focused')
    if ERP.search(t): flags.append('specialist ERP/config')
    if HELPDESK.search(t): flags.append('below seniority (help desk)')
    if NARROW_FN.search(t) and not re.search(r'\b(manager|director)\b', t):
        flags.append('narrow function')

    strengths = []
    if ENTERPRISE.search(t): strengths.append('enterprise applications')
    if VENDOR.search(t): strengths.append('vendor/governance')
    if AI.search(t): strengths.append('AI/innovation')
    if SAAS_CLOUD.search(t): strengths.append('SaaS/cloud')
    if COLLAB.search(t): strengths.append('collaboration tools')
    if SERVICE.search(t): strengths.append('service management')
    if DATA.search(t): strengths.append('data/analytics')
    if IT_TECH.search(t) and not strengths: strengths.append('IT leadership')

    return total, dev_lean, flags, strengths

# ---------------- build ----------------
kept = []
for r in records:
    t = r['title'].strip()
    if not t or not is_management(t) or is_dev_excluded(t) or is_nontech_fn(t):
        continue
    sc, dev_lean, flags, strengths = score(r)
    r['score'] = sc
    r['dev_lean'] = dev_lean
    r['flags'] = flags
    r['strengths'] = strengths
    r['bucket'] = 'sw' if dev_lean else 'it'
    kept.append(r)

# dedupe (title+company)
seen = set(); dedup = []
for r in kept:
    key = (r['title'].lower(), r['company'].lower())
    if key in seen:
        continue
    seen.add(key); dedup.append(r)

def level_of(t):
    return 'director' if DIRECTOR.search(t) else 'manager'
for r in dedup:
    r['level'] = level_of(r['title'])
    r['link'] = re.sub(r'\?.*$', '', r['link']) if 'linkedin.com/jobs/view/' in r['link'] else r['link']

# sort within each section by score desc, then location
def sort_key(r):
    return (-r['score'], r['title'].lower())
dedup.sort(key=lambda r: (1 if r['level']=='director' else 0, 0 if r['bucket']=='it' else 1, -r['score'], r['title'].lower()))

it = [r for r in dedup if r['bucket']=='it']
sw = [r for r in dedup if r['bucket']=='sw']
it_dir = [r for r in it if r['level']=='director']
it_mgr = [r for r in it if r['level']=='manager']
sw_dir = [r for r in sw if r['level']=='director']
sw_mgr = [r for r in sw if r['level']=='manager']

# re-sort each section by score desc
for sec in (it_dir, it_mgr, sw_dir, sw_mgr):
    sec.sort(key=lambda r: (-r['score'], r['title'].lower()))

today = date.today().isoformat()

# --- deep-dive results (full-description analysis) ---
try:
    _dd = json.load(open('/opt/data/resumes/deep_results.json'))
    deep_rows = [x for x in _dd if x.get('fetched') and x.get('deep') is not None]
    deep_rows.sort(key=lambda x: -(x['deep']))
except (FileNotFoundError, ValueError):
    deep_rows = []

# --- LLM evaluation results (PRIMARY ranking) ---
_EXCLUDED_SENIORITY = {'vp', 'vice president', 'svp', 'evp', 'chief', 'c-level'}
try:
    _llm = json.load(open('/opt/data/resumes/llm_results.json'))
    _all_llm = [x for x in _llm if x.get('llm_score') is not None]
    # VP/C-level roles are excluded from consideration (per user instruction)
    llm_excluded = [x for x in _all_llm if (x.get('seniority') or '').lower().strip() in _EXCLUDED_SENIORITY]
    _excl_links = {x.get('link') for x in llm_excluded}
    llm_rows = [x for x in _all_llm if x.get('link') not in _excl_links]
    # manager-first ordering (user preference), then score desc
    _sen_order = {'manager': 0, 'director': 1}
    llm_rows.sort(key=lambda x: (_sen_order.get((x.get('seniority') or 'manager').lower(), 9),
                                 -(x.get('llm_score') or 0), (x.get('title') or '').lower()))
    llm_mgr = [x for x in llm_rows if (x.get('seniority') or 'manager').lower() == 'manager']
    llm_dir = [x for x in llm_rows if (x.get('seniority') or 'manager').lower() != 'manager']
except (FileNotFoundError, ValueError):
    llm_rows = []; llm_mgr = []; llm_dir = []; llm_excluded = []

def score_color(s):
    if s >= 8.0: return 'high'
    if s >= 6.5: return 'good'
    if s >= 5.0: return 'mid'
    return 'low'

def score_label(s):
    c = score_color(s)
    return {'high': 'Strong', 'good': 'Good', 'mid': 'Moderate', 'low': 'Weak'}[c]

def _yn(x):
    return '1' if x else ''

def src_class(s):
    s = (s or '').lower()
    if s == 'linkedin': return 'linkedin'
    if s == 'job bank': return 'jobbank'
    if s in ('greenhouse', 'lever', 'ashby'): return 'ats'
    if s == 'workday': return 'workday'
    if s == 'adzuna': return 'adzuna'
    return 'other'

def rationale(r):
    parts = []
    if r['strengths']:
        parts.append("matches: " + ", ".join(r['strengths']))
    if r['flags']:
        parts.append("caveats: " + ", ".join(r['flags']))
    return "; ".join(parts) if parts else "general technology leadership"

# ================= LLM EVALUATION (PRIMARY) =================
def rec_class(rec):
    r = (rec or '').lower()
    if r == 'apply': return 'rec-apply'
    if r == 'skip': return 'rec-skip'
    return 'rec-review'

def html_llm_item(d, i):
    badges = []
    sc = d.get('llm_score') or 0
    badges.append(f'<span class="score {score_color(sc)}">{sc:.1f}<i>/10</i></span>')
    if d.get('verdict'): badges.append(badge(d['verdict'], 'scoretag'))
    if d.get('recommendation'): badges.append(badge(d['recommendation'], rec_class(d['recommendation'])))
    if d.get('remote'): badges.append(badge('Remote', 'remote'))
    badges.append(badge(d.get('source', ''), src_class(d.get('source', ''))))
    meta = [esc(d.get('company', ''))]
    if d.get('location'): meta.append(esc(d['location']))
    lines = []
    if d.get('fit_summary'):
        lines.append(f'<div class="dd-line llm-summary">{esc(d["fit_summary"])}</div>')
    if d.get('score_rationale'):
        lines.append(f'<div class="dd-line llm-why"><b>Why this score:</b> {esc(d["score_rationale"])}</div>')
    if d.get('strengths'):
        lines.append(f'<div class="dd-line"><b>Strengths:</b> {esc(", ".join(d["strengths"]))}</div>')
    if d.get('concerns'):
        lines.append(f'<div class="dd-line warn"><b>Concerns:</b> {esc(", ".join(d["concerns"]))}</div>')
    if d.get('hands_on_dev'):
        lines.append('<div class="dd-line warn"><b>Hands-on development signal</b> &mdash; likely excluded role.</div>')
    return f'''
      <li class="job" data-score="{d.get('llm_score') or 0}" data-verdict="{score_label(sc)}" data-recommendation="{d.get('recommendation') or ''}" data-source="{src_class(d.get('source',''))}" data-remote="{_yn(d.get('remote'))}">
        <div class="job-head">
          <span class="job-num">{i}</span>
          <a class="job-title" href="{esc(d.get('link',''))}" target="_blank" rel="noopener">{esc(d.get('title',''))}</a>
        </div>
        <div class="job-meta">{" &middot; ".join(meta)}</div>
        <div class="job-badges">{"".join(badges)}</div>
        {''.join(lines)}
      </li>'''

def html_llm():
    if not llm_rows:
        return ""
    def section(rows, title, accent):
        items = "".join(html_llm_item(d, i) for i, d in enumerate(rows, 1))
        return f'''
    <section class="section llm" id="{accent}" style="--accent:#0a66c2;">
      <h2>{esc(title)} <span class="count">{len(rows)}</span></h2>
      <p class="dd-note">Evaluated by an LLM reading each job description against the candidate's full resume profile &mdash; semantic fit, not keyword matching. Manager roles are listed first.</p>
      <ol class="jobs">{items}</ol>
    </section>'''
    out = ""
    if llm_mgr:
        out += section(llm_mgr, "LLM Evaluation — Manager Roles (primary)", "llm-mgr")
    if llm_dir:
        out += section(llm_dir, "LLM Evaluation — Director / Senior Roles (primary)", "llm-dir")
    return out

# ================= COLLAPSIBLE THRESHOLD =================
THRESHOLD = 8.0  # in the HTML report, jobs scoring below this are collapsed

# ================= DEEP-DIVE =================
def html_deep(rows):
    visible = []
    hidden = []
    for i, d in enumerate(rows, 1):
        tags = [f'<span class="score {score_color(d["deep"])}">{d["deep"]:.1f}<i>/10</i></span>']
        if d.get('remote'): tags.append(badge('Remote', 'remote'))
        tags.append(badge(d['source'], src_class(d['source'])))
        lines = []
        if d.get('matched'):
            lines.append(f'<div class="dd-line"><b>Matched:</b> {esc(", ".join(d["matched"]))}</div>')
        if d.get('neutrals'):
            lines.append(f'<div class="dd-line"><b>Also mentions:</b> {esc(", ".join(d["neutrals"]))}</div>')
        if d.get('negatives'):
            lines.append(f'<div class="dd-line warn"><b>Watch:</b> {esc(", ".join(d["negatives"]))}</div>')
        if d.get('french'):
            lines.append('<div class="dd-line warn"><b>French/bilingual description</b> — verify fit manually.</div>')
        meta = [esc(d['company'])]
        if d.get('location'): meta.append(esc(d['location']))
        item = f'''
      <li class="job" data-score="{d['deep']}" data-verdict="{score_label(d['deep'])}" data-recommendation="" data-source="{src_class(d['source'])}" data-remote="{_yn(d.get('remote'))}">
        <div class="job-head">
          <span class="job-num">{i}</span>
          <a class="job-title" href="{esc(d['link'])}" target="_blank" rel="noopener">{esc(d['title'])}</a>
        </div>
        <div class="job-meta">{" &middot; ".join(meta)}</div>
        <div class="job-badges">{"".join(tags)}</div>
        {''.join(lines)}
      </li>'''
        (visible if d['deep'] >= THRESHOLD else hidden).append(item)
    hidden_block = ""
    if hidden:
        hidden_block = f'''
    <details class="collapsible">
      <summary>Show {len(hidden)} more matches (scored below {THRESHOLD:.1f})</summary>
      <ol class="jobs">{''.join(hidden)}</ol>
    </details>'''
    shown_note = f'<span class="shown-note">{len(visible)} shown &middot; {len(hidden)} hidden</span>' if hidden else ""
    return f'''
    <section class="section deep" id="deep-dive" style="--accent:#0a66c2;">
      <h2>Deep-Dive — Top Matches (scored against full descriptions) <span class="count">{len(rows)}</span> {shown_note}</h2>
      <p class="dd-note">These top matches were re-scored using the actual job-description text (not just the title).
      &ldquo;Deep&rdquo; = title-based score blended with the posting&rsquo;s requirements &mdash; a more accurate fit signal.</p>
      <ol class="jobs">{''.join(visible)}</ol>
      {hidden_block}
    </section>'''

# ================= HTML =================
def badge(label, cls):
    return f'<span class="badge {cls}">{esc(label)}</span>'

def html_item(r, i):
    badges = []
    sc = r['score']
    badges.append(f'<span class="score {score_color(sc)}">{sc:.1f}<i>/10</i></span>')
    badges.append(badge(score_label(sc), 'scoretag'))
    if r['remote']: badges.append(badge('Remote', 'remote'))
    if r['telework'] and r['telework'].lower() not in ('on site',):
        badges.append(badge(r['telework'], 'hybrid'))
    if r['salary']: badges.append(badge(r['salary'], 'salary'))
    if r['date']: badges.append(badge('Posted ' + r['date'], 'date'))
    badges.append(badge(r['source'], src_class(r['source'])))
    meta = [esc(r['company'])]
    if r['location']: meta.append(esc(r['location']))
    why = esc(rationale(r))
    return f'''
      <li class="job" data-score="{r['score']}" data-verdict="{score_label(sc)}" data-recommendation="" data-source="{src_class(r['source'])}" data-remote="{_yn(r['remote'])}">
        <div class="job-head">
          <span class="job-num">{i}</span>
          <a class="job-title" href="{esc(r['link'])}" target="_blank" rel="noopener">{esc(r['title'])}</a>
        </div>
        <div class="job-meta">{" &middot; ".join(meta)}</div>
        <div class="job-badges">{"".join(badges)}</div>
        <div class="job-why">{why}</div>
      </li>'''

def html_section(title, rows, accent, anchor):
    visible = []
    hidden = []
    for i, r in enumerate(rows, 1):
        item = html_item(r, i)
        (visible if r['score'] >= THRESHOLD else hidden).append(item)
    hidden_block = ""
    if hidden:
        hidden_block = f'''
    <details class="collapsible">
      <summary>Show {len(hidden)} more matches (scored below {THRESHOLD:.1f})</summary>
      <ol class="jobs">{''.join(hidden)}</ol>
    </details>'''
    shown_note = f'<span class="shown-note">{len(visible)} shown &middot; {len(hidden)} hidden</span>' if hidden else ""
    return f'''
    <section class="section" id="{anchor}" style="--accent:{accent};">
      <h2>{esc(title)} <span class="count">{len(rows)}</span> {shown_note}</h2>
      <ol class="jobs">{''.join(visible)}</ol>
      {hidden_block}
    </section>'''

# --- table of contents ---
_toc_entries = []
if llm_mgr:
    _toc_entries.append(("llm-mgr", "LLM Evaluation — Manager Roles (primary)", len(llm_mgr)))
if llm_dir:
    _toc_entries.append(("llm-dir", "LLM Evaluation — Director / Senior Roles (primary)", len(llm_dir)))
if deep_rows:
    _toc_entries.append(("deep-dive", "Deep-Dive — Top Matches", len(deep_rows)))
_toc_entries += [
    ("mgr-it", "Manager — IT / Technology / Enterprise Applications", len(it_mgr)),
    ("mgr-sw", "Manager — Software / Engineering (review fit)", len(sw_mgr)),
    ("dir-it", "Director — IT / Technology / Enterprise Applications", len(it_dir)),
    ("dir-sw", "Director — Software / Engineering (review fit)", len(sw_dir)),
]
toc = '<nav class="toc" style="--accent:#0a66c2;" aria-label="Table of contents"><h2>Contents</h2><ol>'
for a, label, n in _toc_entries:
    toc += f'<li><a href="#{a}">{esc(label)} <span class="count">{n}</span></a></li>'
toc += '</ol></nav>'

# --- aggregate stats (unique companies / positions / cities + breakdowns) ---
_company_counts = Counter(r.get('company', '').strip() for r in dedup if r.get('company', '').strip())
_position_counts = Counter(r.get('title', '').strip() for r in dedup if r.get('title', '').strip())
_city_counts = Counter(r.get('location', '').strip() for r in dedup if r.get('location', '').strip())
n_companies = len(_company_counts)
n_positions = len(_position_counts)

def _city_name(loc):
    l = (loc or '').strip()
    if not l:
        return 'Unknown'
    first = l.split(',')[0].strip()
    return first if first else l

_city_name_counts = Counter(_city_name(r.get('location', '')) for r in dedup)
n_cities = len(_city_name_counts)

_level_counts = Counter('Manager' if r.get('level') == 'manager' else 'Director' for r in dedup)
_src_labels = {'linkedin': 'LinkedIn', 'jobbank': 'Job Bank', 'ats': 'ATS', 'workday': 'Workday', 'adzuna': 'Adzuna', 'other': 'Other'}
_source_counts = Counter(_src_labels[src_class(r.get('source', '') or '')] for r in dedup)

def _kv(counter, limit=None):
    return "".join(
        f'<div class="kv"><span class="k">{esc(k)}</span><span class="v">{c}</span></div>'
        for k, c in counter.most_common(limit))

stats_section = f'''
  <details class="aggstats">
    <summary>Aggregate stats &mdash; {len(dedup)} roles &middot; {n_companies} companies &middot; {n_positions} positions &middot; {n_cities} cities</summary>
    <div class="agg-cards">
      <div class="agg"><b>{len(dedup)}</b> roles</div>
      <div class="agg"><b>{n_companies}</b> unique companies</div>
      <div class="agg"><b>{n_positions}</b> unique positions</div>
      <div class="agg"><b>{n_cities}</b> unique cities</div>
      <div class="agg"><b>{len(_source_counts)}</b> sources</div>
    </div>
    <div class="agg-cols">
      <div class="agg-col">
        <h3>By level</h3>
        {_kv(_level_counts)}
      </div>
      <div class="agg-col">
        <h3>By city</h3>
        {_kv(_city_name_counts, 15)}
      </div>
      <div class="agg-col">
        <h3>By source</h3>
        {_kv(_source_counts)}
      </div>
      <div class="agg-col">
        <h3>Top companies</h3>
        {_kv(_company_counts, 15)}
      </div>
      <div class="agg-col">
        <h3>Top positions</h3>
        {_kv(_position_counts, 15)}
      </div>
    </div>
  </details>'''

# --- score-range filter (min/max) ---
FILTER_CSS = """.filter-bar { background:var(--card); border:1px solid var(--line); border-radius:12px;
              padding:14px 18px; margin:0 0 20px; display:flex; flex-wrap:wrap;
              align-items:center; gap:10px 14px; }
.filter-bar .flabel { font-weight:700; font-size:13.5px; color:var(--ink); }
.filter-bar label { font-size:13px; color:var(--muted); display:flex; align-items:center; gap:6px; white-space:nowrap; }
.filter-bar select { padding:5px 8px; border:1px solid var(--line); border-radius:8px;
                     font-size:13px; color:var(--ink); background:#fff; cursor:pointer; }
.filter-presets { display:flex; gap:6px; flex-wrap:wrap; }
.filter-presets button { padding:5px 12px; border:1px solid var(--line); background:#eef1f5;
                         border-radius:999px; font-size:12.5px; color:#3a4350; cursor:pointer; }
.filter-presets button:hover { background:#dbe3ec; }
.filter-presets button.on { background:#0a66c2; color:#fff; border-color:#0a66c2; }
.fdivider { width:1px; align-self:stretch; background:var(--line); margin:0 2px; }
.fclear { padding:5px 12px; border:1px solid var(--line); background:#fff; border-radius:8px;
          font-size:12.5px; color:#9a3b3b; cursor:pointer; }
.fclear:hover { background:#fbe9e9; }
.filter-count { font-size:13px; color:var(--muted); margin-left:auto; font-weight:500; white-space:nowrap; }
.filter-count b { color:var(--brand); }"""

FILTER_HTML = """<div class="filter-bar" aria-label="Filters">
  <span class="flabel">Score</span>
  <label>Min <select id="fmin">
    <option value="0" selected>0.0</option>
    <option value="5.0">5.0</option>
    <option value="5.5">5.5</option>
    <option value="6.0">6.0</option>
    <option value="6.5">6.5</option>
    <option value="7.0">7.0</option>
    <option value="7.5">7.5</option>
    <option value="8.0">8.0</option>
    <option value="8.5">8.5</option>
    <option value="9.0">9.0</option>
  </select></label>
  <label>Max <select id="fmax">
    <option value="10" selected>10.0</option>
    <option value="9.0">9.0</option>
    <option value="8.5">8.5</option>
    <option value="8.0">8.0</option>
    <option value="7.5">7.5</option>
    <option value="7.0">7.0</option>
    <option value="6.5">6.5</option>
    <option value="6.0">6.0</option>
    <option value="5.5">5.5</option>
    <option value="5.0">5.0</option>
  </select></label>
  <span class="filter-presets" id="fpresets">
    <button type="button" data-min="0" data-max="10">All</button>
    <button type="button" data-min="5.0" data-max="10">5.0+</button>
    <button type="button" data-min="6.5" data-max="10">6.5+</button>
    <button type="button" data-min="8.0" data-max="10">8.0+</button>
  </span>
  <span class="fdivider"></span>
  <label>Fit <select id="fverdict">
    <option value="" selected>Any</option>
    <option value="Strong">Strong</option>
    <option value="Good">Good</option>
    <option value="Moderate">Moderate</option>
    <option value="Weak">Weak</option>
  </select></label>
  <label>Rec <select id="frec">
    <option value="" selected>Any</option>
    <option value="Apply">Apply</option>
    <option value="Review">Review</option>
    <option value="Skip">Skip</option>
  </select></label>
  <label>Source <select id="fsource">
    <option value="" selected>Any</option>
    <option value="linkedin">LinkedIn</option>
    <option value="jobbank">Job Bank</option>
    <option value="ats">ATS</option>
    <option value="workday">Workday</option>
    <option value="adzuna">Adzuna</option>
    <option value="other">Other</option>
  </select></label>
  <label>Remote <select id="fremote">
    <option value="" selected>Any</option>
    <option value="1">Remote</option>
    <option value="0">Not remote</option>
  </select></label>
  <button type="button" id="fclear" class="fclear">Clear</button>
  <span class="filter-count" id="fcount"></span>
</div>"""

FILTER_JS = """<script>
(function(){
  var minSel = document.getElementById('fmin');
  var maxSel = document.getElementById('fmax');
  var counter = document.getElementById('fcount');
  function apply(){
    var min = parseFloat(minSel.value || '0');
    var max = parseFloat(maxSel.value || '10');
    if (min > max) { var t=min; min=max; max=t; minSel.value=min; maxSel.value=max; }
    var fV = document.getElementById('fverdict').value;
    var fR = document.getElementById('frec').value;
    var fS = document.getElementById('fsource').value;
    var fRem = document.getElementById('fremote').value;
    var active = (min>0 || max<10 || fV || fR || fS || fRem);
    var visible=0, total=0;
    document.querySelectorAll('li.job').forEach(function(li){
      total++;
      var s = parseFloat(li.getAttribute('data-score') || '0');
      var show = (s>=min && s<=max);
      if (show && fV && li.getAttribute('data-verdict') !== fV) show=false;
      if (show && fR && li.getAttribute('data-recommendation') !== fR) show=false;
      if (show && fS && li.getAttribute('data-source') !== fS) show=false;
      if (show && fRem==='1' && li.getAttribute('data-remote') !== '1') show=false;
      if (show && fRem==='0' && li.getAttribute('data-remote') === '1') show=false;
      li.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    document.querySelectorAll('details.collapsible').forEach(function(d){ d.open = active; });
    document.querySelectorAll('section.section').forEach(function(sec){
      var any=false;
      sec.querySelectorAll('li.job').forEach(function(li){ if (li.style.display!=='none') any=true; });
      sec.style.display = any ? '' : 'none';
    });
    document.querySelectorAll('#fpresets button').forEach(function(b){
      b.classList.toggle('on', (b.getAttribute('data-min')==minSel.value && b.getAttribute('data-max')==maxSel.value));
    });
    if (counter) counter.innerHTML = '<b>'+visible+'</b> of '+total+' roles';
  }
  [minSel, maxSel, document.getElementById('fverdict'), document.getElementById('frec'),
   document.getElementById('fsource'), document.getElementById('fremote')].forEach(function(el){
    el.addEventListener('change', apply);
  });
  document.querySelectorAll('#fpresets button').forEach(function(b){
    b.addEventListener('click', function(){
      minSel.value=b.getAttribute('data-min'); maxSel.value=b.getAttribute('data-max'); apply();
    });
  });
  document.getElementById('fclear').addEventListener('click', function(){
    minSel.value='0'; maxSel.value='10';
    document.getElementById('fverdict').value='';
    document.getElementById('frec').value='';
    document.getElementById('fsource').value='';
    document.getElementById('fremote').value='';
    apply();
  });
  apply();
})();
</script>"""

STATS_CSS = """.aggstats { background:var(--card); border:1px solid var(--line); border-radius:12px;
            padding:14px 18px; margin:0 0 20px; }
.aggstats summary { cursor:pointer; font-weight:700; font-size:14px; color:var(--ink);
                    user-select:none; list-style:none; }
.aggstats summary::-webkit-details-marker { display:none; }
.aggstats summary::before { content:"\\25B8\\00a0\\00a0"; color:var(--brand); font-weight:700; }
.aggstats[open] summary::before { content:"\\25BE\\00a0\\00a0"; }
.agg-cards { display:flex; flex-wrap:wrap; gap:10px; margin:14px 0 6px; }
.agg { background:#f2f6fc; border:1px solid var(--line); border-radius:10px;
       padding:10px 14px; font-size:13px; color:var(--muted); }
.agg b { display:block; font-size:20px; color:var(--brand); }
.agg-cols { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
            gap:16px; margin-top:12px; }
.agg-col h3 { margin:0 0 8px; font-size:13px; color:#7a5c12; }
.kv { display:flex; justify-content:space-between; gap:8px; padding:2px 0;
      border-bottom:1px dashed var(--line); font-size:12.5px; }
.kv .k { color:var(--ink); }
.kv .v { color:var(--muted); font-variant-numeric:tabular-nums; }"""

html_doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Job Search Results — Radek Zajkowski (scored)</title>
<style>
  :root {{
    --bg:#f6f7f9; --card:#ffffff; --ink:#1a1d23; --muted:#5b6472;
    --line:#e6e8ec; --brand:#0a66c2;
  }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
         background:var(--bg); color:var(--ink); line-height:1.5; }}
  .wrap {{ max-width:920px; margin:0 auto; padding:24px 20px 60px; }}
  header {{ background:linear-gradient(135deg,#0a66c2,#0b5aa8); color:#fff; border-radius:14px;
            padding:26px 28px 22px; margin-bottom:22px; }}
  header h1 {{ margin:0 0 6px; font-size:23px; letter-spacing:-.02em; }}
  header .sub {{ opacity:.92; font-size:13.5px; }}
  .stats {{ display:flex; flex-wrap:wrap; gap:10px; margin:16px 0 4px; }}
  .stat {{ background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.25);
           border-radius:10px; padding:8px 14px; font-size:13px; }}
  .stat b {{ display:block; font-size:20px; }}
  .section {{ background:var(--card); border:1px solid var(--line); border-top:4px solid var(--accent);
              border-radius:12px; padding:20px 22px; margin:20px 0; }}
  .section h2 {{ margin:0 0 14px; font-size:17px; display:flex; align-items:center; gap:10px; }}
  .count {{ background:var(--accent); color:#fff; border-radius:999px; font-size:12px;
            padding:2px 10px; font-weight:600; }}
  ol.jobs {{ list-style:none; margin:0; padding:0; }}
  .job {{ padding:13px 0; border-bottom:1px solid var(--line); }}
  .job:last-child {{ border-bottom:0; }}
  .job-head {{ display:flex; gap:10px; align-items:baseline; }}
  .job-num {{ color:var(--muted); font-size:12px; min-width:22px; font-variant-numeric:tabular-nums; }}
  a.job-title {{ color:var(--brand); font-weight:600; text-decoration:none; }}
  a.job-title:hover {{ text-decoration:underline; }}
  .job-meta {{ color:var(--muted); font-size:13px; margin:3px 0 7px 32px; }}
  .job-badges {{ display:flex; flex-wrap:wrap; gap:6px; margin:0 0 6px 32px; align-items:center; }}
  .job-why {{ color:var(--muted); font-size:12.5px; margin-left:32px; }}
  .badge {{ font-size:11px; padding:2px 8px; border-radius:6px; background:#eef1f5; color:#3a4350;
            border:1px solid var(--line); white-space:nowrap; }}
  .badge.remote {{ background:#e6f4ea; color:#0b6e4f; border-color:#bfe3cd; }}
  .badge.hybrid {{ background:#e8f1fb; color:#0a66c2; border-color:#c4dcf5; }}
  .badge.salary {{ background:#fdf3e3; color:#9a5b06; border-color:#f3ddb3; }}
  .badge.date {{ background:#f1f0fb; color:#5b4bbf; border-color:#ddd8f5; }}
  .badge.linkedin {{ background:#e8f1fb; color:#0a66c2; border-color:#c4dcf5; }}
  .badge.jobbank {{ background:#eef6f0; color:#1a7a3a; border-color:#c8e6d1; }}
  .badge.ats {{ background:#f3e8fd; color:#7a3ab0; border-color:#e2d0f5; }}
  .badge.workday {{ background:#e6f0fb; color:#1f4e8c; border-color:#c3d9f2; }}
  .badge.adzuna {{ background:#fdeef4; color:#b02a5e; border-color:#f5c8da; }}
  .score {{ display:inline-block; font-weight:700; font-size:15px; border-radius:7px; padding:2px 8px;
           color:#fff; margin-right:2px; }}
  .score i {{ font-style:normal; font-weight:500; font-size:10px; opacity:.85; }}
  .score.high {{ background:#0b6e4f; }} .score.good {{ background:#0a66c2; }}
  .score.mid  {{ background:#b45309; }} .score.low  {{ background:#9a3b3b; }}
  .scoretag {{ font-weight:600; }}
  .scoretag.high {{}} .scoretag.good {{}} .scoretag.mid {{}} .scoretag.low {{}}
  .dd-note {{ color:var(--muted); font-size:13px; margin:0 0 14px; }}
  .dd-line {{ color:var(--muted); font-size:12.5px; margin:2px 0 2px 32px; }}
  .dd-line.warn {{ color:#9a3b3b; }}
  .llm-summary {{ color:var(--ink); font-size:13px; margin:4px 0 4px 32px; }}
  .llm-why {{ color:var(--ink); font-size:12.5px; margin:2px 0 4px 32px; background:#f2f6fc;
             border-left:3px solid #0a66c2; padding:6px 10px; border-radius:0 8px 8px 0; }}
  .llm-why b {{ color:#0a66c2; }}
  .badge.rec-apply {{ background:#e6f4ea; color:#0b6e4f; border-color:#bfe3cd; font-weight:600; }}
  .badge.rec-review {{ background:#fdf3e3; color:#9a5b06; border-color:#f3ddb3; font-weight:600; }}
  .badge.rec-skip {{ background:#fbe9e9; color:#9a3b3b; border-color:#f0c5c5; font-weight:600; }}
  .section.llm {{ border-top-color:#0a66c2; }}
  .section.deep {{ border-top-color:#0a66c2; }}
  details.collapsible {{ margin:12px 0 0 0; border:1px dashed var(--line); border-radius:10px;
                          padding:10px 14px; background:#fafbfc; }}
  details.collapsible > summary {{ cursor:pointer; font-weight:600; font-size:13.5px; color:var(--muted);
                                   user-select:none; list-style:none; }}
  details.collapsible > summary::-webkit-details-marker {{ display:none; }}
  details.collapsible > summary::before {{ content:"\\25B8\\00a0\\00a0"; color:var(--brand); font-weight:700; }}
  details.collapsible[open] > summary::before {{ content:"\\25BE\\00a0\\00a0"; }}
  details.collapsible > ol.jobs {{ margin-top:8px; }}
  .shown-note {{ color:var(--muted); font-size:12px; font-weight:400; }}
  .toc {{ background:var(--card); border:1px solid var(--line); border-radius:12px;
         padding:16px 20px; margin:0 0 20px; }}
  .toc h2 {{ margin:0 0 10px; font-size:15px; color:var(--ink); }}
  .toc ol {{ list-style:none; margin:0; padding:0; }}
  .toc li {{ margin:7px 0; }}
  .toc a {{ color:var(--brand); text-decoration:none; font-weight:500; }}
  .toc a:hover {{ text-decoration:underline; }}
  .section {{ scroll-margin-top:16px; }}
  .notes {{ background:#fffaf0; border:1px solid #f0e2bd; border-radius:12px; padding:18px 22px;
            font-size:13px; color:#5c4a1e; margin-top:8px; }}
  .notes h2 {{ margin:0 0 10px; font-size:15px; color:#7a5c12; }}
  .notes ul {{ margin:0; padding-left:18px; }} .notes li {{ margin:4px 0; }}
  @media (max-width:560px) {{ .job-meta,.job-badges,.job-why {{ margin-left:0; }} }}
  {FILTER_CSS}
  {STATS_CSS}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Job Search Results — LLM-Evaluated + Skill-Match Scoring</h1>
    <div class="sub">Radek Zajkowski &mdash; Toronto, ON, Canada &middot; Generated {today}</div>
    <div class="stats">
      <div class="stat"><b>{len(dedup)}</b> scored roles</div>
      <div class="stat"><b>{len(llm_rows)}</b> LLM-evaluated</div>
      <div class="stat"><b>{len(llm_excluded)}</b> VP/C-level excluded</div>
      <div class="stat"><b>{len(it)}</b> IT / Tech / Enterprise Apps</div>
      <div class="stat"><b>{n_companies}</b> unique companies</div>
      <div class="stat"><b>{n_positions}</b> unique positions</div>
      <div class="stat"><b>{n_cities}</b> unique cities</div>
    </div>
    <div class="sub" style="margin-top:8px;">LLM evaluation is the <b>primary</b> ranking (top). Deterministic keyword scoring is a secondary pre-filter.</div>
    <div class="sub" style="margin-top:6px;">VP/C-level roles are excluded. A non-GTA role that requires in-office days is flagged and capped below 8.0 (max 7.9).</div>
  </header>

  {stats_section}

  {FILTER_HTML}

  {toc}

  {html_llm()}

  {html_deep(deep_rows) if deep_rows else ""}

  {html_section("Manager — IT / Technology / Enterprise Applications", it_mgr, "#0b6e4f", "mgr-it")}
  {html_section("Manager — Software / Engineering (review fit)", sw_mgr, "#b45309", "mgr-sw")}
  {html_section("Director — IT / Technology / Enterprise Applications", it_dir, "#0a66c2", "dir-it")}
  {html_section("Director — Software / Engineering (review fit)", sw_dir, "#b45309", "dir-sw")}

  <div class="notes" style="background:#fffaf0;border:1px solid #f0e2bd;">
    <h2>How evaluation works</h2>
    <ul>
      <li><b>LLM evaluation (primary):</b> an LLM reads each fetched job description against the
          candidate's full resume profile and scores semantic fit 0&ndash;10, with a
          recommendation (Apply / Review / Skip), strengths, and concerns. This is the ranking to trust.</li>
      <li><b>Deterministic pre-filter (secondary):</b> title-based keyword scoring
          (Seniority + Domain fit + Location + Differentiators, minus a dev-lean penalty)
          is used to decide <i>which</i> ~25 roles get fetched and LLM-evaluated, and remains
          as a reference below.</li>
      <li>Excluded per instruction: "Software Development Manager", "Development Manager", hands-on
          dev-team leadership, and Vice President / C-level roles. US-only "remote" postings were dropped.</li>
      <li>Non-GTA roles that require in-office days are flagged and capped below 8.0 (max 7.9) —
          you cannot travel 50+ km to an office.</li>
    </ul>
  </div>
</div>
{FILTER_JS}
</body>
</html>'''

html_path = f"/opt/data/resumes/job-search-{today}.html"
with open(html_path, "w") as f:
    f.write(html_doc)

print(f"Wrote HTML: {html_path}")
print(f"Scored roles: {len(dedup)}  (IT dir={len(it_dir)}, IT mgr={len(it_mgr)}, SW dir={len(sw_dir)}, SW mgr={len(sw_mgr)})")
print(f"Score range: {min(r['score'] for r in dedup)} - {max(r['score'] for r in dedup)}")
