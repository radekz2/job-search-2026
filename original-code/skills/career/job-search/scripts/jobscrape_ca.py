#!/usr/bin/env python3
"""Scrape LinkedIn guest API for Canada-wide REMOTE job postings.

Stdlib-only. Writes ./resumes/results_ca_remote.json. Run this in addition to
jobscrape.py so US-only "remote" noise is replaced with Canadian remote roles.
"""
import urllib.request, urllib.parse, re, html, json, time, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

def clean(s):
    return re.sub(r"\s+", " ", html.unescape(s or "")).strip()

def linkedin_search(keyword, location="Canada", remote=True, start=0):
    params = {"keywords": keyword, "start": str(start)}
    if remote:
        params["f_WT"] = "2"
    if location:
        params["location"] = location
    url = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?" + urllib.parse.urlencode(params)
    h = fetch(url)
    cards = re.findall(r"<li>(.*?)</li>", h, re.DOTALL)
    out = []
    for c in cards:
        title = re.search(r'<span class="sr-only">\s*(.*?)\s*</span>', c, re.DOTALL)
        comp = re.search(r'base-search-card__subtitle[^>]*>\s*<a[^>]*>\s*(.*?)\s*</a>', c, re.DOTALL)
        loc = re.search(r'job-search-card__location[^>]*>(.*?)</span>', c, re.DOTALL)
        link = re.search(r'href="(https://[^"]*linkedin\.com/jobs/view/[^"]*)"', c)
        if not title:
            continue
        out.append({
            "title": clean(title.group(1)),
            "company": clean(comp.group(1)) if comp else "",
            "location": clean(loc.group(1)) if loc else "",
            "link": link.group(1).replace("&amp;", "&") if link else "",
            "remote": True,
        })
    return out

kw_ca_remote = [
    "software manager", "technology manager", "IT manager",
    "director of technology", "director of software", "applications manager",
]

results, seen = [], set()
for kw in kw_ca_remote:
    try:
        res = linkedin_search(kw)
    except Exception as e:
        print(f"[ERR] {kw}: {e}", file=sys.stderr)
        continue
    added = 0
    for r in res:
        key = (r["title"].lower(), r["company"].lower())
        if key in seen:
            continue
        seen.add(key)
        r["query"] = kw + " (Canada remote)"
        results.append(r)
        added += 1
    print(f"[LI-CA] {kw!r}: {len(res)} fetched, {added} new")
    time.sleep(0.5)

with open("resumes/results_ca_remote.json", "w") as f:
    json.dump(results, f, indent=2)
print(f"\nTOTAL Canada remote: {len(results)}")
