#!/usr/bin/env python3
"""
Discover which ATS each target employer uses (Greenhouse / Lever / Ashby)
by probing their clean public JSON endpoints. Outputs a confirmed mapping.
"""
import json, urllib.request, urllib.parse, time, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace"), r.status

def probe(name, slugs):
    """Try Greenhouse, Lever, Ashby for each slug. Return (ats, slug, job_count) or None."""
    for slug in slugs:
        # Greenhouse
        try:
            body, status = get(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs")
            d = json.loads(body)
            jobs = d.get("jobs", [])
            if jobs is not None:
                return ("greenhouse", slug, len(jobs))
        except Exception:
            pass
        # Lever
        try:
            body, status = get(f"https://api.lever.co/v0/postings/{slug}?mode=json")
            d = json.loads(body)
            if isinstance(d, list):
                return ("lever", slug, len(d))
        except Exception:
            pass
        # Ashby
        try:
            body, status = get(f"https://api.ashbyhq.com/posting-api/job-board/{slug}")
            d = json.loads(body)
            if isinstance(d, dict) and "jobs" in d:
                return ("ashby", slug, len(d["jobs"]))
        except Exception:
            pass
    return None

# (company, [slug guesses])
CANDIDATES = [
    ("Shopify", ["shopify"]),
    ("Wealthsimple", ["wealthsimple"]),
    ("Clio", ["clio", "theclio", "goclio"]),
    ("PointClickCare", ["pointclickcare"]),
    ("1Password", ["1password"]),
    ("Thomson Reuters", ["thomsonreuters", "tr"]),
    ("Top Hat", ["tophat"]),
    ("Loopio", ["loopio"]),
    ("Kira Systems / Litera", ["kirasystems", "litera"]),
    ("Ceridian / Dayforce", ["dayforce", "ceridian"]),
    ("Questrade", ["questrade"]),
    ("SkipTheDishes", ["skipthedishes"]),
    ("Wattpad", ["wattpad"]),
    ("TouchBistro", ["touchbistro"]),
    ("Wave", ["waveapps", "wave"]),
    ("FreshBooks", ["freshbooks"]),
    ("Cohere", ["cohere"]),
    ("Coveo", ["coveo"]),
    ("Lightspeed Commerce", ["lightspeed", "lightspeedhq"]),
    ("Cineplex", ["cineplex"]),
    ("Rogers", ["rogers", "rogerscommunications"]),
    ("Manulife", ["manulife"]),
    ("Sun Life", ["sunlife", "sunlife"]),
    ("CPP Investments", ["cppinvestments"]),
    ("OMERS", ["omers"]),
    ("OTPP / Ontario Teachers", ["otpp"]),
    ("Scotiabank", ["scotiabank"]),
    ("RBC", ["rbc", "royalbank"]),
    ("TD Bank", ["tdbank", "td"]),
    ("BMO", ["bmo"]),
    ("CIBC", ["cibc"]),
    ("University of Toronto", ["uoft", "universitytoronto", "utoronto"]),
    ("TMU", ["torontomu", "ryerson", "torontometropolitan"]),
    ("UHN", ["uhn", "universityhealthnetwork"]),
    ("Ontario Health", ["ontariohealth"]),
    ("Loblaw", ["loblaw"]),
    ("Canadian Tire", ["canadiantire", "ctc"]),
]

results = []
for name, slugs in CANDIDATES:
    try:
        hit = probe(name, slugs)
    except Exception as e:
        hit = None
    if hit:
        ats, slug, count = hit
        results.append((name, ats, slug, count))
        print(f"✓ {name:28} -> {ats:10} slug={slug:20} jobs={count}")
    else:
        print(f"✗ {name:28} -> (not Greenhouse/Lever/Ashby; likely Workday/Taleo/other)")
    time.sleep(0.25)

confirmed = [{"company": n, "ats": a, "slug": s, "jobs": c} for n, a, s, c in results]
with open("/opt/data/resumes/ats_confirmed.json", "w") as f:
    json.dump(confirmed, f, indent=2)
print(f"\nConfirmed {len(confirmed)}/{len(CANDIDATES)} boards. Saved to ats_confirmed.json")
