# Networking & Career Events Monitoring (in-person, GTA)

Complements the job-postings pipeline: surfaces **free / low-cost in-person +
hybrid events** in the Greater Toronto Area the candidate can attend for
networking during a job search. Deterministic scrape, no API keys, stdlib only.

Implementation: `/opt/data/events_monitor.py` (run `python3 /opt/data/events_monitor.py`).
Cron wrapper: `/opt/data/scripts/events_monitor.sh`. Output is dated
`/opt/data/resumes/events/events-gta-YYYY-MM-DD.{html,json}` — old files never deleted.

## Working sources (no key / no login)

### Meetup RSS (primary, highest-value)
- Endpoint: `https://www.meetup.com/{group-slug}/events/rss/`
- Returns RSS 2.0 XML — `<item>` blocks with `<title>`, `<link>`, `<description>`, `<pubDate>`.
- Bad slug → HTTP 404 body `{"message":"Group not found"}`.
- **PITFALL: Meetup RSS has NO structured event date.** `<pubDate>` is the
  *post* date, not when the event runs. Extract the real date from the
  title/description text with regex (`September 14, 2026`, `Sep 14 2026`,
  `14 September 2026`, ISO `2026-09-14`). Pin date-only events to **noon UTC**
  so `America/Toronto` grouping doesn't shift them onto the previous day.
- Venue usually lives in `<description>` as "City, ON, CA" or
  "Location not specified yet". A group with no upcoming events returns zero
  `<item>`s (normal, not an error).
- Curated Toronto group slugs (all verified 200 on 2026-08-31):
  `techto`, `startup-grind-toronto`, `devtoevents`, `producttank_toronto`,
  `fintech-toronto`, `toronto-aws-users-united`, `aws-toronto-user-group`,
  `owasp-toronto`, `toronto-java-users-group`, `gdg-toronto`, `toronto-modern-data`,
  `aittg-toronto`, `cognitive-toronto`, `torontoai`, `pydatato`, `python-toronto`,
  `startup-valley-toronto`, `Startup-Toronto`, `toronto-startup-founder-101`,
  `Toronto-Womens-Data-Group`, `torontojs`.

### Luma (public API, no key)
- Discover page `https://lu.ma/discover/{city}` (e.g. `/discover/toronto`) embeds
  `__NEXT_DATA__` JSON in `<script id="__NEXT_DATA__">`. Inside it:
  - `page.page.place.api_id` = discover place id (Toronto = `discplace-Cx3JMS6vXKAbhV5`).
  - `featured_event_api_ids` = list of `evt-...` ids — **only the featured events
    are embedded server-side**; the full list is fetched client-side, so a plain
    urllib pull of the discover page only gets ~9 featured events.
- Event detail (no auth): `GET https://api.lu.ma/event/get?event_api_id=evt-XXXX`
  returns full JSON. Key fields:
  - `event.name`, `event.start_at` (ISO-8601 UTC), `event.timezone`,
    `event.location_type` (`offline` / `virtual` / `hybrid` / `mixed`),
    `event.url` (slug), `event.geo_address_info.city_state` (e.g. "Toronto, ON")
    and `.street`.
  - `ticket_info.is_free` (bool), `ticket_info.price` / `max_price`.
  - `categories[]` each with `api_id` (`cat-tech`, `cat-ai`, `cat-business`,
    `cat-startup`, `cat-finance`, `cat-fintech`, `cat-data`, ...).
  - `calendar.name` = organizer.
- Build the event URL as `https://lu.ma/{event.url}`.
- **Discover is a GENERAL city feed** — it includes film screenings, running
  clubs, music, etc. Filter to tech-relevant categories and DROP `cat-film`,
  `cat-running`, `cat-music`, `cat-fitness`, `cat-arts`, etc.; when a category
  is unrecognized, fall back to a title/description keyword signal (ai/ml/llm/
  agent/tech/startup/founder/fintech/cloud/security/data/career/...).

### Career Fair Canada
- `https://careerfaircanada.ca/events` — server-rendered cards
  `<div class="cfc-sheet all any_month {Month} {city}">`.
- Card fields: `cfc-card__title` (city), `cfc-card__text` ("September 03, 2026"),
  `cfc-card__caption` (time + venue), and an Eventbrite `href` for tickets.
- **PITFALL: split on `cfc-sheet` must use a whitespace boundary (`cfc-sheet\s`).**
  Otherwise it also splits `cfc-sheets` (the container div) and the
  `cfc-sheet__picture` / `cfc-sheet__content` sub-divs, producing garbage city
  values like `__Content` / `__Picture` / `S`.
- National list — must filter to GTA cities; non-GTA fairs (Edmonton/Calgary/
  Vancouver/Winnipeg/Regina/Saskatoon) get dropped by the location filter.

## Bot-walled / not scrapeable (point user at email alerts instead)
- **Eventbrite** (`eventbrite.com/d/...` and `.ca`) → HTTP 405 "Human Verification".
- **Toronto Public Library** events → HTTP 403.
- **GC Job Bank job-fairs** pages → 404 at `/findajob/jobfairs`, `/jobfairs`, etc.
  (fairs are not exposed at a stable scrapeable URL).

## Filters applied (candidate: technology leader, Toronto)
- `location_type` in {in-person, hybrid} only (drop online/virtual).
- GTA whitelist (toronto, north york, scarborough, etobicoke, mississauga,
  brampton, vaughan, markham, richmond hill, oakville, burlington, milton,
  pickering, ajax, whitby, oshawa, newmarket, ...) + non-GTA blacklist.
- cost ≤ $30 (free preferred).
- tech relevance via Luma category + title-keyword fallback; dedupe by URL and by
  title+date (events cross-posted to multiple Meetup groups).

## Cron scheduling pitfall (Hermes)
- `cronjob` `script` must be a **bare filename relative to `~/.hermes/scripts/`**
  (which resolves to `/opt/data/scripts/` because `HERMES_HOME=/opt/data`).
  Absolute paths are rejected. For a deterministic scrape, use `no_agent=true`
  (stdout is delivered verbatim; EMPTY stdout = no delivery — keep the script
  printing a summary line even when nothing changed, so a healthy no-op run is
  still observable).
