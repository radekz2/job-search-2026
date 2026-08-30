# Job Search 2026

Automated technology job search for **Radek Zajkowski** (Toronto, ON, Canada).

Target: **Technology Manager / Director** roles — Software Manager, IT Manager,
Director of Technology / Enterprise Applications. Excludes hands-on development-manager roles.

## Files (in `docs/`)

- [`docs/index.html`](docs/index.html) — styled HTML report
- [`docs/job-search-2026-08-30.html`](docs/job-search-2026-08-30.html) — dated HTML snapshot
- [`docs/job-search-2026-08-30.txt`](docs/job-search-2026-08-30.txt) — plain-text version

## Sources

| Source | Method |
|---|---|
| **LinkedIn** | public guest jobs API |
| **Government of Canada Job Bank** | public HTML search |
| **Targeted employers** | Greenhouse / Lever / Ashby public JSON boards |

Targeted-employer boards (16 Toronto / tech employers):
1Password, Achievers, BenchSci, Cohere, Float, Geotab, Koho, Lightspeed, Loopio,
Mozilla, PagerDuty, PointClickCare, Ritual, Tulip Retail, Wattpad, Wave.

## Report contents

- **Curated roles** scored 0–10 against the aggregate resume profile
- Scope: Toronto / Greater Toronto Area (on-site & hybrid) + Canada remote
- **Two-pass scoring**:
  1. **Title-score** — every role ranked from title + company + location
  2. **Deep-score** — top matches re-scored against their full job descriptions
- Sub-8.0 matches are collapsed behind an expandable section in the HTML
- Filters: excludes dev-manager titles, individual contributors, and non-tech
  function managers (sales / marketing / HR / finance / customer success)

### Score scale

| Score | Verdict |
|-------|---------|
| 8.0+  | Strong  |
| 6.5–7.9 | Good  |
| 5.0–6.4 | Moderate |
| <5.0  | Weak    |

## Automation

A scheduled job regenerates this report daily at **6:00 AM EDT (10:00 UTC)** and
pushes the result to this repo.

*Generated automatically by Hermes Agent (Nous Research).*
