---
name: professional-events-monitor
description: Use when finding free in-person networking/career events.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [events, networking, meetup, luma, bevy, career-fair, scraping, toronto]
    related_skills: [job-search]
---

# Professional Events Monitor

Find upcoming **in-person / hybrid** networking, meetup, vendor-promo, and career
events in a city — filtered to free / low-cost and relevant to a technology
leader's job search — and emit a dated HTML+JSON report. Distinct from the
`job-search` skill, which scrapes job *postings*; this discovers *events* to
attend in person.

## When to use

Trigger on "monitor networking events", "find tech meetups near me", "track
vendor/career events in <city>", "free in-person events for my job search", or
similar. The reference implementation (`/opt/data/events_monitor.py`) targets
the GTA / Toronto, but the source list and filter pattern generalize to any city.

## Workflow

1. **Establish the target city + filters.** In-person/hybrid only, a city/region
   whitelist (for the GTA that's Toronto + surrounding municipalities), free or
   ≤ ~$30, and relevance to the person (tech/leadership/AI/data/cloud/security/
   product/networking for a technology leader). Capture these as lists in the
   script — see `references/event-sources.md`.

2. **Scrape deterministic sources** (all keyless, stdlib-only `urllib` +
   `xml.etree`):
   - **Meetup RSS** — curated group slugs, incl. vendor user groups
     (`/events/rss/`, needs only a desktop User-Agent).
   - **Luma** — discover page → featured event IDs → `event/get` JSON.
   - **Vendor "Bevy" portals** (Snowflake, Databricks) — clean public JSON API.
   - **Vendor events pages** (BMC) — inline JS `listItems` array.
   - **Career Fair Canada** — server-rendered `cfc-sheet` cards.
   Full endpoint details + exact field names are in `references/event-sources.md`.

3. **Supplement with web_search** (for vendor promo / long-tail events the
   scrapers miss): run a handful of targeted queries (`site:lu.ma <city>`,
   `"<city>" lunch and learn enterprise software`, vendor user-group queries).
   Write found events to a `search_supplement.json` and merge it in. This step
   needs the agent's `web_search` tool — see the cron note below.

4. **Filter + dedupe** — in-person/hybrid only; whole-word region match; cost ≤
   threshold; drop past events; dedupe by URL **and** by (title, date) to catch
   cross-posted events.

5. **Render + archive** a dated HTML report (grouped by day) + JSON dump. Never
   delete old dated files. Optionally auto-push to a git repo via a finalize
   script.

## Pitfalls (learned the hard way)

- **Meetup RSS `pubDate` is the POST date, not the event date.** The feed has no
  structured event datetime — regex the event date out of the title/description
  (month-name patterns), and pin it to noon UTC so day-grouping in the local
  timezone stays on the right calendar day. A dated event like "September 14"
  naively parsed as UTC midnight will display a day early in EDT.
- **City-name substring collisions.** `"york"` matches `"new york"`. Always
  whole-word match (`\b...\b`) region names, and drop ambiguous bare entries.
- **A `cfc-sheet` split also matches `cfc-sheets` (container) and
  `cfc-sheet__picture` / `cfc-sheet__content` (sub-divs)** — require a trailing
  whitespace in the split regex, or you'll parse phantom cards.
- **Global event sources need a strict whitelist, not "unknown → keep".** BMC
  lists worldwide events; foreign cities (Austin, Paris, São Paulo) slipped
  through the default "no signal → keep" rule. For a known-global source, drop
  anything whose city isn't in the region whitelist.
- **Empty `location-city` breaks greedy regex.** A global/virtual event with an
  empty city field made `([^"]+)` span into the *next* object and steal its
  city. Allow the empty match and treat empty city as virtual/global → drop.
- **Luma discover only embeds ~9 *featured* event IDs** in `__NEXT_DATA__`.
  The full list is client-side; use `site:lu.ma <city>` search for the long tail.
- **Keyless Bing/DuckDuckGo HTML is unreliable** (Bing returns a JS shell with no
  organic links; DDG returns a 202 bot-challenge). Don't scrape them — use the
  agent's `web_search` tool for the supplement step.
- **Bot-walled sources (don't burn time):** Eventbrite (405 "Human Verification"),
  Toronto Public Library (403), GC Job Bank job-fairs page (404), keyless search
  engines. Documented in `references/event-sources.md`.

## Automation (cron)

- The monitor script is deterministic, so it can run `no_agent=true` — BUT the
  `web_search` supplement needs an agent, so run the weekly job in **agent mode**
  (`no_agent=false`) with a self-contained prompt: scrape → search queries →
  write supplement JSON → re-scrape (merge) → finalize (commit+push).
- Cron `script` files must live in `~/.hermes/scripts/` (here `/opt/data/scripts/`)
  and be referenced by **bare filename**, not absolute path.
- A separate `finalize.sh` copies the latest dated report into the git repo and
  pushes (mirrors the job-search auto-push pattern).

## Verification

Run the script directly first (`python3 events_monitor.py`) and eyeball the
console summary: counts (kept/dropped/raw), source errors, and the first ~10
titles. Then inspect the JSON for a specific source (e.g. grep for
`"source": "Vendor"`) to confirm foreign/irrelevant events were dropped and
nothing leaked through the filters.
