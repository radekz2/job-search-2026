#!/usr/bin/env python3
"""
Additional job sources: Built In Toronto (HTML) + RemoteOK (JSON API).
Outputs results_extra.json in the same record schema as the other scrapers:
  {title, company, location, link, source, remote, salary, date, telework}
"""
import json, re, html, urllib.request, urllib.parse, time, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

def clean(s):
    s = re.sub(r"<[^>]+>", " ", s or "")  # strip any nested tags
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

# ---------------- Built In Toronto ----------------
def builtin_search(location="toronto", pages=2):
    out = []
    seen = set()
    for p in range(1, pages + 1):
        url = f"https://builtin.com/jobs/{location}?page={p}" if p > 1 else f"https://builtin.com/jobs/{location}"
        try:
            h = fetch(url)
        except Exception as e:
            print(f"[BUILTIN] page {p} error: {e}", file=sys.stderr)
            break
        ids = list(dict.fromkeys(re.findall(r'data-builtin-track-job-id="(\d+)"', h)))
        added = 0
        for jid in ids:
            if jid in seen:
                continue
            tmatch = re.search(r'href="(/job/[^"]+)"[^>]*data-builtin-track-job-id="' + jid + r'"[^>]*>(.*?)</a>', h, re.DOTALL)
            if not tmatch:
                continue
            title = clean(tmatch.group(2))
            window = h[tmatch.end():tmatch.end() + 1500]
            comp = re.search(r'data-id="company-title"[^>]*>(.*?)</a>', window, re.DOTALL)
            company = clean(comp.group(1)) if comp else ""
            loc_m = re.search(r'([A-Za-z][A-Za-z .\'-]+),\s*(ON|QC|BC|AB|MB|SK|NS|NB|NL|PE|NT|NU|YT)\b', window)
            if loc_m:
                loc = loc_m.group(1).strip() + ", " + loc_m.group(2)
            elif re.search(r'\bremote\b', window, re.I):
                loc = "Remote"
            else:
                loc = ""
            link = "https://builtin.com" + tmatch.group(1)
            seen.add(jid)
            out.append({
                "title": title, "company": company, "location": loc,
                "link": link, "source": "BuiltIn", "remote": (loc.lower() == "remote"),
                "salary": "", "date": "", "telework": "",
            })
            added += 1
        print(f"[BUILTIN] page {p}: {len(ids)} ids, {added} new")
        time.sleep(0.4)
    return out

# ---------------- RemoteOK ----------------
MGMT_TITLE = re.compile(
    r'\b(manager|director|head of|vp|vice president|chief|cto|cio|tech lead|engineering lead'
    r'|it manager|technology (lead|manager)|software (manager|director))\b', re.I)
JUNK = re.compile(r'\b(recruiter|non tech|hygiene|carros|limpeza|vendedor|atendente|operador)\b', re.I)

def remoteok_search():
    out = []
    try:
        d = json.loads(fetch("https://remoteok.com/api"))
    except Exception as e:
        print(f"[REMOTEOK] error: {e}", file=sys.stderr)
        return out
    if not isinstance(d, list):
        return out
    jobs = d[1:]  # first element is the legal notice
    for j in jobs:
        title = clean(j.get("position", ""))
        tags = j.get("tags") or []
        if not MGMT_TITLE.search(title):
            continue
        if JUNK.search(title) or "non tech" in tags:
            continue
        company = clean(j.get("company", ""))
        loc = clean(j.get("location", ""))
        if not loc:
            loc = "Remote"
        out.append({
            "title": title, "company": company, "location": loc,
            "link": j.get("url", ""), "source": "RemoteOK", "remote": True,
            "salary": "", "date": clean(j.get("date", ""))[:10], "telework": "",
        })
    return out

def main():
    results = []
    print("Scraping Built In Toronto...")
    try:
        results += builtin_search("toronto", pages=2)
        print(f"  BuiltIn Toronto: {len(results)} jobs")
    except Exception as e:
        print(f"  BuiltIn failed: {e}", file=sys.stderr)

    print("Scraping RemoteOK...")
    try:
        ro = remoteok_search()
        results += ro
        print(f"  RemoteOK: {len(ro)} jobs")
    except Exception as e:
        print(f"  RemoteOK failed: {e}", file=sys.stderr)

    with open("/opt/data/resumes/results_extra.json", "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nTotal extra results: {len(results)}")

if __name__ == "__main__":
    main()
