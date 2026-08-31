#!/usr/bin/env python3
"""
Candidate builder — RECALL-ORIENTED first pass.

Loads every scraped source, drops only high-confidence junk (empty titles,
interns/students, obvious IC roles, explicit dev-manager phrases), and writes the
FULL deduped candidate list to /opt/data/resumes/candidates.json plus a compact
one-line-per-candidate /opt/data/resumes/candidates_compact.txt for the LLM
title-triage step.

This is deliberately BROADER than build_scored.py's deterministic filter: the
regex here is only a cheap funnel. The LLM title-triage (stage 2) does the fine
judgment — this stage must not silently drop a relevant title just because it
lacks the literal word "manager"/"director" (e.g. "Head, Responsible AI",
"Business Systems & Technology Lead", "Enterprise Application Support Lead").

Regex score is kept as a *hint* only; the LLM triage score is authoritative.
"""
import json, re, html, os

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()

# ---- leadership capture (RECALL: broad; "lead"/"head"/"owner"/"avp"/"principal" are
#      deliberately included even though some are IC — the triage re-judges them) ----
LEAD = re.compile(
    r'\b(manager|managing\s+director|director|head|head\s+of|vp|vice[- ]?president|svp|evp|avp'
    r'|chief|cto|cio|ciso|lead|owner|principal|supervisor|superintendent'
    r'|responsable|directeur|directrice|gestionnaire|chef)\b', re.I)

# ---- hard exclusions: high-confidence junk we can drop without the LLM ----
# below-seniority (intern/student/new-grad/trainee)
BELOW_SENIORITY = re.compile(
    r'\b(intern|internship|co-?op|coop|student|new\s+grad|graduate\s+program'
    r'|early\s+(career|talent)|trainee|apprentice|summer\s+(student|intern))\b', re.I)

# explicit hands-on dev-team leadership (the candidate's hardest exclusion)
DEV_EXCLUDE = re.compile(
    r'\b(software\s+development\s+manager|development\s+manager|team\s+lead|tech\s+lead'
    r'|technical\s+lead|software\s+development\s+director|director\s+of\s+software\s+development'
    r'|manager,\s+software\s+development|application\s+development\s+director'
    r'|engineering\s+team\s+lead|software\s+engineering\s+lead|software\s+team\s+lead'
    r'|software\s+development)\b', re.I)

# obvious individual-contributor / non-leadership roles (cheap junk removal only)
IC_JUNK = re.compile(
    r'\b(teller|banker|advisor|adviser|representative|specialist|agent|assistant'
    r'|clerk|technician|coordinator|attendant|cashier|teller|receptionist)\b', re.I)

def is_below_seniority(t): return bool(BELOW_SENIORITY.search(t))
def is_dev_excluded(t): return bool(DEV_EXCLUDE.search(t))
def is_ic_junk(t): return bool(IC_JUNK.search(t)) and not LEAD.search(t)

# ---- regex score (HINT only; mirrors build_scored.py domain scoring) ----
DIRECTOR = re.compile(r'\b(director|vp|vice president|head of|chief|cto|cio|directeur|directrice)\b', re.I)
NARROW_FN = re.compile(r'\b(sap|oracle|workday|d365|dynamics|salesforce|plm|cad|help desk|service desk|endpoint|license|licensing|asset|support|business analyst)\b', re.I)
IT_TECH = re.compile(r'\b(it|information technology|technology|tech|informatique|num\u00e9rique)\b', re.I)
ENTERPRISE = re.compile(r'\b(enterprise|business systems|business system|business applications|business application|application|applications)\b', re.I)
SAAS_CLOUD = re.compile(r'\b(saas|cloud|cloud platform|cloud enablement)\b', re.I)
AI = re.compile(r'\b(ai|a\.i\.|copilot|generative|automation|innovation|digital transformation|transformation|machine learning|ml)\b', re.I)
COLLAB = re.compile(r'\b(collaboration|productivity|atlassian|jira|confluence|microsoft|m365|365)\b', re.I)
VENDOR = re.compile(r'\b(vendor|procurement|rfp|governance|licensing|compliance|budget)\b', re.I)
SERVICE = re.compile(r'\b(service management|service delivery|itsm|it operations|it ops|techops|operations)\b', re.I)
DATA = re.compile(r'\b(data platform|data engineering|data governance|analytics|data)\b', re.I)
PLATFORM = re.compile(r'\b(platform|developer platform|developer experience|developer excellence)\b', re.I)
SECURITY = re.compile(r'\b(security|cyber|cybersecurity)\b', re.I)
ERP = re.compile(r'\b(erp|sap|oracle|workday|d365|dynamics|crm|salesforce|plm|hcm)\b', re.I)
HELPDESK = re.compile(r'\b(help desk|service desk|support)\b', re.I)
SW_DEV = re.compile(r'(software engineering|engineering manager|engineering director|manager software engineering|director of engineering|director, engineering|head of engineering|vp of engineering|software manager|software engineering manager)', re.I)

def loc_rank(loc):
    l = loc.lower()
    if 'toronto' in l: return 'toronto'
    if any(x in l for x in ['mississauga','vaughan','markham','north york','etobicoke','scarborough',
        'greater toronto','richmond hill','oakville','woodbridge','courtice','milton','st. catharines',
        'georgetown','hamilton','waterloo','cambridge','kitchener','guelph','oshawa','lindsay','concord',
        'brampton','ajax','pickering','newmarket','aurora','whitby']):
        return 'gta'
    if 'ontario' in l:
        return 'ontario'
    return 'canada'

def regex_score(r):
    t = r['title'].lower(); loc = (r['location'] or '').lower()
    seniority = 3.0 if DIRECTOR.search(t) else 2.5
    if NARROW_FN.search(t): seniority -= 0.5
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
    if dev_lean: dom = min(dom, 1.5)
    if r['remote']: location = 1.5
    else: location = {'toronto': 2.0, 'gta': 1.6, 'ontario': 1.3, 'canada': 1.0}[loc_rank(loc)]
    total = seniority + dom + location
    if dev_lean: total -= 1.0
    return round(max(0.0, min(10.0, total)), 1), dev_lean

# ---- load all sources ----
def load_all():
    records = []
    d = json.load(open('/opt/data/resumes/results.json'))
    for r in d['li']:
        if r.get('remote'): continue
        records.append(dict(title=r['title'], company=r['company'], location=r['location'],
            link=r['link'], source='LinkedIn', remote=False, salary='', date='', telework=''))
    for r in json.load(open('/opt/data/resumes/results_ca_remote.json')):
        records.append(dict(title=r['title'], company=r['company'], location=r['location'],
            link=r['link'], source='LinkedIn', remote=True, salary='', date='', telework=''))
    for r in d['jb']:
        records.append(dict(title=r['title'].title(), company=r['company'],
            location=strip_tags(r['location']).replace('Location', '').strip(),
            link=r['link'], source='Job Bank', remote=False,
            salary=strip_tags(r['salary']).replace('Salary', '').strip(),
            date=r['date'], telework=r['telework']))
    for fn, src in [('results_ats.json','ATS'),('results_workday.json','Workday'),('results_adzuna.json','Adzuna')]:
        try:
            arr = json.load(open(f'/opt/data/resumes/{fn}'))
        except (FileNotFoundError, ValueError):
            arr = []
        for r in arr:
            records.append(dict(title=r['title'], company=r['company'], location=r['location'],
                link=r['link'], source=r.get('source', src), remote=bool(r.get('remote')),
                salary=r.get('salary', ''), date=r.get('date', ''), telework=r.get('telework', ''),
                description=r.get('description', '')))
    return records

def main():
    records = load_all()
    kept = []
    for r in records:
        t = (r['title'] or '').strip()
        if not t:
            continue
        # strip LinkedIn tracking query params (otherwise deep_dive can't extract the job ID)
        if 'linkedin.com/jobs/view/' in r.get('link', ''):
            r['link'] = re.sub(r'\?.*$', '', r['link'])
        if is_below_seniority(t) or is_dev_excluded(t) or is_ic_junk(t):
            continue
        # MUST have a leadership signal (broad) OR a strong tech signal
        if not LEAD.search(t):
            # allow tech-only titles that are clearly senior (e.g. "Enterprise Architect")
            if not IT_TECH.search(t):
                continue
        sc, dev_lean = regex_score(r)
        r['score'] = sc
        r['dev_lean'] = dev_lean
        r['level'] = 'director' if DIRECTOR.search(t) else 'manager'
        kept.append(r)

    # dedupe by title+company
    seen = set(); dedup = []
    for r in kept:
        key = (r['title'].lower(), r['company'].lower())
        if key in seen: continue
        seen.add(key); dedup.append(r)

    dedup.sort(key=lambda r: (-r['score'], r['title'].lower()))

    os.makedirs('/opt/data/resumes', exist_ok=True)
    with open('/opt/data/resumes/candidates.json', 'w') as f:
        json.dump(dedup, f, indent=2)

    # compact text (one line per candidate) — full list, for reference
    lines = []
    for i, r in enumerate(dedup):
        loc = (r['location'] or '').strip()
        remote = 'REMOTE' if r.get('remote') else ''
        sal = r.get('salary', '') or ''
        extra = ' | '.join(x for x in [loc, remote, sal] if x)
        lines.append(f"{i}\t{r['title']}\t{r['company']}\t{r['source']}\t{extra}\t{r['link']}")
    with open('/opt/data/resumes/candidates_compact.txt', 'w') as f:
        f.write("\n".join(lines))

    # ---- bounded LLM triage input: leadership + tech-signal only ----
    # The deterministic regex score UNDER-weights "Head"/"Lead"/"AVP" titles
    # (they lack "manager/director"), so a pure top-N-by-score would miss
    # strong matches like "Head, Responsible AI & Governance" (rank ~500/1810).
    # Feed the LLM ALL leadership+tech candidates (no truncation), with the
    # LINK STRIPPED (the index resolves it downstream) so the file stays small
    # enough for one read. The full 1810-line candidates_compact.txt caused
    # HTTP 524; ~660 lines of title/company/location is ~45KB, which is safe.
    # The triage_hint only controls SORT ORDER (strongest first), not truncation —
    # the LLM, not a deterministic score, is what ranks "Lead" vs "Director".
    TECH_SIGNAL = re.compile(
        r'\b(it|information technology|technology|tech|software|engineering|platform'
        r'|infrastructure|data|analytics|ai|a\.i\.|artificial intelligence|machine learning'
        r'|cloud|devops|cyber|security|systems|digital|saas|automation|technical'
        r'|enterprise|erp|sap|workday|salesforce|oracle|applications?|integration|integrations'
        r'|architecture|architect|products?|solutions|delivery|portfolio|modernization'
        r'|transformation|enablement|digital)\b', re.I)

    def is_gta(loc):
        l = (loc or '').lower()
        if 'toronto' in l:
            return True
        return any(x in l for x in ['mississauga','vaughan','markham','north york','etobicoke',
            'scarborough','richmond hill','oakville','woodbridge','brampton','ajax','pickering',
            'newmarket','aurora','whitby','greater toronto'])

    def triage_hint(r):
        t = r['title'].lower()
        # seniority signal: director/head/vp/avp/chief rank above manager/lead
        if re.search(r'\b(director|head|vp|avp|chief|cto|cio|principal)\b', t):
            sen = 3
        elif re.search(r'\b(manager|lead|owner|supervisor)\b', t):
            sen = 2
        else:
            sen = 1
        # tech breadth: count distinct tech keywords hit
        hits = len(set(re.findall(TECH_SIGNAL, t)))
        # location: GTA/remote preferred
        loc_bonus = 1 if (r.get('remote') or is_gta(r['location'])) else 0
        # dev-lean penalty (surface but de-prioritize)
        dev_pen = -1 if r.get('dev_lean') else 0
        return sen * 2 + min(hits, 4) + loc_bonus + dev_pen

    triage_pool = [r for r in dedup if LEAD.search(r['title']) and TECH_SIGNAL.search(r['title'])]
    triage_pool.sort(key=lambda r: (-triage_hint(r), r['title'].lower()))

    # keep the ORIGINAL dedup index on each line so deep_dive can resolve it;
    # NO link on the line (index -> candidates.json resolves it) to keep size down
    idx_map = {id(r): i for i, r in enumerate(dedup)}
    tlines = []
    for r in triage_pool:
        i = idx_map[id(r)]
        loc = (r['location'] or '').strip()
        remote = 'REMOTE' if r.get('remote') else ''
        sal = r.get('salary', '') or ''
        extra = ' | '.join(x for x in [loc, remote, sal] if x)
        tlines.append(f"{i}\t{r['title']}\t{r['company']}\t{r['source']}\t{extra}")
    with open('/opt/data/resumes/triage_input.txt', 'w') as f:
        f.write("\n".join(tlines))

    print(f"records scraped: {len(records)}")
    print(f"candidates after recall filter + dedup: {len(dedup)}")
    print(f"  by level: director={sum(1 for r in dedup if r['level']=='director')}, "
          f"manager={sum(1 for r in dedup if r['level']=='manager')}")
    print(f"  dev-lean flagged: {sum(1 for r in dedup if r['dev_lean'])}")
    print(f"wrote candidates.json + candidates_compact.txt ({len(lines)} lines)")
    print(f"wrote triage_input.txt (leadership+tech, no links): {len(tlines)} lines")

if __name__ == '__main__':
    main()
