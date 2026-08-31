# Setup Guide — Job Search 2026

This guide covers how to run and deploy the project on Netlify.

---

## Prerequisites

- [Node.js 22+](https://nodejs.org/)
- A [Netlify account](https://app.netlify.com/)
- A PostgreSQL database and connection string (store as `NETLIFY_DATABASE_URL`)
- An OpenAI API key

---

## 1. Create the database schema

Run the SQL in `migrations/0001_initial.sql` against your PostgreSQL database.

Examples:

```bash
# psql example
psql "$NETLIFY_DATABASE_URL" -f migrations/0001_initial.sql
```

---

## 2. Configure Netlify environment variables

In Netlify site settings, add:

| Variable | Description |
|---|---|
| `NETLIFY_DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key for LLM scoring |
| `OPENAI_MODEL` *(optional)* | Defaults to `gpt-4o-mini` |
| `OPENAI_BASE_URL` *(optional)* | Defaults to `https://api.openai.com/v1` |
| `DEEP_DIVE_N` *(optional)* | Defaults to `40` |

---

## 3. Configure GitHub Actions secrets

In GitHub (`Settings > Secrets and variables > Actions`), add:

| Secret | Description |
|---|---|
| `NETLIFY_AUTH_TOKEN` | Netlify personal access token |
| `NETLIFY_SITE_ID` | Netlify site ID |
| `NETLIFY_DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `ADZUNA_APP_ID` *(optional)* | Adzuna API credentials |
| `ADZUNA_APP_KEY` *(optional)* | Adzuna API credentials |

Optional GitHub Actions variables:

| Variable | Default | Description |
|---|---|---|
| `OPENAI_MODEL` | `gpt-4o-mini` | LLM model to use |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible endpoint |
| `DEEP_DIVE_N` | `40` | Number of jobs to fetch descriptions + score |

---

## 4. Deploy to Netlify

### Option A: Automatic deploy on push (recommended)

Push to `main` — `deploy.yml` builds and deploys to Netlify.

### Option B: Deploy from Netlify UI

1. Connect this repository to a Netlify site
2. Build command: `npm run build`
3. Publish directory: `.output/public`
4. Add env vars from step 2

---

## 5. Run the pipeline manually

```bash
export NETLIFY_DATABASE_URL=postgres://...
export OPENAI_API_KEY=sk-...

node --experimental-vm-modules pipeline/run-pipeline.js
```

Or trigger via GitHub Actions: **Actions → Job Search Pipeline → Run workflow**

---

## 6. Local development

```bash
npm install
npm run dev
```

Set `NETLIFY_DATABASE_URL` locally before calling APIs that query the database.

---

## Schedule

| Workflow | Schedule | What it does |
|---|---|---|
| `job-scrape.yml` | Daily 10:00 UTC | Full scrape → score → write to PostgreSQL |
| `events-monitor.yml` | Monday 07:00 UTC | Scrape GTA networking events |
| `deploy.yml` | On push to `main` | Build + deploy to Netlify |
