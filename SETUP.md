# Setup Guide — Job Search 2026

This guide covers how to stand up the full Cloudflare stack from scratch.

---

## Prerequisites

- [Node.js 22+](https://nodejs.org/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/): `npm install -g wrangler`
- A [Cloudflare account](https://dash.cloudflare.com/) (free tier is sufficient)
- An OpenAI API key (or Cloudflare AI — see below)

---

## 1. Create the D1 database

```bash
wrangler login
wrangler d1 create job-search-2026
```

Copy the `database_id` from the output and paste it into `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "job-search-2026"
database_id = "PASTE_YOUR_ID_HERE"
```

Run the schema migration:

```bash
wrangler d1 execute job-search-2026 --file migrations/0001_initial.sql
```

---

## 2. Configure secrets

Set the required secrets in your Cloudflare Workers/Pages project **and** in your GitHub repository:

### GitHub Actions secrets (`Settings > Secrets and variables > Actions`):

| Secret | Description |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with D1 write + Pages deploy permissions |
| `CLOUDFLARE_D1_DATABASE_ID` | The D1 database ID from step 1 |
| `OPENAI_API_KEY` | OpenAI API key for LLM scoring |
| `ADZUNA_APP_ID` *(optional)* | Adzuna API credentials |
| `ADZUNA_APP_KEY` *(optional)* | Adzuna API credentials |

### GitHub Actions variables (optional overrides):

| Variable | Default | Description |
|---|---|---|
| `OPENAI_MODEL` | `gpt-4o-mini` | LLM model to use |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | Change to use Cloudflare AI or other compatible API |
| `DEEP_DIVE_N` | `40` | Number of jobs to fetch descriptions + score |

### Using Cloudflare Workers AI instead of OpenAI (free):

Set in GitHub Actions variables:
```
OPENAI_BASE_URL = https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/v1
OPENAI_MODEL    = @cf/meta/llama-3.1-8b-instruct
OPENAI_API_KEY  = YOUR_CLOUDFLARE_API_TOKEN
```

---

## 3. Deploy to Cloudflare Pages

### Option A: Automatic deploy on push (recommended)

Connect your GitHub repository to Cloudflare Pages:

1. Go to Cloudflare Dashboard → **Workers & Pages** → **Create**
2. Select **Pages** → connect your GitHub repo
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables: bind your D1 database as `DB`

### Option B: Manual deploy via GitHub Actions

Push to `main` — the `deploy.yml` workflow runs automatically.

### Option C: Local deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=job-search-2026
```

---

## 4. Run the pipeline manually

```bash
# Set environment variables
export OPENAI_API_KEY=sk-...
export CLOUDFLARE_ACCOUNT_ID=...
export CLOUDFLARE_D1_DATABASE_ID=...
export CLOUDFLARE_API_TOKEN=...

# Run
node pipeline/run-pipeline.js
```

Or trigger via GitHub Actions: **Actions → Job Search Pipeline → Run workflow**

---

## 5. Local development

```bash
npm install

# Start local dev server (connects to remote D1 or local sqlite via wrangler)
npm run dev
```

The dev server uses `nitro-cloudflare-dev` which injects the Cloudflare bindings locally via wrangler. You need a D1 database configured in `wrangler.toml`.

---

## Schedule

| Workflow | Schedule | What it does |
|---|---|---|
| `job-scrape.yml` | Daily 10:00 UTC | Full scrape → score → write to D1 |
| `events-monitor.yml` | Monday 07:00 UTC | Scrape GTA networking events |
| `deploy.yml` | On push to `main` | Build + deploy to Cloudflare Pages |
