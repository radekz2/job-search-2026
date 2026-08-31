#!/usr/bin/env python3
import urllib.request, urllib.parse, re, html, json, time, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")

def clean(s):
    return re.sub(r"\s+", " ", html.unescape(s or "")).strip()

# ---------------- LINKEDIN ----------------
def linkedin_search(keyword, location=None, remote=False, start=0):
    params = {"keywords": keyword, "start": str(start)}
    if remote:
        params["f_WT"] = "2"   # remote filter
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
        t = clean(title.group(1))
        out.append({
            "title": t,
            "company": clean(comp.group(1)) if comp else "",
            "location": clean(loc.group(1)) if loc else "",
            "link": link.group(1).replace("&amp;", "&") if link else "",
            "remote": bool(remote),
        })
    return out

# ---------------- JOB BANK ----------------
def jobbank_search(keyword, location="Toronto, ON"):
    url = "https://www.jobbank.gc.ca/jobsearch/jobsearch?" + urllib.parse.urlencode({
        "searchstring": keyword, "locationstring": location})
    h = fetch(url)
    arts = re.findall(r'<article[^>]*>(.*?)</article>', h, re.DOTALL)
    out = []
    for a in arts:
        href = re.search(r'href="(/jobsearch/jobposting/(\d+)[^"]*)"', a)
        title = re.search(r'<span class="noctitle">\s*(.*?)\s*</span>', a, re.DOTALL)
        if not (href and title):
            continue
        jid = href.group(2)
        comp = re.search(r'<li class="business">(.*?)</li>', a, re.DOTALL)
        loc = re.search(r'<li class="location">(.*?)</li>', a, re.DOTALL)
        sal = re.search(r'<li class="salary">(.*?)</li>', a, re.DOTALL)
        date = re.search(r'<li class="date">(.*?)</li>', a, re.DOTALL)
        tele = re.search(r'<span class="telework">([^<]*)</span>', a)
        out.append({
            "title": clean(title.group(1)),
            "company": clean(comp.group(1)) if comp else "",
            "location": clean(loc.group(1)) if loc else "",
            "salary": clean(sal.group(1)) if sal else "",
            "date": clean(date.group(1)) if date else "",
            "telework": clean(tele.group(1)) if tele else "",
            "link": "https://www.jobbank.gc.ca/jobsearch/jobposting/" + jid,
        })
    return out

def main():
    li_keywords = [
        ("software manager", "Toronto, Ontario, Canada", False),
        ("technology manager", "Toronto, Ontario, Canada", False),
        ("IT manager", "Toronto, Ontario, Canada", False),
        ("director of technology", "Toronto, Ontario, Canada", False),
        ("director of software", "Toronto, Ontario, Canada", False),
        ("applications manager", "Toronto, Ontario, Canada", False),
        ("enterprise applications manager", "Toronto, Ontario, Canada", False),
        ("director of software engineering", "Toronto, Ontario, Canada", False),
        # remote
        ("software manager", None, True),
        ("director of technology", None, True),
        ("technology manager", None, True),
        ("IT manager", None, True),
    ]
    jb_keywords = [
        "software manager", "technology manager", "IT manager",
        "director of technology", "director of software", "applications manager",
        "enterprise applications manager",
    ]

    li_results, seen_li = [], set()
    for kw, loc, remote in li_keywords:
        for start in (0, 10):
            try:
                res = linkedin_search(kw, loc, remote, start)
            except Exception as e:
                print(f"[LI ERR] {kw} remote={remote} start={start}: {e}", file=sys.stderr)
                continue
            added = 0
            for r in res:
                key = (r["title"].lower(), r["company"].lower())
                if key in seen_li:
                    continue
                seen_li.add(key)
                r["query"] = kw + (" (remote)" if remote else "")
                li_results.append(r)
                added += 1
            print(f"[LI] {kw!r} remote={remote} start={start}: {len(res)} fetched, {added} new")
            time.sleep(0.4)
        time.sleep(0.4)

    jb_results, seen_jb = [], set()
    for kw in jb_keywords:
        try:
            res = jobbank_search(kw)
        except Exception as e:
            print(f"[JB ERR] {kw}: {e}", file=sys.stderr)
            continue
        added = 0
        for r in res:
            key = (r["title"].lower(), r["company"].lower())
            if key in seen_jb:
                continue
            seen_jb.add(key)
            r["query"] = kw
            jb_results.append(r)
            added += 1
        print(f"[JB] {kw!r}: {len(res)} fetched, {added} new")
        time.sleep(0.4)

    with open("/opt/data/resumes/results.json", "w") as f:
        json.dump({"li": li_results, "jb": jb_results}, f, indent=2)
    print(f"\nTOTAL LinkedIn: {len(li_results)}  JobBank: {len(jb_results)}")

if __name__ == "__main__":
    main()
