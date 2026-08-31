#!/usr/bin/env python3
import json, re, html
from datetime import date

def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()

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

# Management tokens: role must be a leadership role, not IC
MGMT = re.compile(
    r'\b(manager|director|head of|vp|vice[- ]president|chief|cto|cio|responsable|directeur|directrice|chef d[\u2019\']'
    r'\u00e9quipe|supervisor|lead/manager|gestionnaire)\b', re.I)

# Dev-manager titles the user explicitly does NOT want
DEV_EXCLUDE = re.compile(
    r'\b(software development manager|development manager|team lead|tech lead|technical lead'
    r'|software development director|director of software development|manager, software development'
    r'|application development director|software development)\b', re.I)

# Borderline (software-engineering management) — "Software Manager"-type, flag for review
SW = re.compile(
    r'(software engineering|engineering (manager|director)|director of (software|engineering)'
    r'|director, (software|engineering)|director - software engineering'
    r'|head of (software|engineering)|vp of (software|engineering)|vice president.*(software|engineering)'
    r'|software manager|software director|engineering lead|platform engineering|developer platform'
    r'|developer excellence|agentic platform)', re.I)

def is_management(t):
    return bool(MGMT.search(t))

def is_dev_excluded(t):
    return bool(DEV_EXCLUDE.search(t))

def bucket_of(t):
    if SW.search(t):
        return 'sw'
    return 'it'

kept = []
for r in records:
    t = r['title'].strip()
    if not t:
        continue
    if not is_management(t):
        continue           # drop IC roles
    if is_dev_excluded(t):
        continue           # drop dev-manager roles
    r['bucket'] = bucket_of(t)
    kept.append(r)

# Dedupe by title+company
seen = set(); dedup = []
for r in kept:
    key = (r['title'].lower(), r['company'].lower())
    if key in seen:
        continue
    seen.add(key); dedup.append(r)

def level_of(t):
    if re.search(r'\b(director|vp|vice president|head of|chief|cto|cio)\b', t, re.I):
        return 'director'
    return 'manager'

def loc_rank(loc):
    l = loc.lower()
    if 'toronto' in l: return 0
    if any(x in l for x in ['ontario','mississauga','vaughan','markham','north york','etobicoke',
        'scarborough','greater toronto','richmond hill','oakville','woodbridge','courtice','milton',
        'st. catharines','georgetown','hamilton','waterloo','cambridge','kitchener','guelph','oshawa','lindsay']):
        return 1
    return 2

for r in dedup:
    r['level'] = level_of(r['title'])

dedup.sort(key=lambda r: (0 if r['bucket']=='it' else 1,
                          0 if r['level']=='director' else 1,
                          loc_rank(r['location']), r['title'].lower()))

def clean_link(u):
    if 'linkedin.com/jobs/view/' in u:
        u = re.sub(r'\?.*$', '', u)
    return u

for r in dedup:
    r['link'] = clean_link(r['link'])

it = [r for r in dedup if r['bucket']=='it']
sw = [r for r in dedup if r['bucket']=='sw']

today = date.today().isoformat()
out = []
out.append("=" * 78)
out.append("JOB SEARCH RESULTS")
out.append("=" * 78)
out.append(f"Generated : {today}")
out.append("Candidate : Radek Zajkowski — Toronto, ON, Canada")
out.append("Target    : Technology Manager / Director roles")
out.append("            (Software Manager, IT Manager, Director of Technology,")
out.append("             Enterprise Applications — NOT hands-on dev-manager)")
out.append("Sources   : LinkedIn (public jobs search) + Government of Canada Job Bank")
out.append("Scope     : Toronto / Greater Toronto Area (on-site & hybrid) + Canada remote")
out.append("")
out.append("SUMMARY")
out.append(f"  Total unique roles collected and reviewed : {len(records)}")
out.append(f"  Management roles after filtering          : {len(dedup)}")
out.append(f"    - IT / Technology / Enterprise Apps leadership : {len(it)}")
out.append(f"    - Software Engineering Manager/Director (review): {len(sw)}")
out.append("")

def emit(rows, heading):
    out.append("=" * 78)
    out.append(heading)
    out.append("=" * 78)
    for i, r in enumerate(rows, 1):
        out.append("")
        out.append(f"{i}. {r['title']}")
        meta = [r['company']]
        if r['location']:
            meta.append(r['location'])
        if r['remote']:
            meta.append("Remote")
        if r['telework'] and r['telework'].lower() not in ('on site',):
            meta.append(r['telework'])
        if r['salary']:
            meta.append(r['salary'])
        if r['date']:
            meta.append("Posted " + r['date'])
        out.append("   " + " | ".join(meta))
        out.append("   " + r['link'])

it_dir = [r for r in it if r['level']=='director']
it_mgr = [r for r in it if r['level']=='manager']
sw_dir = [r for r in sw if r['level']=='director']
sw_mgr = [r for r in sw if r['level']=='manager']

emit(it_dir, "SECTION 1 — DIRECTOR-LEVEL: IT / TECHNOLOGY / ENTERPRISE APPS (strong match)")
emit(it_mgr, "SECTION 2 — MANAGER-LEVEL: IT / TECHNOLOGY / ENTERPRISE APPLICATIONS (strong match)")
emit(sw_dir, "SECTION 3 — DIRECTOR-LEVEL: SOFTWARE / ENGINEERING (borderline — review fit)")
emit(sw_mgr, "SECTION 4 — MANAGER-LEVEL: SOFTWARE / ENGINEERING (borderline — review fit)")

out.append("")
out.append("=" * 78)
out.append("NOTES")
out.append("=" * 78)
out.append("- Excluded per your instruction: 'Software Development Manager', 'Development")
out.append("  Manager', and hands-on dev-team leadership (Team Lead / Tech Lead).")
out.append("- Excluded: individual-contributor roles (Engineer, Specialist, Analyst, etc.).")
out.append("- US-located 'remote' postings were dropped (typically US-only hiring); only")
out.append("  Canadian-located or Canada-remote roles are listed.")
out.append("- Sections 3 & 4 are 'Software Manager'-type roles; many still lean toward")
out.append("  managing software engineering teams, so review each posting for fit.")
out.append("- GTA roles in Mississauga/Vaughan/Markham/etc. are commutable from Toronto.")
out.append("  Remote/hybrid status is shown where known.")
out.append("- Job Bank postings include posted-date and salary where the employer listed it.")
out.append("")

text = "\n".join(out)
with open(f"/opt/data/resumes/job-search-{today}.txt", "w") as f:
    f.write(text)
print(text)
