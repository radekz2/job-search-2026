#!/usr/bin/env python3
import json, re, html
from datetime import date

def strip_tags(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()

def esc(s):
    return html.escape(s or "")

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

MGMT = re.compile(
    r'\b(manager|director|head of|vp|vice[- ]president|chief|cto|cio|responsable|directeur|directrice|chef d[\u2019\']'
    r'\u00e9quipe|supervisor|lead/manager|gestionnaire)\b', re.I)
DEV_EXCLUDE = re.compile(
    r'\b(software development manager|development manager|team lead|tech lead|technical lead'
    r'|software development director|director of software development|manager, software development'
    r'|application development director|software development)\b', re.I)
SW = re.compile(
    r'(software engineering|engineering (manager|director)|director of (software|engineering)'
    r'|director, (software|engineering)|director - software engineering'
    r'|head of (software|engineering)|vp of (software|engineering)|vice president.*(software|engineering)'
    r'|software manager|software director|engineering lead|platform engineering|developer platform'
    r'|developer excellence|agentic platform)', re.I)

def is_management(t): return bool(MGMT.search(t))
def is_dev_excluded(t): return bool(DEV_EXCLUDE.search(t))
def bucket_of(t): return 'sw' if SW.search(t) else 'it'

kept = []
for r in records:
    t = r['title'].strip()
    if not t or not is_management(t) or is_dev_excluded(t):
        continue
    r['bucket'] = bucket_of(t)
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
it_dir = [r for r in it if r['level']=='director']
it_mgr = [r for r in it if r['level']=='manager']
sw_dir = [r for r in sw if r['level']=='director']
sw_mgr = [r for r in sw if r['level']=='manager']

today = date.today().isoformat()

# ---------------- HTML ----------------
def badge(label, cls):
    return f'<span class="badge {cls}">{esc(label)}</span>'

def job_item(r, i):
    badges = []
    if r['remote']:
        badges.append(badge('Remote', 'remote'))
    if r['telework'] and r['telework'].lower() not in ('on site',):
        badges.append(badge(r['telework'], 'hybrid'))
    if r['salary']:
        badges.append(badge(r['salary'], 'salary'))
    if r['date']:
        badges.append(badge('Posted ' + r['date'], 'date'))
    src = 'linkedin' if r['source'] == 'LinkedIn' else 'jobbank'
    badges.append(badge(r['source'], src))
    loc = esc(r['location']) if r['location'] else ''
    meta_parts = [esc(r['company'])]
    if loc:
        meta_parts.append(loc)
    return f'''
      <li class="job">
        <div class="job-head">
          <span class="job-num">{i}</span>
          <a class="job-title" href="{esc(r['link'])}" target="_blank" rel="noopener">{esc(r['title'])}</a>
        </div>
        <div class="job-meta">{" &middot; ".join(meta_parts)}</div>
        <div class="job-badges">{"".join(badges)}</div>
      </li>'''

def section(title, rows, accent):
    items = "".join(job_item(r, i) for i, r in enumerate(rows, 1))
    return f'''
    <section class="section" style="--accent:{accent};">
      <h2>{esc(title)} <span class="count">{len(rows)}</span></h2>
      <ol class="jobs">{items}</ol>
    </section>'''

html_doc = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Job Search Results — Radek Zajkowski</title>
<style>
  :root {{
    --bg:#f6f7f9; --card:#ffffff; --ink:#1a1d23; --muted:#5b6472;
    --line:#e6e8ec; --brand:#0a66c2; --strong:#0b6e4f; --warn:#b45309;
  }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
         background:var(--bg); color:var(--ink); line-height:1.5; }}
  .wrap {{ max-width:880px; margin:0 auto; padding:24px 20px 60px; }}
  header {{ background:linear-gradient(135deg,#0a66c2,#0b5aa8); color:#fff; border-radius:14px;
            padding:28px 28px 24px; margin-bottom:22px; }}
  header h1 {{ margin:0 0 6px; font-size:24px; letter-spacing:-.02em; }}
  header .sub {{ opacity:.92; font-size:14px; }}
  .stats {{ display:flex; flex-wrap:wrap; gap:10px; margin:18px 0 4px; }}
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
  .job-num {{ color:var(--muted); font-size:12px; font-variant-numeric:tabular-nums; min-width:22px; }}
  a.job-title {{ color:var(--brand); font-weight:600; text-decoration:none; }}
  a.job-title:hover {{ text-decoration:underline; }}
  .job-meta {{ color:var(--muted); font-size:13px; margin:3px 0 7px 32px; }}
  .job-badges {{ display:flex; flex-wrap:wrap; gap:6px; margin-left:32px; }}
  .badge {{ font-size:11px; padding:2px 8px; border-radius:6px; background:#eef1f5; color:#3a4350;
            border:1px solid var(--line); white-space:nowrap; }}
  .badge.remote {{ background:#e6f4ea; color:#0b6e4f; border-color:#bfe3cd; }}
  .badge.hybrid {{ background:#e8f1fb; color:#0a66c2; border-color:#c4dcf5; }}
  .badge.salary {{ background:#fdf3e3; color:#9a5b06; border-color:#f3ddb3; }}
  .badge.date {{ background:#f1f0fb; color:#5b4bbf; border-color:#ddd8f5; }}
  .badge.linkedin {{ background:#e8f1fb; color:#0a66c2; border-color:#c4dcf5; }}
  .badge.jobbank {{ background:#eef6f0; color:#1a7a3a; border-color:#c8e6d1; }}
  .notes {{ background:#fffaf0; border:1px solid #f0e2bd; border-radius:12px; padding:18px 22px;
            font-size:13.5px; color:#5c4a1e; margin-top:8px; }}
  .notes h2 {{ margin:0 0 10px; font-size:15px; color:#7a5c12; }}
  .notes ul {{ margin:0; padding-left:18px; }}
  .notes li {{ margin:4px 0; }}
  @media (max-width:560px) {{ .job-meta,.job-badges {{ margin-left:0; }} }}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Job Search Results</h1>
    <div class="sub">Radek Zajkowski &mdash; Toronto, ON, Canada &middot; Generated {today}</div>
    <div class="stats">
      <div class="stat"><b>{len(dedup)}</b> curated roles</div>
      <div class="stat"><b>{len(it)}</b> IT / Tech / Enterprise Apps</div>
      <div class="stat"><b>{len(sw)}</b> Software Engineering (review)</div>
    </div>
    <div class="sub">Target: Technology Manager / Director (Software Manager, IT Manager, Director of
    Technology, Enterprise Applications) &mdash; not hands-on dev-manager roles.</div>
    <div class="sub" style="margin-top:6px;">Sources: LinkedIn (public jobs) + Government of Canada Job Bank &middot;
    Scope: Toronto / GTA (on-site &amp; hybrid) + Canada remote.</div>
  </header>

  {section("Director — IT / Technology / Enterprise Applications", it_dir, "#0a66c2")}
  {section("Manager — IT / Technology / Enterprise Applications", it_mgr, "#0b6e4f")}
  {section("Director — Software / Engineering (review fit)", sw_dir, "#b45309")}
  {section("Manager — Software / Engineering (review fit)", sw_mgr, "#b45309")}

  <div class="notes">
    <h2>Notes</h2>
    <ul>
      <li>Excluded per instruction: "Software Development Manager", "Development Manager", and
          hands-on dev-team leadership (Team Lead / Tech Lead).</li>
      <li>Excluded: individual-contributor roles (Engineer, Specialist, Analyst, etc.).</li>
      <li>US-located "remote" postings were dropped (typically US-only hiring); only Canadian-located
          or Canada-remote roles are listed.</li>
      <li>The Software / Engineering sections still lean toward managing engineering teams &mdash; review
          each posting for fit.</li>
      <li>GTA roles in Mississauga/Vaughan/Markham/etc. are commutable from Toronto. Remote/hybrid
          status is shown where known.</li>
      <li>Job Bank postings include posted-date and salary where the employer listed them.</li>
    </ul>
  </div>
</div>
</body>
</html>'''

out_path = f"/opt/data/resumes/job-search-{today}.html"
with open(out_path, "w") as f:
    f.write(html_doc)
print(f"Wrote {out_path}")
print(f"Sections: IT dir={len(it_dir)}, IT mgr={len(it_mgr)}, SW dir={len(sw_dir)}, SW mgr={len(sw_mgr)}")
print(f"Total curated: {len(dedup)}")
