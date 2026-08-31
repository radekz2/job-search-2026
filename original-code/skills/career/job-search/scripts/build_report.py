#!/usr/bin/env python3
"""Curate scraped job results into a de-duplicated, bucketed report.

Reads resumes/results.json (LinkedIn Toronto + Job Bank) and
resumes/results_ca_remote.json (LinkedIn Canada remote), then writes
resumes/job-search-YYYY-MM-DD.txt.

Tune the MGMT / DEV_EXCLUDE / SW regexes to the candidate's target titles and
explicit exclusions before running.
"""
import json, re, html
from datetime import date

def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()

li = json.load(open('resumes/results.json'))['li']
jb = json.load(open('resumes/results.json'))['jb']
ca = json.load(open('resumes/results_ca_remote.json'))

records = []
for r in li:
    if r.get('remote'):
        continue  # drop US-located remote noise
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

# Leadership-role tokens (drop individual contributors)
MGMT = re.compile(
    r'\b(manager|director|head of|vp|vice[- ]president|chief|cto|cio|responsable'
    r'|directeur|directrice|gestionnaire)\b', re.I)

# Titles the candidate explicitly does NOT want (hands-on dev-team leadership)
DEV_EXCLUDE = re.compile(
    r'\b(software development manager|development manager|team lead|tech lead'
    r'|technical lead|software development director|director of software development'
    r'|manager, software development|application development director)\b', re.I)

# Borderline "Software Manager"-type roles (flag for review, not hard exclude)
SW = re.compile(
    r'(software engineering|engineering (manager|director)|director of (software|engineering)'
    r'|director, (software|engineering)|director - software engineering'
    r'|head of (software|engineering)|vp of (software|engineering)|vice president.*(software|engineering)'
    r'|software manager|software director|engineering lead|platform engineering'
    r'|developer platform|developer excellence|agentic platform)', re.I)

kept = []
for r in records:
    t = r['title'].strip()
    if not t or not MGMT.search(t) or DEV_EXCLUDE.search(t):
        continue
    r['bucket'] = 'sw' if SW.search(t) else 'it'
    kept.append(r)

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
    if any(x in l for x in ['ontario','mississauga','vaughan','markham','north york',
        'etobicoke','scarborough','greater toronto','richmond hill','oakville',
        'woodbridge','courtice','milton','st. catharines','georgetown','hamilton',
        'waterloo','cambridge','kitchener','guelph','oshawa','lindsay']):
        return 1
    return 2

for r in dedup:
    r['level'] = level_of(r['title'])
    if 'linkedin.com/jobs/view/' in r['link']:
        r['link'] = re.sub(r'\?.*$', '', r['link'])

dedup.sort(key=lambda r: (0 if r['bucket']=='it' else 1,
                          0 if r['level']=='director' else 1,
                          loc_rank(r['location']), r['title'].lower()))

it = [r for r in dedup if r['bucket']=='it']
sw = [r for r in dedup if r['bucket']=='sw']

today = date.today().isoformat()
out = []
out.append("=" * 78); out.append("JOB SEARCH RESULTS"); out.append("=" * 78)
out.append(f"Generated : {today}")
out.append("Sources   : LinkedIn (public jobs search) + Government of Canada Job Bank")
out.append("")
out.append("SUMMARY")
out.append(f"  Total unique roles collected and reviewed : {len(records)}")
out.append(f"  Management roles after filtering          : {len(dedup)}")
out.append(f"    - IT / Technology / Enterprise Apps leadership : {len(it)}")
out.append(f"    - Software Engineering Manager/Director (review): {len(sw)}")
out.append("")

def emit(rows, heading):
    out.append("=" * 78); out.append(heading); out.append("=" * 78)
    for i, r in enumerate(rows, 1):
        out.append("")
        out.append(f"{i}. {r['title']}")
        meta = [r['company']]
        if r['location']: meta.append(r['location'])
        if r['remote']: meta.append("Remote")
        if r['telework'] and r['telework'].lower() not in ('on site',): meta.append(r['telework'])
        if r['salary']: meta.append(r['salary'])
        if r['date']: meta.append("Posted " + r['date'])
        out.append("   " + " | ".join(meta))
        out.append("   " + r['link'])

emit([r for r in it if r['level']=='director'],
     "SECTION 1 — DIRECTOR-LEVEL: IT / TECHNOLOGY / ENTERPRISE APPS (strong match)")
emit([r for r in it if r['level']=='manager'],
     "SECTION 2 — MANAGER-LEVEL: IT / TECHNOLOGY / ENTERPRISE APPLICATIONS (strong match)")
emit([r for r in sw if r['level']=='director'],
     "SECTION 3 — DIRECTOR-LEVEL: SOFTWARE / ENGINEERING (borderline — review fit)")
emit([r for r in sw if r['level']=='manager'],
     "SECTION 4 — MANAGER-LEVEL: SOFTWARE / ENGINEERING (borderline — review fit)")

out.append("")
out.append("=" * 78); out.append("NOTES"); out.append("=" * 78)
out.append("- Excluded: dev-team leadership (Software Development Manager, Development")
out.append("  Manager, Team Lead / Tech Lead) and individual-contributor roles.")
out.append("- US-located 'remote' postings dropped; only Canadian or Canada-remote listed.")
out.append("- Sections 3 & 4 may lean toward managing engineering teams — review each.")
out.append("")

text = "\n".join(out)
path = f"resumes/job-search-{today}.txt"
with open(path, "w") as f:
    f.write(text)
print(text)
