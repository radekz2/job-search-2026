#!/usr/bin/env python3
"""
Workday ATS scraper. Uses the public POST jobs endpoint:
  POST https://<tenant>.wd<N>.myworkdayjobs.com/wday/cxs/<tenant>/<site>/jobs
  body: {"limit":20,"offset":0,"searchText":"","appliedFacets":{}}
Returns jobPostings: [{title, externalPath, locationsText, postedOn, remoteType, bulletFields}]
"""
import json, re, urllib.request, time, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

# (friendly name, host, tenant, site)
BOARDS = [
    ("TD Bank", "td.wd3.myworkdayjobs.com", "td", "TD_Bank_Careers"),
    ("BMO", "bmo.wd3.myworkdayjobs.com", "bmo", "External"),
    ("CIBC", "cibc.wd3.myworkdayjobs.com", "cibc", "search"),
    ("Manulife", "manulife.wd3.myworkdayjobs.com", "manulife", "MFCJH_Jobs"),
    ("Sun Life", "sunlife.wd3.myworkdayjobs.com", "sunlife", "Experienced-Jobs"),
    ("OMERS", "omers.wd3.myworkdayjobs.com", "omers", "OMERS_External"),
    ("CPP Investments", "cppib.wd10.myworkdayjobs.com", "cppib", "cppinvestments"),
    ("OTPP (Ontario Teachers)", "otppb.wd3.myworkdayjobs.com", "otppb", "OntarioTeachers_Careers"),
    ("Clio", "clio.wd3.myworkdayjobs.com", "clio", "ClioCareerSite"),
]

def workday_fetch(host, tenant, site, offset, limit=20):
    url = f"https://{host}/wday/cxs/{tenant}/{site}/jobs"
    body = json.dumps({
        "limit": limit, "offset": offset,
        "searchText": "",
        "appliedFacets": {},
    }).encode()
    req = urllib.request.Request(url, data=body, headers={
        "User-Agent": UA,
        "Accept": "application/json",
        "Content-Type": "application/json",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8", "replace"))

def clean(s):
    return re.sub(r"\s+", " ", s or "").strip()

def scrape_board(name, host, tenant, site):
    out = []
    offset = 0
    total = None
    limit = 20
    max_pages = 200  # safety cap (20 * 200 = 4000 jobs)
    for _ in range(max_pages):
        try:
            d = workday_fetch(host, tenant, site, offset, limit)
        except Exception as e:
            print(f"    [{name}] offset={offset} ERROR: {e}", file=sys.stderr)
            break
        postings = d.get("jobPostings", [])
        if total is None:
            total = d.get("total", 0)
        for j in postings:
            loc = clean(j.get("locationsText", ""))
            remote = clean(j.get("remoteType", ""))
            is_remote = remote.lower() in ("remote", "work from home", "hybrid-remote")
            out.append({
                "title": clean(j.get("title", "")),
                "company": name,
                "location": loc,
                "link": f"https://{host}/en-US/{site}" + j.get("externalPath", ""),
                "source": "Workday",
                "remote": is_remote,
                "salary": "",
                "date": clean(j.get("postedOn", "")),
                "telework": remote if remote.lower() != "on site" else "",
                "description": "",
            })
        offset += limit
        if offset >= total:
            break
        time.sleep(0.25)
    return out, total

def main():
    results = []
    for name, host, tenant, site in BOARDS:
        try:
            jobs, total = scrape_board(name, host, tenant, site)
        except Exception as e:
            print(f"[{name}] ERROR: {e}", file=sys.stderr)
            continue
        results += jobs
        print(f"[{name:22}] -> {len(jobs)} jobs (total={total})")
    with open("/opt/data/resumes/results_workday.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nTotal Workday results: {len(results)}")

if __name__ == "__main__":
    main()
