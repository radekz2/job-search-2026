#!/usr/bin/env python3
"""
Targeted-employer ATS scraper: Greenhouse / Lever / Ashby clean JSON APIs.
Outputs results_ats.json in the standard record schema (incl. description for deep-dive).
"""
import json, re, html, urllib.request, time, sys
from datetime import datetime, timezone

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8", "replace"))

def clean(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

# (friendly company name, ats, slug)
BOARDS = [
    ("PointClickCare", "lever", "pointclickcare"),
    ("1Password", "ashby", "1password"),
    ("Loopio", "ashby", "loopio"),
    ("Wattpad", "lever", "wattpad"),
    ("Wave", "lever", "waveapps"),
    ("Cohere", "ashby", "cohere"),
    ("Lightspeed Commerce", "ashby", "lightspeed"),
    ("BenchSci", "lever", "benchsci"),
    ("Koho", "ashby", "koho"),
    ("Float", "ashby", "float"),
    ("Tulip Retail", "greenhouse", "tulip"),
    ("Achievers", "lever", "achievers"),
    ("Ritual", "greenhouse", "ritual"),
    ("Geotab", "greenhouse", "geotab"),
    ("PagerDuty", "greenhouse", "pagerduty"),
    ("Mozilla", "greenhouse", "mozilla"),
    # --- 2026-08-30 discovery additions ---
    ("Wealthsimple", "ashby", "wealthsimple"),
    ("Jobber", "ashby", "jobber"),
    ("Nylas", "ashby", "nylas"),
    ("Top Hat", "ashby", "top-hat"),
    ("Hootsuite", "greenhouse", "hootsuite"),
    ("Faire", "greenhouse", "faire"),
]

def greenhouse(slug):
    d = fetch_json(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true")
    out = []
    for j in d.get("jobs", []):
        loc = j.get("location", {}).get("name", "") if isinstance(j.get("location"), dict) else (j.get("location") or "")
        out.append({
            "title": clean(j.get("title")),
            "company": j.get("company_name") or "",
            "location": clean(loc),
            "link": j.get("absolute_url", ""),
            "source": "Greenhouse",
            "remote": bool(re.search(r"\bremote\b", str(loc), re.I)),
            "salary": "", "date": clean(j.get("updated_at", ""))[:10], "telework": "",
            "description": clean(j.get("content", "")),
        })
    return out

def lever(slug):
    d = fetch_json(f"https://api.lever.co/v0/postings/{slug}?mode=json")
    out = []
    for j in d:
        cats = j.get("categories", {}) or {}
        loc = (cats.get("location") or "Remote")
        wtype = j.get("workplaceType") or (cats.get("commitment") or "")
        created = j.get("createdAt")
        if isinstance(created, (int, float)):
            date_s = datetime.fromtimestamp(created / 1000, tz=timezone.utc).strftime("%Y-%m-%d")
        else:
            date_s = clean(str(created or ""))[:10]
        remote = bool(re.search(r"\bremote\b", str(loc), re.I)) or str(wtype).lower() == "remote"
        out.append({
            "title": clean(j.get("text")),
            "company": "",
            "location": clean(loc),
            "link": j.get("hostedUrl", ""),
            "source": "Lever",
            "remote": remote,
            "salary": clean(j.get("salaryDescription", "")),
            "date": date_s,
            "telework": clean(wtype),
            "description": clean(j.get("descriptionPlain", "")),
        })
    return out

def ashby(slug):
    d = fetch_json(f"https://api.ashbyhq.com/posting-api/job-board/{slug}")
    out = []
    for j in d.get("jobs", []):
        loc = j.get("location") or ""
        wtype = j.get("workplaceType") or j.get("employmentType") or ""
        remote = bool(j.get("isRemote")) or bool(re.search(r"\bremote\b", str(loc), re.I)) or str(wtype).lower() == "remote"
        out.append({
            "title": clean(j.get("title")),
            "company": "",
            "location": clean(loc),
            "link": j.get("jobUrl", ""),
            "source": "Ashby",
            "remote": remote,
            "salary": "", "date": clean(j.get("publishedAt", ""))[:10],
            "telework": clean(wtype),
            "description": clean(j.get("descriptionPlain", "")),
        })
    return out

def main():
    results = []
    for name, ats, slug in BOARDS:
        try:
            jobs = {"greenhouse": greenhouse, "lever": lever, "ashby": ashby}[ats](slug)
        except Exception as e:
            print(f"[{name}] ERROR: {e}", file=sys.stderr)
            continue
        for j in jobs:
            if not j["company"]:
                j["company"] = name
        results += jobs
        print(f"[{name:22}] {ats:10} -> {len(jobs)} jobs")
        time.sleep(0.3)

    with open("/opt/data/resumes/results_ats.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nTotal ATS results: {len(results)}")

if __name__ == "__main__":
    main()
