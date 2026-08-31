#!/usr/bin/env python3
"""
GTA in-person networking / career events monitor.

Scrapes curated Toronto tech Meetup groups (RSS), Luma discover (featured events),
and Career Fair Canada. Filters to in-person / hybrid events in the Greater Toronto
Area that are free or low-cost and relevant to a technology leader's job search.
Writes a dated HTML report + JSON dump to /opt/data/resumes/events/.
Old dated files are never deleted.

Stdlib only (urllib + xml.etree + json). No API keys required.

Run:  python3 /opt/data/events_monitor.py
"""

import json
import os
import re
from datetime import datetime, timedelta, timezone
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import xml.etree.ElementTree as ET

OUT_DIR = "/opt/data/resumes/events"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# ---------------------------------------------------------------------------
# Source configuration
# ---------------------------------------------------------------------------

# Curated Toronto tech / leadership / networking Meetup groups.
# slug -> (display name, focus tag).
MEETUP_GROUPS = [
    ("techto",                       "TechTO",                          "leadership"),
    ("startup-grind-toronto",        "Startup Grind Toronto",           "networking"),
    ("devtoevents",                  "#DevTO",                          "networking"),
    ("producttank_toronto",          "ProductTank Toronto",             "product"),
    ("fintech-toronto",              "FinTech Toronto",                 "fintech"),
    ("toronto-aws-users-united",     "AWS User Group Toronto",          "cloud"),
    ("aws-toronto-user-group",       "AWS Ontario User Group",          "cloud"),
    ("owasp-toronto",                "OWASP Toronto Chapter",           "security"),
    ("toronto-java-users-group",     "Toronto Java Users Group",        "dev"),
    ("gdg-toronto",                  "Google Developer Group Toronto",  "cloud"),
    ("toronto-modern-data",          "Toronto AI and ML",               "data-ai"),
    ("aittg-toronto",                "Toronto AI Developers Group",     "data-ai"),
    ("cognitive-toronto",            "AI Professionals Toronto",        "data-ai"),
    ("torontoai",                    "Toronto AI Meetup",               "data-ai"),
    ("pydatato",                     "PyData Toronto",                  "data-ai"),
    ("python-toronto",               "Python Toronto",                  "dev"),
    ("startup-valley-toronto",       "Startups & Tech Events Toronto",  "networking"),
    ("Startup-Toronto",              "Toronto Business Startups",       "networking"),
    ("toronto-startup-founder-101",  "Toronto Startup Traction & Funding","networking"),
    ("Toronto-Womens-Data-Group",    "Toronto Women's Data Group",      "data-ai"),
    ("torontojs",                    "Toronto JavaScript",              "dev"),
    # Vendor-run user groups (promotional/networking)
    ("snowflake-usergroup-toronto",  "Snowflake User Group Toronto",   "data-ai"),
    ("toronto-mongodb-usergroup",    "MongoDB User Group Toronto",     "data-ai"),
    ("elastic-toronto-user-group",   "Elastic User Group Toronto",     "data-ai"),
    ("kubernetes-toronto",           "Kubernetes Toronto (CNCF)",      "cloud"),
]

LUMA_DISCOVER_URL = "https://lu.ma/discover/toronto"
LUMA_EVENT_URL = "https://api.lu.ma/event/get"

CAREERFAIR_URL = "https://careerfaircanada.ca/events"

# Vendor "Bevy" user-group portals (clean public JSON API).
# (host, chapter_slug, display name, focus). Snowflake + Databricks confirmed.
BEVY_CHAPTERS = [
    ("https://usergroups.snowflake.com", "toronto", "Snowflake User Group Toronto", "data-ai"),
    ("https://usergroups.databricks.com", "toronto-databricks-user-group", "Databricks User Group Toronto", "data-ai"),
]

# Vendor events pages scraped from server-rendered HTML / inline JS.
BMC_EVENTS_URL = "https://www.bmc.com/events.html"

# Optional search-supplement file (written by the agent search pass) merged in
# when present. Same event-dict schema, date_utc as ISO string.
SUPPLEMENT_PATH = "/opt/data/resumes/events/search_supplement.json"

# ---------------------------------------------------------------------------
# Luma relevance (discover is a general city feed -> must filter to tech)
# ---------------------------------------------------------------------------

LUMA_KEEP_CATS = {
    "cat-tech", "cat-ai", "cat-business", "cat-startup", "cat-entrepreneurship",
    "cat-career", "cat-finance", "cat-fintech", "cat-data",
}
LUMA_DROP_CATS = {
    "cat-film", "cat-movie", "cat-running", "cat-fitness", "cat-music", "cat-arts",
    "cat-food", "cat-sports", "cat-wellness", "cat-yoga", "cat-dance", "cat-comedy",
    "cat-theater", "cat-theatre", "cat-fashion", "cat-photography",
}
TECH_TITLE_RE = re.compile(
    r'\b(ai|ml|llm|genai|agentic|agent|tech|software|engineer|develop|data|cloud|'
    r'saas|startup|founder|venture|funding|investor|fintech|product|security|cyber|'
    r'network|career|hiring|recruit|business|leadership|executive|enterprise|digital|'
    r'innovation|coding|code|devops|crypto|web3|blockchain|analytics|open house|'
    r'mixer|roundtable|meetup|summit|conference|expo)\b', re.I)

# ---------------------------------------------------------------------------
# Filters
# ---------------------------------------------------------------------------

GTA_CITIES = [
    "toronto", "north york", "scarborough", "etobicoke", "east york",
    "mississauga", "brampton", "vaughan", "markham", "richmond hill",
    "oakville", "burlington", "milton", "pickering", "ajax", "whitby",
    "oshawa", "newmarket", "aurora", "king city", "caledon", "georgetown",
    "whitchurch-stouffville", "greater toronto area", "gta",
]
NON_GTA = [
    "ottawa", "london", "hamilton", "kitchener", "waterloo", "cambridge",
    "guelph", "windsor", "kingston", "barrie", "sudbury", "thunder bay",
    "sarnia", "niagara", "st. catharines", "st catharines", "peterborough",
    "north bay", "sault ste. marie", "timmins", "cornwall", "belleville",
    "edmonton", "calgary", "vancouver", "winnipeg", "regina", "saskatoon",
    "montreal", "quebec", "halifax", "moncton", "st. john's", "victoria",
    "kelowna", "red deer", "lethbridge", "surrey", "burnaby",
    # foreign (defense-in-depth for any future global source)
    "new york", "nyc", "austin", "chicago", "boston", "san francisco",
    "seattle", "atlanta", "dallas", "denver", "miami", "los angeles",
    "philadelphia", "paris", "london", "hamburg", "frankfurt", "berlin",
    "munich", "madrid", "barcelona", "copenhagen", "amsterdam", "dublin",
    "sao paulo", "são paulo", "mexico city", "singapore", "sydney",
    "melbourne", "tokyo", "dubai",
]

ONLINE_HINTS = [
    "online event", "virtual event", "online only", "zoom", "webinar",
    "livestream", "live stream", "streaming", "google meet", "microsoft teams",
    "remote event", "via zoom", "on zoom", "webcast", "virtual-only",
]
HYBRID_HINTS = ["hybrid"]

MAX_PRICE = 30.0
LOOKAHEAD_DAYS = 90


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fetch(url, timeout=25, as_json=False):
    req = Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-CA,en;q=0.9",
    })
    try:
        with urlopen(req, timeout=timeout) as r:
            body = r.read().decode("utf-8", errors="replace")
        return json.loads(body) if as_json else body
    except Exception:
        return None


def fetch_json(url, timeout=25):
    return fetch(url, timeout=timeout, as_json=True)


def now_utc():
    return datetime.now(timezone.utc)


def to_toronto(dt_utc):
    if dt_utc is None:
        return None
    try:
        from zoneinfo import ZoneInfo
        return dt_utc.astimezone(ZoneInfo("America/Toronto"))
    except Exception:
        return dt_utc.astimezone(timezone(timedelta(hours=-4)))


def parse_iso(s):
    if not s:
        return None
    try:
        dt = datetime.fromisoformat(s.strip().replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return None


def strip_query(url):
    return url.split("?")[0]


def html_escape(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ---------------------------------------------------------------------------
# Date extraction (Meetup RSS has no structured event date)
# ---------------------------------------------------------------------------

_MONTHS = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11,
    "december": 12, "jan": 1, "feb": 2, "mar": 3, "apr": 4, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
}


def extract_event_date(title, description):
    """Best-effort event DATE (aware UTC, pinned to noon so Toronto grouping
    stays on the same calendar day). Returns None when undeterminable."""
    text = f"{title or ''} {description or ''}"
    year = datetime.now().year
    candidates = []

    m = re.search(r'\b(january|february|march|april|may|june|july|august|'
                  r'september|october|november|december|jan|feb|mar|apr|jun|'
                  r'jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})'
                  r'(?:st|nd|rd|th)?,?\s*(\d{4})?', text, re.I)
    if m:
        mon = _MONTHS[m.group(1).lower().rstrip(".")]
        day = int(m.group(2))
        y = int(m.group(3)) if m.group(3) else year
        candidates.append(datetime(y, mon, day, tzinfo=timezone.utc))

    m = re.search(r'\b(\d{1,2})(?:st|nd|rd|th)?\s+'
                  r'(january|february|march|april|may|june|july|august|'
                  r'september|october|november|december)[a-z]*\.?,?\s*(\d{4})?',
                  text, re.I)
    if m:
        mon = _MONTHS[m.group(2).lower()]
        day = int(m.group(1))
        y = int(m.group(3)) if m.group(3) else year
        candidates.append(datetime(y, mon, day, tzinfo=timezone.utc))

    m = re.search(r'\b(20\d{2})-(\d{2})-(\d{2})\b', text)
    if m:
        candidates.append(datetime(int(m.group(1)), int(m.group(2)),
                                   int(m.group(3)), tzinfo=timezone.utc))

    if not candidates:
        return None
    now = now_utc()
    future = [c for c in candidates if c >= now - timedelta(days=1)]
    pool = future or candidates
    best = min(pool, key=lambda c: abs((c - now).total_seconds()))
    return best.replace(hour=12, minute=0, second=0, microsecond=0)


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------

def classify_location(text):
    t = (text or "").lower()
    loctype = "unknown"
    if any(h in t for h in HYBRID_HINTS):
        loctype = "hybrid"
    elif any(h in t for h in ONLINE_HINTS):
        loctype = "online"
    loc = "See event page"
    m = re.search(r'([A-Za-z][A-Za-z .-]+?),\s*(ON|Ontario)(\s*,\s*CA)?', text or "")
    if m:
        loc = m.group(1).strip() + ", ON"
    return loc, loctype


def classify_cost(text):
    t = (text or "").lower()
    amounts = [float(a) for a in re.findall(r'\$\s?(\d+(?:\.\d{1,2})?)', text or "")]
    if any(w in t for w in ["free", "no cost", "free to attend", "free admission"]):
        return "Free", 0.0, True
    if "paid" in t or "ticket" in t or "registration fee" in t or "cover" in t:
        if amounts:
            return f"${min(amounts):g}", min(amounts), False
        return "Paid (price TBD)", None, False
    if amounts:
        return f"${min(amounts):g}", min(amounts), False
    return "Free (typical)", 0.0, True


def _has_word(text, word):
    """Whole-word match (word boundaries) to avoid 'york' ⊂ 'new york' etc."""
    return re.search(r'\b' + re.escape(word) + r'\b', text, re.I) is not None


def is_gta(location_text):
    lt = (location_text or "").lower()
    if not lt or lt == "see event page":
        return True
    if any(_has_word(lt, c) for c in GTA_CITIES):
        return True
    if any(_has_word(lt, c) for c in NON_GTA):
        return False
    return True


def luma_is_relevant(cats, title, desc):
    if isinstance(cats, str):
        cats = [cats]
    cats = cats or []
    for c in cats:
        if c in LUMA_DROP_CATS:
            return False
    for c in cats:
        if c in LUMA_KEEP_CATS:
            return True
    # no recognized category -> fall back to title/description keyword signal
    return bool(TECH_TITLE_RE.search(f"{title or ''} {desc or ''}"))


# ---------------------------------------------------------------------------
# Parsers
# ---------------------------------------------------------------------------

def parse_meetup():
    events, errors = [], []
    for slug, name, focus in MEETUP_GROUPS:
        url = f"https://www.meetup.com/{slug}/events/rss/"
        xml_text = fetch(url, timeout=20)
        if xml_text is None:
            errors.append(f"Meetup {name}: fetch failed")
            continue
        try:
            root = ET.fromstring(xml_text)
        except Exception as e:
            errors.append(f"Meetup {name}: XML parse failed ({e})")
            continue
        for item in root.findall(".//item"):
            title = (item.findtext("title") or "").strip()
            link = strip_query((item.findtext("link") or "").strip())
            desc = (item.findtext("description") or "").strip()
            if not title and not link:
                continue
            loc, loctype = classify_location(title + " " + desc)
            cost, cost_num, is_free = classify_cost(desc)
            events.append({
                "title": title, "url": link or url,
                "date_utc": extract_event_date(title, desc),
                "has_time": False,
                "location": loc, "location_type": loctype,
                "cost": cost, "cost_num": cost_num, "is_free": is_free,
                "organizer": name, "source": "Meetup", "focus": focus,
                "description": desc,
            })
    return events, errors


def parse_luma():
    events, errors = [], []
    html = fetch(LUMA_DISCOVER_URL, timeout=25)
    if html is None:
        errors.append("Luma discover: fetch failed")
        return events, errors
    ids = []
    m = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    if m:
        try:
            data = json.loads(m.group(1))
            ids = _find_key(data, "featured_event_api_ids") or []
        except Exception as e:
            errors.append(f"Luma NEXT_DATA parse failed ({e})")
    if not ids:
        ids = re.findall(r'evt-[A-Za-z0-9]+', html)
    ids = list(dict.fromkeys(ids))

    for eid in ids:
        d = fetch_json(f"{LUMA_EVENT_URL}?event_api_id={eid}", timeout=20)
        if not d or not isinstance(d, dict):
            continue
        ev = d.get("event") or {}
        cal = d.get("calendar") or {}
        name = ev.get("name")
        if not name:
            continue
        cats = [c.get("api_id") for c in (d.get("categories") or []) if c.get("api_id")]
        desc = ev.get("description") or cal.get("description_short") or ""
        if not luma_is_relevant(cats, name, desc):
            continue

        url_slug = ev.get("url")
        url = f"https://lu.ma/{url_slug}" if url_slug else f"https://lu.ma/{eid}"
        dt = parse_iso(ev.get("start_at") or d.get("start_at"))
        loc = _luma_location(ev)

        lt = (ev.get("location_type") or "").lower()
        if lt in ("virtual", "online"):
            loctype = "online"
        elif lt in ("hybrid", "mixed"):
            loctype = "hybrid"
        elif lt in ("offline", "physical"):
            loctype = "in-person"
        else:
            loctype = classify_location(name + " " + (loc or ""))[1]

        ti = d.get("ticket_info") or {}
        is_free = ti.get("is_free")
        price = ti.get("price") or ti.get("max_price")
        cost_num = float(price) if isinstance(price, (int, float)) else None
        if is_free is True or (cost_num is not None and cost_num == 0):
            cost, is_free = "Free", True
        elif cost_num is not None:
            cost = f"${cost_num:g}"
        else:
            cost = "See event page"

        events.append({
            "title": name, "url": url,
            "date_utc": dt, "has_time": dt is not None,
            "location": loc or "See event page", "location_type": loctype,
            "cost": cost, "cost_num": cost_num, "is_free": is_free,
            "organizer": cal.get("name") or "Luma", "source": "Luma",
            "focus": "networking", "description": desc,
        })
    return events, errors


def _find_key(obj, key):
    if isinstance(obj, dict):
        if key in obj:
            v = obj[key]
            return v if isinstance(v, list) else [v]
        for v in obj.values():
            r = _find_key(v, key)
            if r:
                return r
    elif isinstance(obj, list):
        for v in obj:
            r = _find_key(v, key)
            if r:
                return r
    return None


def _luma_location(ev):
    gai = ev.get("geo_address_info") or {}
    if isinstance(gai, str):
        try:
            gai = json.loads(gai)
        except Exception:
            gai = {}
    if not isinstance(gai, dict):
        return None
    street = (gai.get("street") or gai.get("address") or "").strip()
    city_state = (gai.get("city_state") or gai.get("city") or "").strip()
    if street and city_state:
        return f"{street}, {city_state}"
    return city_state or None


def parse_careerfair():
    events, errors = [], []
    html = fetch(CAREERFAIR_URL, timeout=25)
    if html is None:
        errors.append("Career Fair Canada: fetch failed")
        return events, errors
    # Each event is a <div class="cfc-sheet ... {city}"> card. The trailing `\s`
    # excludes `cfc-sheets` (container) and `cfc-sheet__picture`/`__content` sub-divs.
    for card in re.split(r'<div class="cfc-sheet\s', html)[1:]:
        city = ""
        # After splitting on '<div class="cfc-sheet', each card begins with the
        # rest of the class attribute, e.g. ' all any_month September edmonton">'.
        head = card[:200]
        hm0 = re.match(r'\s*([^"]*)"', head)
        if hm0:
            classes = hm0.group(1).split()
            if classes:
                city = classes[-1].replace("-", " ").title().strip()
        title_m = re.search(r'cfc-card__title">\s*([^<]+?)\s*<', card)
        title = (title_m.group(1).strip() if title_m else city)
        if city and title and title.lower() == city.lower():
            title = f"{title} Career Fair & Training Expo"
        date_str = ""
        dm = re.search(r'cfc-card__text">\s*([^<]+?)\s*<', card)
        if dm:
            date_str = dm.group(1).strip()
        venue = ""
        caps = re.findall(r'cfc-card__caption">\s*([^<]+?)\s*<', card)
        if caps:
            venue = caps[-1].strip()
        href = ""
        hm = re.search(r'href="(https://www\.eventbrite[^"]+)"', card)
        if hm:
            href = html_unescape(hm.group(1))
        else:
            hm2 = re.search(r'href="(/events/[^"]+)"', card)
            if hm2:
                href = "https://careerfaircanada.ca" + hm2.group(1)
        dt = None
        try:
            dt = datetime.strptime(date_str, "%B %d, %Y").replace(
                hour=12, tzinfo=timezone.utc)
        except Exception:
            dt = None
        events.append({
            "title": title, "url": href or CAREERFAIR_URL,
            "date_utc": dt, "has_time": False,
            "location": (city or "See event page"),
            "location_type": "in-person",
            "cost": "Free", "cost_num": 0.0, "is_free": True,
            "organizer": "Career Fair Canada", "source": "Career Fair Canada",
            "focus": "career", "description": f"{title} — {date_str} — {venue}",
        })
    return events, errors


def html_unescape(s):
    return (s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
             .replace("&quot;", '"').replace("&#39;", "'"))


def parse_bevy():
    """Vendor user-group portals on the Bevy platform (Snowflake, Databricks...)."""
    events, errors = [], []
    for host, slug, display, focus in BEVY_CHAPTERS:
        ch = fetch_json(f"{host}/api/chapter_slim/{slug}/", timeout=20)
        if not ch or not isinstance(ch, dict) or not ch.get("id"):
            errors.append(f"Bevy {display}: chapter lookup failed")
            continue
        cid = ch["id"]
        ev = fetch_json(
            f"{host}/api/event_slim/for_chapter/{cid}/"
            f"?fields=title,start_date,end_date,event_type_title,url,description_short"
            f"&page_size=20", timeout=20)
        if not ev or not isinstance(ev, dict):
            errors.append(f"Bevy {display}: event list failed")
            continue
        for e in (ev.get("results") or []):
            title = e.get("title")
            if not title:
                continue
            url = e.get("url") or ""
            if url and not url.startswith("http"):
                url = host + url
            etype = (e.get("event_type_title") or "").lower()
            if "virtual" in etype or "online" in etype:
                loctype = "online"
            else:
                loctype = "in-person"
            events.append({
                "title": title, "url": url or f"{host}/events",
                "date_utc": parse_iso(e.get("start_date")),
                "has_time": bool(e.get("start_date")),
                "location": "Toronto, ON", "location_type": loctype,
                "cost": "Free", "cost_num": 0.0, "is_free": True,
                "organizer": display, "source": "Vendor (Bevy)", "focus": focus,
                "description": (e.get("description_short") or "").strip(),
            })
    return events, errors


def parse_bmc():
    """BMC events page — global list embedded in an inline JS `listItems` array."""
    events, errors = [], []
    html = fetch(BMC_EVENTS_URL, timeout=25)
    if html is None:
        errors.append("BMC events: fetch failed")
        return events, errors
    year = datetime.now().year
    m = re.search(r'listItems:\s*\[', html)
    if not m:
        errors.append("BMC events: listItems not found")
        return events, errors
    block = html[m.end():]
    pat = (r'id:\s*\d+,\s*name:\s*"([^"]+)",.*?date:\s*"([^"]+)",'
           r'.*?"location-city":\s*"([^"]*)",.*?url:\s*"([^"]+)"')
    for em in re.finditer(pat, block, re.S):
        name = em.group(1).strip()
        date_str = em.group(2).strip()
        city = em.group(3).strip()
        url = em.group(4).strip()
        # global source -> strict GTA whitelist; empty city = virtual/global event
        if not city or not any(_has_word(city.lower(), g) for g in GTA_CITIES):
            continue
        if url.startswith("/content/"):
            url = "https://www.bmc.com" + url
        dt = None
        dm = re.match(r'([A-Za-z]+)\s+(\d{1,2})', date_str)
        if dm:
            mon = _MONTHS.get(dm.group(1).lower().rstrip("."))
            if mon:
                try:
                    day = int(dm.group(2))
                    dt = datetime(year, mon, day, 12, 0, 0, tzinfo=timezone.utc)
                except ValueError:
                    dt = None
        events.append({
            "title": name, "url": url,
            "date_utc": dt, "has_time": False,
            "location": f"{city}, ON" if city else "See event page",
            "location_type": "in-person",
            "cost": "Free", "cost_num": 0.0, "is_free": True,
            "organizer": "BMC", "source": "Vendor (BMC)", "focus": "vendor",
            "description": name,
        })
    return events, errors


def parse_supplement():
    """Merge agent-written search-supplement events (search_supplement.json)."""
    events, errors = [], []
    if not os.path.exists(SUPPLEMENT_PATH):
        return events, errors
    try:
        with open(SUPPLEMENT_PATH) as f:
            data = json.load(f)
    except Exception as e:
        errors.append(f"supplement read failed ({e})")
        return events, errors
    items = data if isinstance(data, list) else data.get("events", [])
    for it in items:
        if not isinstance(it, dict):
            continue
        dt = parse_iso(it.get("date_utc"))
        events.append({
            "title": (it.get("title") or "").strip(),
            "url": (it.get("url") or "").strip(),
            "date_utc": dt, "has_time": bool(it.get("has_time", dt is not None)),
            "location": it.get("location") or "See event page",
            "location_type": it.get("location_type") or "unknown",
            "cost": it.get("cost") or "See event page",
            "cost_num": it.get("cost_num"),
            "is_free": bool(it.get("is_free")),
            "organizer": it.get("organizer") or "",
            "source": it.get("source") or "Search",
            "focus": it.get("focus") or "networking",
            "description": it.get("description") or "",
        })
    return events, errors


# ---------------------------------------------------------------------------
# Filter / rank
# ---------------------------------------------------------------------------

def filter_events(raw_events):
    kept, dropped = [], []
    now = now_utc()
    for e in raw_events:
        if e["location_type"] == "online":
            dropped.append((e, "online-only"))
            continue
        if not is_gta(e["location"]):
            dropped.append((e, "outside GTA"))
            continue
        if e["date_utc"] is not None and e["date_utc"] < now - timedelta(hours=12):
            dropped.append((e, "past event"))
            continue
        if e["cost_num"] is not None and e["cost_num"] > MAX_PRICE:
            dropped.append((e, f"price ${e['cost_num']:g} > ${MAX_PRICE:g}"))
            continue
        kept.append(e)

    # dedupe: exact URL, plus same title+date (cross-posted to multiple groups)
    seen_url = set()
    seen_title = set()
    deduped = []
    for e in kept:
        key_url = e["url"]
        key_title = (e["title"].strip().lower(), e["date_utc"])
        if key_url in seen_url or key_title in seen_title:
            continue
        seen_url.add(key_url)
        seen_title.add(key_title)
        deduped.append(e)

    deduped.sort(key=lambda e: (e["date_utc"] is None,
                                e["date_utc"].timestamp() if e["date_utc"] else 0))
    return deduped, dropped


# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------

def fmt_date(dt_utc, has_time=False):
    if dt_utc is None:
        return "Date TBD"
    local = to_toronto(dt_utc)
    if has_time:
        return local.strftime("%a %b %-d, %Y · %-I:%M %p ET")
    return local.strftime("%a %b %-d, %Y")


def fmt_date_short(dt_utc):
    if dt_utc is None:
        return "TBD"
    return to_toronto(dt_utc).strftime("%b %-d")


def build_html(events, dropped, meta):
    now = now_utc()
    today = to_toronto(now).strftime("%A %B %-d, %Y")

    buckets = {}
    for e in events:
        key = to_toronto(e["date_utc"]).strftime("%Y-%m-%d") if e["date_utc"] else "tbd"
        buckets.setdefault(key, []).append(e)

    def day_label(key):
        if key == "tbd":
            return "Date TBD"
        d = datetime.strptime(key, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return d.strftime("%A %B %-d, %Y")

    focus_icon = {
        "leadership": "👔", "networking": "🤝", "product": "📦", "fintech": "💹",
        "cloud": "☁️", "security": "🛡️", "data-ai": "🤖", "dev": "💻", "career": "🎯",
        "vendor": "🏢",
    }

    rows = []
    for key in sorted(buckets.keys()):
        day_events = buckets[key]
        rows.append(f'<h2 class="day">{html_escape(day_label(key))}'
                    f' <span class="count">{len(day_events)}</span></h2>')
        for e in day_events:
            cost_badge = ("free" if (e["is_free"] or e["cost_num"] == 0)
                          else ("paid" if e["cost_num"] is not None else "tbd"))
            loc_badge = e["location_type"] if e["location_type"] in ("in-person", "hybrid") else "tbd"
            when = fmt_date(e["date_utc"], e.get("has_time", False))
            rows.append(f'''
            <div class="ev">
              <div class="ev-head">
                <a class="title" href="{html_escape(e["url"])}" target="_blank" rel="noopener">{html_escape(e["title"])}</a>
                <span class="when">{html_escape(when)}</span>
              </div>
              <div class="meta">
                <span class="badge cost cost-{cost_badge}">{html_escape(e["cost"])}</span>
                <span class="badge loc loc-{loc_badge}">{html_escape(loc_badge)}</span>
                <span class="badge focus" title="focus">{focus_icon.get(e["focus"], "•")} {html_escape(e["focus"])}</span>
                <span class="src">via {html_escape(e["source"])} · {html_escape(e["organizer"])}</span>
              </div>
              <div class="where">📍 {html_escape(e["location"])}</div>
            </div>''')
    body_rows = "\n".join(rows)

    dropped_rows = "".join(
        f'<li><span class="reason">[{html_escape(r)}]</span> {html_escape(e["title"])} — {html_escape(e["organizer"])}</li>'
        for e, r in dropped
    ) or "<li>None</li>"

    n_free = sum(1 for e in events if e["is_free"] or e["cost_num"] == 0)
    n_inperson = sum(1 for e in events if e["location_type"] == "in-person")
    n_hybrid = sum(1 for e in events if e["location_type"] == "hybrid")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GTA Networking &amp; Career Events — {today}</title>
<style>
  :root {{ --bg:#0f172a; --card:#1e293b; --fg:#e2e8f0; --muted:#94a3b8;
          --accent:#38bdf8; --good:#34d399; --warn:#fbbf24; --border:#334155; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--fg);
         font:15px/1.5 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; }}
  .wrap {{ max-width:880px; margin:0 auto; padding:28px 20px 60px; }}
  h1 {{ font-size:24px; margin:0 0 4px; }}
  .sub {{ color:var(--muted); margin:0 0 20px; }}
  .pills {{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px; }}
  .pill {{ background:var(--card); border:1px solid var(--border); border-radius:999px;
          padding:6px 14px; font-size:13px; color:var(--fg); }}
  .pill b {{ color:var(--accent); }}
  h2.day {{ font-size:18px; margin:28px 0 10px; padding-bottom:6px;
           border-bottom:1px solid var(--border); color:var(--accent); }}
  h2.day .count {{ background:var(--card); border-radius:999px; padding:1px 10px;
                  font-size:13px; color:var(--muted); font-weight:600; }}
  .ev {{ background:var(--card); border:1px solid var(--border); border-radius:12px;
         padding:14px 16px; margin-bottom:10px; }}
  .ev-head {{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; }}
  .ev-head .title {{ color:var(--fg); font-size:16px; font-weight:600; text-decoration:none; }}
  .ev-head .title:hover {{ color:var(--accent); }}
  .when {{ color:var(--muted); font-size:13px; white-space:nowrap; }}
  .meta {{ display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin:8px 0 4px; }}
  .badge {{ font-size:12px; padding:2px 9px; border-radius:6px; border:1px solid var(--border); }}
  .cost-free {{ color:var(--good); border-color:#134e4a; background:#0f2f2b; }}
  .cost-paid {{ color:var(--warn); border-color:#4a3b0f; background:#2f270f; }}
  .cost-tbd {{ color:var(--muted); }}
  .loc-in-person {{ color:var(--accent); }}
  .loc-hybrid {{ color:#c4b5fd; }}
  .focus {{ color:var(--muted); }}
  .src {{ font-size:12px; color:var(--muted); }}
  .where {{ font-size:13px; color:var(--muted); margin-top:4px; }}
  details.agg {{ margin-top:30px; }}
  summary {{ cursor:pointer; color:var(--muted); }}
  .dropped {{ font-size:13px; color:var(--muted); }}
  .dropped .reason {{ color:var(--warn); }}
  footer {{ margin-top:30px; color:var(--muted); font-size:12px; }}
</style>
</head>
<body>
<div class="wrap">
  <h1>📍 GTA Networking &amp; Career Events</h1>
  <p class="sub">In-person &amp; hybrid · free / low-cost · Toronto area · generated {today}</p>
  <div class="pills">
    <span class="pill"><b>{len(events)}</b> upcoming events</span>
    <span class="pill"><b>{n_free}</b> free</span>
    <span class="pill"><b>{n_inperson}</b> in-person · <b>{n_hybrid}</b> hybrid</span>
    <span class="pill"><b>{meta["sources"]}</b> sources</span>
  </div>
  {body_rows}
  <details class="agg">
    <summary>Excluded this run ({len(dropped)}): online-only, outside GTA, past, non-tech, or &gt;${int(MAX_PRICE)}</summary>
    <ul class="dropped">{dropped_rows}</ul>
  </details>
  <footer>Sources: Meetup (curated Toronto + vendor groups) · Luma discover · vendor
  user-group portals (Bevy, BMC) · Career Fair Canada · web search.
  Generated by <code>events_monitor.py</code> — refresh by re-running.</footer>
</div>
</body>
</html>"""
    return html


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    raw, errors = [], []
    for fn in (parse_meetup, parse_luma, parse_careerfair,
               parse_bevy, parse_bmc, parse_supplement):
        try:
            evs, errs = fn()
            raw.extend(evs)
            errors.extend(errs)
        except Exception as e:
            errors.append(f"{fn.__name__}: {e}")

    kept, dropped = filter_events(raw)

    run_date = now_utc().strftime("%Y-%m-%d")
    os.makedirs(OUT_DIR, exist_ok=True)
    json_path = f"{OUT_DIR}/events-gta-{run_date}.json"
    html_path = f"{OUT_DIR}/events-gta-{run_date}.html"

    payload = {
        "generated_at": now_utc().isoformat(),
        "sources": ["Meetup (curated + vendor groups)", "Luma discover",
                    "Vendor (Bevy)", "Vendor (BMC)", "Career Fair Canada", "Search"],
        "total_raw": len(raw), "total_kept": len(kept), "total_dropped": len(dropped),
        "errors": errors,
        "events": [
            {
                "title": e["title"], "url": e["url"],
                "date_utc": e["date_utc"].isoformat() if e["date_utc"] else None,
                "has_time": e.get("has_time", False),
                "location": e["location"], "location_type": e["location_type"],
                "cost": e["cost"], "cost_num": e["cost_num"], "is_free": e["is_free"],
                "organizer": e["organizer"], "source": e["source"], "focus": e["focus"],
            } for e in kept
        ],
    }
    with open(json_path, "w") as f:
        json.dump(payload, f, indent=2)

    distinct_sources = sorted({e["source"] for e in kept})
    meta = {"sources": len(distinct_sources)}
    with open(html_path, "w") as f:
        f.write(build_html(kept, dropped, meta))

    print(f"GTA events run {run_date}: {len(kept)} kept, {len(dropped)} dropped, "
          f"{len(raw)} raw, {len(errors)} source errors")
    if errors:
        for err in errors[:10]:
            print(f"  ! {err}")
    if kept:
        print("  Upcoming (first 10):")
        for e in kept[:10]:
            d = fmt_date_short(e["date_utc"])
            print(f"    [{d}] {e['title'][:64]} — {e['organizer']} ({e['cost']})")
    print(f"  HTML: {html_path}")
    print(f"  JSON: {json_path}")


if __name__ == "__main__":
    main()
