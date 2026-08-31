# Job Search 2026

Automated technology job search for **Radek Zajkowski** (Toronto, ON, Canada).

Target: **Technology Manager / Director** roles — Software Manager, IT Manager,
Director of Technology / Enterprise Applications. Excludes hands-on development-manager roles.

## Architecture

| Layer | Technology |
|---|---|
| Frontend + API | **Nuxt 3** (SSR, Nuxt UI components) |
| Database | **PostgreSQL** (Netlify-managed connection) |
| Hosting | **Netlify** |
| Background pipeline | **GitHub Actions** (Node.js) |
| LLM scoring | **OpenAI GPT-4o-mini** |

See [`SETUP.md`](SETUP.md) for deployment instructions.

## Application

- **`/`** — Jobs board: filter by source, bucket, level, remote, score range, recommendation. Click any row to open a detail drawer with full description and LLM rationale. Star jobs to save them.
- **`/shortlist`** — Saved jobs with status tracking (Saved → Applied → Interviewing → Rejected / Offer), notes per job, and CSV export.

## Pipeline

The `pipeline/` directory contains Node.js scripts that run daily via GitHub Actions:

1. **Scrape** — LinkedIn, Government of Canada Job Bank, Greenhouse/Lever/Ashby ATS boards, Workday boards (TD, BMO, CIBC, Manulife, Sun Life, OMERS, CPP, OTPP, Clio), Adzuna, BuiltIn Toronto, RemoteOK
2. **Filter** — Deduplication + candidate filter (keeps management/leadership roles, drops IC, dev-manager, intern titles)
3. **Deep-dive** — Fetch full job descriptions for top-N candidates
4. **LLM scoring** — GPT-4o-mini scores each job 0–10 against the candidate profile with recommendation, strengths, and concerns
5. **Write to database** — Upsert all records into PostgreSQL

### Workday boards

TD Bank, BMO, CIBC, Manulife, Sun Life, OMERS, CPP Investments, OTPP (Ontario Teachers'), Clio

### Greenhouse / Lever / Ashby boards

1Password, Achievers, BenchSci, Cohere, Float, Geotab, Jobber, Koho, Lightspeed, Loopio,
Mozilla, Nylas, PagerDuty, PointClickCare, Ritual, Top Hat, Tulip Retail, Wattpad, Wave, Wealthsimple

## Score scale

| Score | Verdict |
|-------|---------|
| 8.0+  | Strong — Apply |
| 6.5–7.9 | Good — Review |
| 5.0–6.4 | Moderate |
| <5.0  | Weak — Skip |

## Schedule

| Workflow | When | Action |
|---|---|---|
| `job-scrape.yml` | Daily 10:00 UTC | Full scrape → score → write |
| `events-monitor.yml` | Monday 07:00 UTC | GTA networking events |
| `deploy.yml` | Push to `main` | Build + deploy to Netlify |

## Development

```bash
npm install
npm run dev
npm run build
```

*Generated automatically. See [`original-code/`](original-code/) for the original Python/Hermes agent implementation.*
