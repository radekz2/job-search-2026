#!/usr/bin/env python3
"""
Round 2 discovery: more tech firms (Greenhouse/Lever/Ashby) + Workday boards for banks/insurers.
Workday detection: find the live wdN instance + tenant, then the jobs JSON endpoint.
"""
import json, urllib.request, urllib.parse, re, time, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def get(url, accept="application/json"):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace"), r.status

def probe_gla(name, slugs):
    for slug in slugs:
        for ats, url in [
            ("greenhouse", f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs"),
            ("lever", f"https://api.lever.co/v0/postings/{slug}?mode=json"),
            ("ashby", f"https://api.ashbyhq.com/posting-api/job-board/{slug}"),
        ]:
            try:
                body, status = get(url)
                d = json.loads(body)
                if ats == "greenhouse" and "jobs" in d:
                    return (ats, slug, len(d["jobs"]))
                if ats == "lever" and isinstance(d, list):
                    return (ats, slug, len(d))
                if ats == "ashby" and isinstance(d, dict) and "jobs" in d:
                    return (ats, slug, len(d["jobs"]))
            except Exception:
                pass
    return None

def probe_workday(name, slugs):
    """Find live Workday instance + tenant, then jobs JSON."""
    for slug in slugs:
        for n in range(1, 6):
            host = f"{slug}.wd{n}.myworkdayjobs.com"
            # try to find tenant via the jobs JSON endpoint guesses
            for tenant in [slug, slug.capitalize(), slug.title(), "External"]:
                for path in [f"/wday/cxs/{slug}/{tenant}/jobs", f"/{tenant}/jobs"]:
                    url = f"https://{host}{path}"
                    try:
                        body, status = get(url)
                        d = json.loads(body)
                        if isinstance(d, dict) and ("jobPostings" in d or "requisitions" in d or "jobs" in d):
                            jobs = d.get("jobPostings") or d.get("requisitions") or d.get("jobs") or []
                            return ("workday", f"{slug}.wd{n}", tenant, len(jobs))
                    except Exception:
                        pass
            # fallback: detect live root
            try:
                body, status = get(f"https://{host}/", accept="text/html")
                if status == 200 and "myworkdayjobs" in body.lower():
                    # found live board; extract tenant from canonical
                    m = re.search(rf"https?://{re.escape(host)}/([A-Za-z0-9_-]+)", body)
                    tenant = m.group(1) if m else slug
                    return ("workday-live", f"{slug}.wd{n}", tenant, "?")
            except Exception:
                pass
    return None

TECH = [
    ("Ada", ["ada", "ada-support"]),
    ("BenchSci", ["benchsci"]),
    ("Ecobee", ["ecobee"]),
    ("Koho", ["koho"]),
    ("Borrowell", ["borrowell"]),
    ("Vena Solutions", ["vena", "venasolutions"]),
    ("Float", ["float"]),
    ("Tulip Retail", ["tulip", "tulipretail"]),
    ("ApplyBoard", ["applyboard"]),
    ("Symcor", ["symcor"]),
    ("Achievers", ["achievers"]),
    ("Kira Systems", ["kirasystems"]),
    ("Top Hat", ["tophat", "tophatmonocle"]),
    ("Wealthsimple", ["wealthsimple"]),
    ("FreshBooks", ["freshbooks", "freshbook"]),
    ("Ritual", ["ritual", "ritual-co"]),
    ("League", ["league", "league-inc"]),
    ("Dessa", ["dessa"]),
    ("Geotab", ["geotab"]),
    ("PagerDuty", ["pagerduty"]),
    ("Index Exchange", ["indexexchange"]),
    ("Mozilla", ["mozilla"]),
    ("Shopify", ["shopify"]),
]

WORKDAY = [
    ("RBC", ["rbc"]),
    ("TD Bank", ["td", "tdbank"]),
    ("Scotiabank", ["scotiabank", "scotia"]),
    ("BMO", ["bmo", "bmofinancialgroup"]),
    ("CIBC", ["cibc"]),
    ("Manulife", ["manulife"]),
    ("Sun Life", ["sunlife"]),
    ("Rogers", ["rogers", "rogerscommunications"]),
    ("Bell", ["bell", "bellcanada"]),
    ("TELUS", ["telus"]),
    ("CPP Investments", ["cppinvestments", "cpp"]),
    ("OMERS", ["omers"]),
    ("Ontario Teachers (OTPP)", ["otpp", "ontarioteachers"]),
    ("Thomson Reuters", ["thomsonreuters", "tr"]),
    ("OpenText", ["opentext"]),
    ("University of Toronto", ["uoft", "utoronto"]),
]

print("=== TECH (Greenhouse/Lever/Ashby) ===")
tech_ok = []
for name, slugs in TECH:
    try:
        hit = probe_gla(name, slugs)
    except Exception:
        hit = None
    if hit:
        a, s, c = hit
        tech_ok.append({"company": name, "ats": a, "slug": s, "jobs": c})
        print(f"✓ {name:24} -> {a:10} {s:18} jobs={c}")
    else:
        print(f"✗ {name:24} -> none")
    time.sleep(0.2)

print("\n=== WORKDAY (banks/insurers) ===")
wd_ok = []
for name, slugs in WORKDAY:
    try:
        hit = probe_workday(name, slugs)
    except Exception as e:
        hit = None
    if hit:
        ats, host, tenant, count = hit
        wd_ok.append({"company": name, "ats": ats, "slug": host, "tenant": tenant, "jobs": count})
        print(f"✓ {name:24} -> {ats} {host} tenant={tenant} jobs={count}")
    else:
        print(f"✗ {name:24} -> none")
    time.sleep(0.2)

with open("/opt/data/resumes/ats_confirmed2.json", "w") as f:
    json.dump({"tech": tech_ok, "workday": wd_ok}, f, indent=2)
print(f"\nTech confirmed: {len(tech_ok)}, Workday confirmed: {len(wd_ok)}")
