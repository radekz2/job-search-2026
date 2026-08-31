#!/usr/bin/env python3
"""
Adzuna job API scraper (personal-research licensed free tier).
Reads credentials from /opt/data/adzuna_credentials.json.
Outputs /opt/data/resumes/results_adzuna.json in the standard record schema:
  {title, company, location, link, source, remote, salary, date, telework, description}
Free tier = 1,000 calls/month -> keep QUERIES tight; 2 pages max each (results_per_page=50).
"""
import json, re, html, urllib.request, urllib.parse, time, sys, os

CRED_PATH = "/opt/data/adzuna_credentials.json"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
COUNTRY = "ca"
RESULTS_PER_PAGE = 50
MAX_PAGES = 2  # safety cap: 2 pages * 50 = 100 results per query
SORT_BY = "date"     # newest first
MAX_DAYS_OLD = 30    # only postings from the last 30 days

# (what, where) — full-text keyword + location. Title filtering happens downstream
# in build_scored.py, matching the rest of the pipeline.
QUERIES = [
    ("technology director", "toronto"),
    ("technology manager", "toronto"),
    ("IT director", "toronto"),
    ("IT manager", "toronto"),
    ("director enterprise applications", "toronto"),
    ("enterprise software manager", "toronto"),
    ("director information technology", "toronto"),
    ("manager enterprise applications", "toronto"),
    ("technology director", "canada"),
    ("IT manager", "canada"),
]


def load_creds():
    with open(CRED_PATH) as f:
        return json.load(f)


def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8", "replace"))


def clean(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def fmt_salary(smin, smax):
    if smin and smax:
        return f"${smin:,} - ${smax:,}"
    if smin:
        return f"${smin:,}+"
    return ""


def is_remote(loc_display, area, title):
    text = f"{loc_display} {title}".lower()
    if "remote" in text:
        return True
    # Canada-wide posting with no city/sub-area is typically remote/Canada-wide
    if area and len([a for a in area if a]) == 1:
        return True
    return False


def search(creds, what, where, page):
    params = {
        "app_id": creds["app_id"],
        "app_key": creds["app_key"],
        "what": what,
        "where": where,
        "results_per_page": RESULTS_PER_PAGE,
        "sort_by": SORT_BY,
        "max_days_old": MAX_DAYS_OLD,
        "content-type": "application/json",
    }
    qs = urllib.parse.urlencode(params)
    url = f"https://api.adzuna.com/v1/api/jobs/{COUNTRY}/search/{page}?{qs}"
    return fetch_json(url)


def main():
    creds = load_creds()
    results = []
    seen = set()
    calls = 0
    for what, where in QUERIES:
        count = None
        for page in range(1, MAX_PAGES + 1):
            try:
                d = search(creds, what, where, page)
                calls += 1
            except Exception as e:
                print(f"[{what}/{where}] page {page} ERROR: {e}", file=sys.stderr)
                break
            if count is None:
                count = d.get("count", 0)
            for r in d.get("results", []):
                jid = r.get("id")
                if jid in seen:
                    continue
                seen.add(jid)
                loc = r.get("location", {}) or {}
                comp = r.get("company", {}) or {}
                area = loc.get("area") or []
                title = clean(r.get("title"))
                loc_display = clean(loc.get("display_name"))
                results.append({
                    "title": title,
                    "company": clean(comp.get("display_name")),
                    "location": loc_display,
                    "link": r.get("redirect_url", ""),
                    "source": "Adzuna",
                    "remote": is_remote(loc_display, area, title),
                    "salary": fmt_salary(r.get("salary_min"), r.get("salary_max")),
                    "date": clean(r.get("created", ""))[:10],
                    "telework": clean(r.get("contract_time", "")),
                    "description": clean(r.get("description", "")),
                })
            if len(d.get("results", [])) < RESULTS_PER_PAGE:
                break
            time.sleep(1.1)  # respect ~1 req/sec rate limit
        print(f"[{what:32} / {where:8}] count={count or 0}  fetched={len(seen)}")
        time.sleep(1.1)

    out = "/opt/data/resumes/results_adzuna.json"
    with open(out, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nAdzuna API calls this run: {calls}")
    print(f"Adzuna unique results: {len(results)} -> {out}")


if __name__ == "__main__":
    main()
