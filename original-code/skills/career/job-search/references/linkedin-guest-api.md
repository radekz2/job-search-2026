# LinkedIn Public Guest Jobs API

LinkedIn exposes an unauthenticated HTML endpoint for job search results. No
login, no API key, no scraping of the logged-in site required.

## Endpoint

```
https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search
```

Query params:

| param      | meaning                                             |
|------------|-----------------------------------------------------|
| `keywords` | search phrase (URL-encoded)                          |
| `location` | e.g. `Toronto, Ontario, Canada` or `Canada`          |
| `start`    | pagination offset (0, 10, 20, ...; ~10 cards/page)   |
| `f_WT=2`   | work-type filter = Remote                            |

Send a desktop `User-Agent` header (e.g. Chrome) or LinkedIn returns a bare/empty
page. `urllib.request` with `User-Agent` + `Accept-Language: en-US` works fine.

## Response format

Returns an HTML fragment: a `<ul>` of `<li>` cards (roughly 10 per page). Each
card contains:

- Title: `<span class="sr-only"> … </span>` (screen-reader title; cleanest field)
- Company: `<h4 class="base-search-card__subtitle"><a …> Company </a></h4>`
- Location: `<span class="job-search-card__location"> … </span>`
- Job link: `href="https://…/jobs/view/<slug>-<jobId>?…"` — a `data-entity-urn`
  attribute also holds `urn:li:jobPosting:<id>`.

## Parsing notes

- Split cards with regex `r'<li>(.*?)</li>'` (DOTALL). Skip cards with no title.
- Clean the raw `job-search-card__location` with `strip_tags` — it may contain
  nested spans.
- Strip the trailing `?position=…&refId=…&trackingId=…` from result links to get
  a stable canonical URL.
- `remote=True` via `f_WT=2` returns jobs tagged Remote. **Watch location**:
  US-located remote jobs (e.g. "San Mateo, CA") are typically US-only hiring.
  For Canadian remote, query with `location=Canada` + `f_WT=2`.

## Gotcha

`web_extract` and `web_search` cannot render this endpoint meaningfully
(`web_extract` returns "Website Not Supported" for linkedin.com). Always fetch it
directly with urllib/curl.
