# Event Sources — endpoints, schemas, and reachability

All keyless (no API keys) unless noted. Use a desktop `User-Agent` header on
every request; several hosts bot-block bare `urllib` defaults.

Common UA:
`Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36`

---

## Meetup — RSS (works, no key)

`GET https://www.meetup.com/{slug}/events/rss/`

- Returns XML `<rss><channel><item>` with `title`, `link`, `pubDate`,
  `description`. No structured event datetime; `pubDate` is the **post** date.
- A group with no upcoming events returns a valid feed with **0 `<item>`s**
  (HTTP 200), so an empty parse is not an error.
- Regex the event date out of `title`/`description` (month-name `%B %d, %Y` or
  `%d %B %Y` or ISO). Pin to **noon UTC** for stable local-day grouping.

Curated Toronto slugs (verified HTTP 200 on `/events/rss/`):
`techto`, `startup-grind-toronto`, `devtoevents`, `producttank_toronto`,
`fintech-toronto`, `toronto-aws-users-united`, `aws-toronto-user-group`,
`owasp-toronto`, `toronto-java-users-group`, `gdg-toronto`, `toronto-modern-data`,
`aittg-toronto`, `cognitive-toronto`, `torontoai`, `pydatato`, `python-toronto`,
`startup-valley-toronto`, `Startup-Toronto`, `toronto-startup-founder-101`,
`Toronto-Womens-Data-Group`, `torontojs` — plus vendor groups:
`snowflake-usergroup-toronto`, `toronto-mongodb-usergroup`,
`elastic-toronto-user-group`, `kubernetes-toronto`.
(404 on guesses: `toronto-databricks-user-group`, `confluent-toronto`,
`cncf-toronto`, `hashicorp-toronto`.)

---

## Luma (works, no key)

1. `GET https://lu.ma/discover/{city}` (e.g. `/discover/toronto`).
   The page has `<script id="__NEXT_DATA__">` JSON. Walk it for
   `featured_event_api_ids` (a list of `evt-...` ids — only ~9 featured events;
   the full city list is fetched client-side and is NOT in the HTML).
2. `GET https://api.lu.ma/event/get?event_api_id={id}` → full event JSON:

   - `event.name`, `event.start_at` (ISO 8601 `...Z`), `event.end_at`,
     `event.timezone` ("America/Toronto"), `event.url` (slug — build
     `https://lu.ma/{slug}`), `event.location_type` (`offline`/`virtual`/
     `hybrid`/`mixed`), `event.description`.
   - `event.geo_address_info` = dict: `mode` (often `"obfuscated"`), `city`,
     `city_state` ("Toronto, ON"), `street` (may be absent). Use
     `street + city_state` when both present, else `city_state`.
   - `ticket_info` = `{price, is_free, max_price, is_sold_out, ...}`.
   - `categories` = list of `{api_id, description, ...}`. Relevance filter:
     KEEP `cat-tech`, `cat-ai`, `cat-business`, `cat-startup`, `cat-finance`,
     `cat-fintech`, `cat-data`, `cat-entrepreneurship`, `cat-career`;
     DROP `cat-film`, `cat-running`, `cat-fitness`, `cat-music`, `cat-arts`,
     `cat-food`, `cat-sports`, `cat-wellness`, `cat-yoga`, `cat-dance`,
     `cat-comedy`, `cat-theater`, `cat-fashion`, `cat-photography`.
   - `calendar` = `{name, description_short}` — use for organizer.

The `api.lu.ma/discover/get-events` POST endpoint 404s — use the page + `event/get`.

---

## Bevy portals (vendor user groups; clean public JSON, no key)

Pattern (confirmed on Snowflake + Databricks):

1. `GET {host}/api/chapter_slim/{slug}/` → `{id, chapter_location, city, ...}`.
2. `GET {host}/api/event_slim/for_chapter/{id}/?fields=title,start_date,end_date,event_type_title,url,description_short&page_size=20`
   → `{count, results: [...]}` with ISO `start_date` (`...Z`) and
   `event_type_title` ("In-Person User Group Meeting" vs virtual).

Known chapters (Toronto):
| host | slug | chapter id |
|---|---|---|
| `https://usergroups.snowflake.com` | `toronto` | 64 |
| `https://usergroups.databricks.com` | `toronto-databricks-user-group` | 28 |

- `status=Live` filter returned `count: 0` (Snowflake); fetch without it and
  drop past events client-side.
- This is the same Bevy platform behind many vendor "User Groups" portals —
  discover others via `web_search "{vendor} Toronto user group"`.

---

## BMC events page (works, no key, but global list)

`GET https://www.bmc.com/events.html`

Events are in an inline JS array: `listItems: [ { id, name, type, month, date:
"September 29", location: [..], "location-city": "Toronto", url: "..." }, ... ]`.

- Slice the HTML at `listItems: [` **before** regexing — the same `name:`/`date:`
  keys appear in the taxonomy/filter arrays above it (countries, months), which
  otherwise parse as phantom events ("location", "Australia", ...).
- `location-city` is `""` for virtual/global events (e.g. "IDUG EMEA 2026").
  A greedy `([^"]+)` will span into the next object and steal its city — use
  `([^"]*)` and drop empty-city entries.
- URLs may be relative `/content/...` — prefix `https://www.bmc.com`.
- This is a **worldwide** list (Austin, Paris, Hamburg, São Paulo, ...), so it
  MUST use a strict region whitelist (not "unknown → keep").

---

## Career Fair Canada (works, no key)

`GET https://careerfaircanada.ca/events`

Server-rendered cards: `<div class="cfc-sheet all any_month {Month} {city}">`
with inner `cfc-card__title`, `cfc-card__text` (date), `cfc-card__caption`
(venue/time), and an Eventbrite ticket link + `/events/{city}-{date}` detail link.

- Split on `<div class="cfc-sheet\s` (trailing whitespace) to avoid matching
  `cfc-sheets` (container) and `cfc-sheet__picture`/`cfc-sheet__content`.
- National list — region-filter by the city token in the card class.
- Free (register via Eventbrite).

---

## Bot-walled / unreliable (do NOT spend time reverse-engineering)

| Source | Symptom | Alternative |
|---|---|---|
| Eventbrite (`eventbrite.com/ca` list pages) | HTTP 405 + `<title>Human Verification</title>` | vendor pages, Luma, Meetup |
| Toronto Public Library events | HTTP 403 Forbidden | — |
| GC Job Bank job-fairs page | HTTP 404 (no stable URL) | Career Fair Canada |
| DuckDuckGo HTML (`html.duckduckgo.com`) | HTTP 202 bot-challenge | agent `web_search` |
| Bing HTML (`bing.com/search`) | HTTP 200 but JS shell, no organic links | agent `web_search` |

Keyless search-engine HTML is flaky — do the long-tail supplement with the
agent's `web_search` tool instead (requires agent-mode cron, `no_agent=false`).

---

## Filter checklist (in `filter_events`)

1. `location_type == "online"` → drop.
2. region: whole-word match against whitelist (GTA) then against NON_GTA.
   `"unknown"/"see event page"` → keep **only** for city-local sources; for
   known-global sources use a strict whitelist instead.
3. past events → drop (`date_utc < now - 12h`).
4. cost > threshold → drop.
5. dedupe by URL, then by `(title.lower(), date_utc)`.
