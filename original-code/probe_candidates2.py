#!/usr/bin/env python3
"""Verify the newly-discovered Canadian ATS endpoints return live jobs."""
import json, urllib.request, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def get(url, accept="application/json"):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", "replace")

def post_json(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={
        "User-Agent": UA, "Accept": "application/json", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8", "replace"))

def ashby(slug):
    try:
        d = json.loads(get(f"https://api.ashbyhq.com/posting-api/job-board/{slug}"))
        return f"ashby/{slug} -> {len(d.get('jobs', []))} jobs"
    except Exception as e:
        return f"ashby/{slug} -> FAIL ({type(e).__name__})"

def gh(slug):
    try:
        d = json.loads(get(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true"))
        return f"greenhouse/{slug} -> {len(d.get('jobs', []))} jobs"
    except Exception as e:
        return f"greenhouse/{slug} -> FAIL ({type(e).__name__})"

def workday(host, tenant, site):
    try:
        d = post_json(f"https://{host}/wday/cxs/{tenant}/{site}/jobs", {"limit":20,"offset":0,"searchText":"","appliedFacets":{}})
        return f"workday/{host} -> {d.get('total', 0)} total"
    except Exception as e:
        return f"workday/{host} -> FAIL ({type(e).__name__})"

def smartrecruiters(company):
    try:
        d = json.loads(get(f"https://api.smartrecruiters.com/v1/companies/{company}/postings"))
        return f"smartrecruiters/{company} -> {d.get('totalFound', 0)} total"
    except Exception as e:
        return f"smartrecruiters/{company} -> FAIL ({type(e).__name__})"

checks = [
    ("Wealthsimple", lambda: ashby("wealthsimple")),
    ("Jobber", lambda: ashby("jobber")),
    ("Nylas", lambda: ashby("nylas")),
    ("Hootsuite", lambda: gh("hootsuite")),
    ("Faire", lambda: gh("faire")),
    ("Clio", lambda: workday("clio.wd3.myworkdayjobs.com", "clio", "ClioCareerSite")),
    ("Coveo", lambda: smartrecruiters("Coveo")),
]

for name, fn in checks:
    print(f"{name:14} {fn()}")
