#!/usr/bin/env python3
"""
Deep-dive: fetch full job descriptions for the LLM-triage shortlist and run the
deterministic requirement analysis.

Inputs:
  - /opt/data/resumes/candidates.json       (full recall-filtered candidate list)
  - /opt/data/resumes/triage_indices.json   (LLM title-triage output: top-N
      indices + triage_score + rationale).  If missing/empty, falls back to the
      regex-score top N (deterministic only).

Output:
  - /opt/data/resumes/deep_results.json     (fetched descriptions + analysis,
      the input to the LLM evaluation pass)

Description sources:
  - LinkedIn:  https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{id}
  - Job Bank:  https://www.jobbank.gc.ca/jobsearch/jobposting/{id}
  - ATS (Greenhouse/Lever/Ashby) + Adzuna: description already in the record
  - Workday:   JSON-LD block on the job page
"""
import json, re, html, os, time, urllib.request, urllib.parse
from datetime import date

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
CACHE = "/opt/data/cache/jobdesc"
os.makedirs(CACHE, exist_ok=True)

FALLBACK_N = 25   # deterministic fallback if no triage shortlist exists
TRIAGE_N = 40     # default fetch count when a triage shortlist is present

def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()

def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

# ---------------- load candidates + triage shortlist ----------------
try:
    candidates = json.load(open('/opt/data/resumes/candidates.json'))
except (FileNotFoundError, ValueError):
    candidates = []

try:
    triage = json.load(open('/opt/data/resumes/triage_indices.json'))
    if not isinstance(triage, list):
        triage = []
except (FileNotFoundError, ValueError):
    triage = []

# build index -> candidate map (candidates.json order == compact.txt index order)
by_index = {i: r for i, r in enumerate(candidates)}

selected = []  # records to fetch, in triage order (best first)
if triage:
    for t in triage:
        idx = t.get('index')
        rec = by_index.get(idx)
        if not rec:
            continue
        rec = dict(rec)
        rec['triage_score'] = t.get('triage_score')
        rec['triage_rationale'] = t.get('triage_rationale', '')
        selected.append(rec)
    selected = selected[:TRIAGE_N]
    print(f"Using LLM triage shortlist: {len(selected)} roles to fetch.")
else:
    selected = [dict(r) for r in candidates[:FALLBACK_N]]
    print(f"No triage_indices.json — falling back to regex-score top {len(selected)}.")

# ---------------- description fetching ----------------
def linkedin_desc(job_id):
    cache_f = os.path.join(CACHE, f"li_{job_id}.txt")
    if os.path.exists(cache_f):
        return open(cache_f).read()
    url = f"https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"
    try:
        h = fetch(url)
    except Exception:
        return ""
    m = re.search(r'<div class="show-more-less-html__markup[^"]*"[^>]*>(.*?)</div>', h, re.DOTALL)
    if not m:
        m = re.search(r'<div class="description__text[^"]*"[^>]*>(.*?)</div>', h, re.DOTALL)
    if not m:
        return ""
    txt = strip_tags(m.group(1))
    open(cache_f, "w").write(txt)
    return txt

def jobbank_desc(job_id):
    cache_f = os.path.join(CACHE, f"jb_{job_id}.txt")
    if os.path.exists(cache_f):
        return open(cache_f).read()
    url = f"https://www.jobbank.gc.ca/jobsearch/jobposting/{job_id}"
    try:
        h = fetch(url)
    except Exception:
        return ""
    m = re.search(r'<div[^>]*id="job-details"[^>]*>(.*?)</div>', h, re.DOTALL)
    if not m:
        m = re.search(r'<main[^>]*>(.*?)</main>', h, re.DOTALL)
    if not m:
        m = re.search(r'<div[^>]*class="[^"]*job[^"]*"[^>]*>(.*?)</div>', h, re.DOTALL)
    if not m:
        return ""
    txt = strip_tags(m.group(1))
    for cutoff in ["Similar job postings", "Job market information", "Who can apply for this job"]:
        i = txt.find(cutoff)
        if i > 0:
            txt = txt[:i]
    txt = txt.strip()
    open(cache_f, "w").write(txt)
    return txt

def workday_desc(link):
    cache_f = os.path.join(CACHE, "wd_" + re.sub(r'[^A-Za-z0-9]', '_', link)[-60:] + ".txt")
    if os.path.exists(cache_f):
        return open(cache_f).read()
    try:
        h = fetch(link)
    except Exception:
        return ""
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', h, re.DOTALL)
    if not m:
        return ""
    try:
        d = json.loads(m.group(1))
    except Exception:
        return ""
    desc = d.get("description", "")
    if desc:
        open(cache_f, "w").write(desc)
    return desc

def get_desc(r):
    src = r.get('source', '')
    if src in ('Greenhouse', 'Lever', 'Ashby'):
        return r.get('description', '')
    if src == 'Adzuna':
        return r.get('description', '')
    if src == 'Workday':
        return workday_desc(r['link'])
    link = r['link']
    if src == 'LinkedIn':
        m = re.search(r'-(\d{7,12})$', link)
        if not m: return ""
        return linkedin_desc(m.group(1))
    else:
        m = re.search(r'jobposting/(\d+)$', link)
        if not m: return ""
        return jobbank_desc(m.group(1))

# ---------------- deep requirement analysis (unchanged rubric) ----------------
RESUME = {
    'enterprise-apps': re.compile(r'\b(enterprise|business (systems|applications)|information systems|it systems|application portfolio|application (lifecycle|management)|software portfolio|systems and services|corporate systems)\b', re.I),
    'saas-cloud': re.compile(r'\b(saas|software as a service|cloud|aws|azure|migration|modernization|technical debt)\b', re.I),
    'ai-automation': re.compile(r'\b(ai|artificial intelligence|agentic|llm|large language model|generative|machine learning|automation|copilot|intelligent automation|responsible ai)\b', re.I),
    'collab-tools': re.compile(r'\b(atlassian|jira|confluence|microsoft 365|m365|copilot|collaboration|productivity (suite|tools))\b', re.I),
    'vendor-governance': re.compile(r'\b(vendor|procurement|rfp|contract|licensing|governance|budget|cost)\b', re.I),
    'service-mgmt': re.compile(r'\b(itil|service management|service delivery|sla|change management|incident|problem management|itsm)\b', re.I),
    'leadership': re.compile(r'\b(lead|manage|mentor|coach|direct reports|team)\b', re.I),
    'agile': re.compile(r'\b(agile|scrum|sprint|kanban|safe)\b', re.I),
    'data-analytics': re.compile(r'\b(data|analytics|power bi|fabric|reporting|business intelligence|dashboard)\b', re.I),
    'strategy-roadmap': re.compile(r'\b(strategy|roadmap|vision|transformation|modernization|digital)\b', re.I),
    'security-compliance': re.compile(r'\b(security|cyber|cybersecurity|vulnerability|compliance|privacy|grc)\b', re.I),
    'erp-crm': re.compile(r'\b(erp|sap|oracle|workday|d365|dynamics|crm|salesforce|plm|hcm|netsuite)\b', re.I),
    'helpdesk': re.compile(r'\b(help desk|service desk|tier 1|tier 2|deskside|support tickets)\b', re.I),
    'hands-on-dev': re.compile(r'\b(hands[- ]on (coding|development)|write code|programming|full[- ]?stack|frontend|backend|code reviews?|ci/cd pipelines?\b)'
                               r'|(java|python|c\+\+|c#|javascript|typescript|react|angular|node\.js|golang|kotlin|swift|\.net)\b', re.I),
    'dev-management': re.compile(r'\b(software (development|engineering) (team|manager)|development team|engineering team|developers|software developers)\b', re.I),
    'below-seniority': re.compile(r'\b(entry[- ]level|junior|technician|help desk technician|deskside)\b', re.I),
}

NEGATIVE = {'hands-on-dev', 'dev-management', 'below-seniority', 'helpdesk'}
NEUTRAL = {'security-compliance', 'erp-crm'}
POSITIVE = set(RESUME) - NEGATIVE - NEUTRAL

def is_french(desc):
    accented = sum(1 for c in desc if c in 'éèêëàâçùûîïôœ')
    fr_words = ['équipe', 'numérique', 'entreprise', 'technologie', 'gestionnaire', 'responsable',
                'directeur', 'directrice', 'nous ', 'vous ', 'votre ', 'avec ', 'dans ', 'pour ',
                'poste', 'emploi', 'au sein', 'ainsi', 'défi', 'levier', 'croissance', 'recherchons',
                'rejoindre', 'chef', 'main-d', 'œuvre', 'd’affaires']
    hits = sum(1 for w in fr_words if w in desc.lower())
    return accented >= 3 or hits >= 3

def analyze_desc(r, desc):
    dl = desc.lower()
    detected = {k: True for k, pat in RESUME.items() if pat.search(dl)}
    matched = [k for k in detected if k in POSITIVE]
    negatives = [k for k in detected if k in NEGATIVE]
    neutrals = [k for k in detected if k in NEUTRAL]

    base = r.get('score') or r.get('triage_score') or 5.0
    coverage = len(matched) / len(POSITIVE)
    raw = coverage * 10.0
    deep = 0.45 * base + 0.55 * raw

    if 'hands-on-dev' in negatives: deep -= 1.5
    if 'dev-management' in negatives and 'hands-on-dev' in negatives: deep -= 0.5
    if 'helpdesk' in negatives: deep -= 1.5
    if 'below-seniority' in negatives: deep -= 2.0
    if 'security-compliance' in neutrals and len(matched) <= 4: deep -= 0.5

    deep = round(max(0.0, min(10.0, deep)), 1)
    verdict = 'Strong' if deep >= 8 else 'Good' if deep >= 6.5 else 'Moderate' if deep >= 5 else 'Weak'

    LABELS = {
        'enterprise-apps': 'Enterprise/business applications', 'saas-cloud': 'SaaS/cloud & modernization',
        'ai-automation': 'AI & automation', 'collab-tools': 'Collaboration tools (Atlassian/M365)',
        'vendor-governance': 'Vendor/governance/budget', 'service-mgmt': 'Service management (ITIL/SLA)',
        'leadership': 'People leadership', 'agile': 'Agile/Scrum', 'data-analytics': 'Data & analytics',
        'strategy-roadmap': 'Strategy & transformation',
    }
    NEUTRAL_LABELS = {'security-compliance': 'Security/compliance', 'erp-crm': 'ERP/CRM platforms'}
    matched_labels = [LABELS[k] for k in matched if k in LABELS]
    neutral_labels = [NEUTRAL_LABELS[k] for k in neutrals if k in NEUTRAL_LABELS]
    neg_labels = []
    if 'hands-on-dev' in negatives: neg_labels.append('hands-on coding expected')
    if 'dev-management' in negatives: neg_labels.append('manages development/engineering team')
    if 'helpdesk' in negatives: neg_labels.append('help-desk/deskside scope')
    if 'below-seniority' in negatives: neg_labels.append('below-director seniority signals')

    french = is_french(desc)
    return {
        'deep': deep, 'verdict': verdict, 'base': round(float(base), 1),
        'matched': matched_labels, 'neutrals': neutral_labels, 'negatives': neg_labels,
        'desc_len': len(desc), 'french': french,
    }

# ---------------- run deep dive ----------------
results = []
for i, r in enumerate(selected, 1):
    desc = get_desc(r)
    if not desc:
        results.append(dict(r=r, desc="", analysis=None, fetched=False))
        print(f"[{i}/{len(selected)}] SKIP (no desc): {r['title']} @ {r['company']}")
        continue
    a = analyze_desc(r, desc)
    results.append(dict(r=r, desc=desc, analysis=a, fetched=True))
    print(f"[{i}/{len(selected)}] {r['title']} @ {r['company']}  base={a['base']} deep={a['deep']} ({a['verdict']})  matched={len(a['matched'])} neg={a['negatives']}")
    time.sleep(0.4)

results.sort(key=lambda x: -(x['analysis']['deep'] if x['analysis'] else -1))

with open("/opt/data/resumes/deep_results.json", "w") as f:
    json.dump([{ 'title': x['r']['title'], 'company': x['r']['company'],
                 'link': x['r']['link'], 'location': x['r']['location'],
                 'remote': x['r']['remote'], 'source': x['r']['source'],
                 'triage_score': x['r'].get('triage_score'),
                 'triage_rationale': x['r'].get('triage_rationale', ''),
                 'base': x['analysis']['base'] if x['analysis'] else None,
                 'deep': x['analysis']['deep'] if x['analysis'] else None,
                 'verdict': x['analysis']['verdict'] if x['analysis'] else None,
                 'matched': x['analysis']['matched'] if x['analysis'] else [],
                 'neutrals': x['analysis']['neutrals'] if x['analysis'] else [],
                 'negatives': x['analysis']['negatives'] if x['analysis'] else [],
                 'french': x['analysis']['french'] if x['analysis'] else False,
                 'fetched': x['fetched'],
                 'description': x.get('desc', '') if x['fetched'] else '',
               } for x in results], f, indent=2)

print(f"\nDeep-dive complete: {len([x for x in results if x['fetched']])} descriptions fetched, "
      f"{len([x for x in results if not x['fetched']])} skipped.")
print("Saved deep results to /opt/data/resumes/deep_results.json")
