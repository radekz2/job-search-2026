# Adzuna Job API

Aggregator API. Free tier = **1,000 calls/month**, ~1 req/sec. The only paid
source in the pipeline that is explicitly licensed for **personal research**
(most job APIs target job boards / B2B prospecting and forbid personal use).

## Auth (BOTH parts required)

```
app_id   = short alphanumeric (e.g. "ca4d3b4e")
app_key  = 32-char hex
```

- The developer dashboard shows both side by side under "My API access".
- Passing the key as `app_id` too → `{"exception":"AUTH_FAIL"}`.
- Credentials live in `/opt/data/adzuna_credentials.json` (mode 600, NOT in git).

## Search endpoint

```
GET https://api.adzuna.com/v1/api/jobs/{country}/search/{page}
    ?app_id=...&app_key=...&what=...&where=...&results_per_page=50
    &sort_by=date&max_days_old=30&content-type=application/json
```

- `country` = `ca` for Canada (the candidate is Toronto-based).
- `results_per_page=50` works (default 10).
- `sort_by=date` + `max_days_old=30` cut stale postings and sort newest-first.
  **Use both** — without them results are relevance-ranked and unbounded by age.
- `title_only=1` is too restrictive for discovery (few titles carry "manager"
  literally); use full-text `what` + downstream title filtering instead.

## Response shape

Top level: `{ "count": N, "mean": ..., "results": [...] }`.
`count` is the TOTAL matches; a page returns up to `results_per_page`.

Per `results[]`:
```json
{
  "id": "5830794373",
  "title": "Senior Manager, Talent Management",
  "redirect_url": "https://www.adzuna.ca/details/{id}?utm_medium=api&utm_source={app_id}",
  "created": "2026-08-06T13:16:08Z",
  "description": "~300-char TRUNCATED snippet",
  "salary_min": 115000, "salary_max": 140000,
  "salary_is_predicted": "0",
  "contract_time": "full_time",
  "latitude": 43.65, "longitude": -79.37,
  "location": { "display_name": "Toronto, Ontario", "area": ["Canada","Ontario","Toronto"] },
  "company": { "display_name": "Aviso Wealth" },
  "category": { "label": "Accounting & Finance Jobs", "tag": "..." }
}
```

Field-map notes used by `scripts/jobscrape_adzuna.py`:
- `redirect_url` is the canonical apply link (keep the `utm_*` params — they
  attribute traffic to the free key).
- `salary_min`/`salary_max` → format as `$min - $max`; present on **~20%** of
  postings (the differentiator vs the free scrapers, which rarely have salary).
- `location.area` is a `[country, province, city, ...]` list. A single-element
  area (country only) + no city → treat as Canada-wide / likely remote.
- `description` is a **~300-char truncated snippet**, NOT the full posting. It is
  fine for a title-level signal but weakens the LLM evaluation pass — treat
  Adzuna deep-scores as a lower bound (same caveat as Job Bank).

## Query set (10 title×location pairs)

Toronto: `technology director`, `technology manager`, `IT director`,
`IT manager`, `director enterprise applications`, `enterprise software manager`,
`director information technology`, `manager enterprise applications`.
Canada-wide: `technology director`, `IT manager`.

~14-20 API calls per run — well under the monthly budget even daily.
