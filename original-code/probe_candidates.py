#!/usr/bin/env python3
"""One-off: probe corrected ATS slugs surfaced by web search."""
import json, urllib.request, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace")

def gh(slug):
    try:
        d = json.loads(get(f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs"))
        return f"greenhouse/{slug} -> {len(d.get('jobs', []))} jobs"
    except Exception as e:
        return f"greenhouse/{slug} -> FAIL ({type(e).__name__})"

def lever(slug):
    try:
        d = json.loads(get(f"https://api.lever.co/v0/postings/{slug}?mode=json"))
        return f"lever/{slug} -> {len(d) if isinstance(d, list) else 'not-list'} jobs"
    except Exception as e:
        return f"lever/{slug} -> FAIL ({type(e).__name__})"

def ashby(slug):
    try:
        d = json.loads(get(f"https://api.ashbyhq.com/posting-api/job-board/{slug}"))
        return f"ashby/{slug} -> {len(d.get('jobs', []))} jobs"
    except Exception as e:
        return f"ashby/{slug} -> FAIL ({type(e).__name__})"

checks = [
    ("Top Hat", lambda: ashby("top-hat")),
    ("Top Hat", lambda: ashby("tophat")),
    ("Coveo", lambda: gh("coveodeven")),
    ("Coveo", lambda: gh("coveo")),
    ("Clio", lambda: gh("clio")),
    ("Clio", lambda: gh("goclio")),
    ("Clio", lambda: lever("clio")),
    ("Clio", lambda: ashby("clio")),
    ("Wealthsimple", lambda: gh("wealthsimple")),
    ("Wealthsimple", lambda: ashby("wealthsimple")),
    ("Shopify", lambda: ashby("shopify")),
    ("Shopify", lambda: gh("shopify")),
    ("FreshBooks", lambda: gh("freshbooks")),
    ("FreshBooks", lambda: ashby("freshbooks")),
    ("Vena", lambda: gh("venasolutions")),
    ("Vena", lambda: gh("vena")),
]

for name, fn in checks:
    print(f"{name:14} {fn()}")
