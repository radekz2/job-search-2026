# Government of Canada Job Bank — HTML scraping

The Job Bank search page is server-rendered and needs no API key or JavaScript.

## Endpoint

```
https://www.jobbank.gc.ca/jobsearch/jobsearch?searchstring=<keywords>&locationstring=<Location, ON>
```

`locationstring` takes e.g. `Toronto, ON`. Send a desktop `User-Agent` via curl or
urllib; the page returns `HTTP 200` with full HTML.

## Response format

Results are `<article class="action-buttons">` blocks (one per job). Fields inside
each block (regex against the article body):

| field      | selector / pattern                                          |
|------------|-------------------------------------------------------------|
| job link   | `href="/jobsearch/jobposting/<id>;jsessionid=…"` — the `<id>` is the job number |
| title      | `<span class="noctitle"> … </span>`                         |
| company    | `<li class="business"> … </li>`                             |
| location   | `<li class="location"> … </li>`                             |
| salary     | `<li class="salary"> … </li>`                               |
| posted     | `<li class="date"> … </li>`                                 |
| work model | `<span class="telework">On site / Hybrid / Remote</span>`    |

## Parsing notes

- Canonical job URL is `https://www.jobbank.gc.ca/jobsearch/jobposting/<id>`
  (strip the `;jsessionid=…` suffix).
- `location`, `salary` fields contain nested `<span>`/icons — strip all tags and
  remove leading labels ("Location", "Salary").
- A given keyword returns few results (e.g. 2–11); iterate several keyword
  variants and dedupe by `(title.lower(), company.lower())`.
- Job Bank also exposes a JSON API at `api.jobbank.gc.ca` but it requires a key /
  session; the HTML endpoint above is the reliable no-auth path.
