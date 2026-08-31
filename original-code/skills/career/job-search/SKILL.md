---
name: job-search
description: Use when searching job boards to match a candidate's resume.
version: 1.0.0
author: hermes
license: MIT
metadata:
  hermes:
    tags: [job-search, linkedin, job-bank, scraping, career, recruiting]
    related_skills: []
---

# Job Search

Find job postings matching a candidate's skills, location, and seniority, from
reputable boards (LinkedIn + Government of Canada Job Bank), then produce a
curated, de-duplicated report.

## When to Use

Trigger when the user asks to find a new job, search job boards, or match roles
to a resume / to `/opt/data/SOUL.md` standing instructions. Covers LinkedIn, the
Government of Canada Job Bank, the **Adzuna** aggregator API (free tier,
personal-research licensed), **targeted-employer ATS boards**
(Greenhouse / Lever / Ashby), and **Workday** boards (banks/insurers/pensions).
The HTML-board pattern generalizes to any server-rendered job board; the JSON
API sources are cleaner and higher-value for senior tech-leadership roles.

## Workflow

1. **Read the candidate's resume and any standing instructions first.**
   The user keeps base instructions in `/opt/data/SOUL.md` and resumes in
   `/opt/data/resumes/` (`.docx` — `read_file` auto-extracts them). Identify:
   target titles, seniority (manager/director), location, remote preference,
   and any **explicit exclusions** (e.g. "not a development manager").
   Capture a compact user-profile memory entry once so future runs skip re-deriving it.

2. **Scrape sources** with `scripts/jobscrape.py` (LinkedIn + Job Bank, Toronto
   default) and `scripts/jobscrape_ca.py` (Canada-wide remote). These are
   stdlib-only Python (urllib) — no pip needed. They write intermediate JSON and
   print per-query tallies so you can verify nothing silently returned zero.

3. **Curate and format (legacy, superseded)** with `scripts/build_report.py`,
   which filters to management roles, excludes dev-manager titles, dedupes,
   buckets, and writes a `.txt`. Superseded by `build_scored.py` — do not use
   for new reports.

4. **Build the recall-filtered candidate list** with `scripts/build_candidates.py`:
   loads every scraped source, drops only high-confidence junk (empty/intern/
   IC/dev-manager), and writes the FULL deduped candidate list to
   `candidates.json` + a compact one-line-per-candidate `candidates_compact.txt`
   (~1.8k titles). This is **recall-oriented** — it must not silently drop a
   relevant title just because it lacks "manager"/"director" (e.g. "Head,
   Responsible AI", "Business Systems & Technology Lead").

5. **LLM title-triage (stage 2, NEW).** Read `candidates_compact.txt` +
   `CANDIDATE_PROFILE.md`, score every candidate's **title-level** fit, and write
   the top ~40 to `triage_indices.json` (`{index, triage_score, triage_rationale}`).
   This is the fix for regex's blind spot — an LLM can tell "Software Engineering
   Team Lead" (dev) from "Enterprise Application Support Lead" (portfolio) from
   "Brand Lead" (non-tech). See `references/llm-triage.md`.

6. **Fetch descriptions** with `scripts/deep_dive.py`: reads `candidates.json` +
   `triage_indices.json`, fetches the full description for the triage shortlist
   (fallback: regex-score top 25 if no triage file), and writes `deep_results.json`
   with a `description` field. This is the input to the LLM evaluation pass.

7. **LLM evaluation pass (PRIMARY).** Read `/opt/data/resumes/CANDIDATE_PROFILE.md`
   (candidate grounding) + `deep_results.json`, and for every fetched posting
   produce a semantic fit assessment — `llm_score` (0–10), `verdict`,
   `recommendation` (Apply/Review/Skip), `fit_summary`, `strengths`,
   `concerns`, `hands_on_dev`, `seniority` — written to
   `/opt/data/resumes/llm_results.json`. The LLM reads the actual descriptions,
   so this is semantic judgment, not keyword matching. See
   `references/llm-evaluation.md` for the schema + rubric. Run this in parallel
   batches (one subagent per ~6 roles) for speed.

8. **Build the report** with `scripts/build_scored.py`: renders
   `llm_results.json` as the top **"LLM Evaluation"** sections (manager-first,
   then director, best-score-first within each), followed by the deterministic
   DEEP-DIVE and title-score sections as secondary reference. Output is
   `job-search-YYYY-MM-DD.html` only (no `.txt`). The report opens with a
   **Contents** nav and an interactive **filter bar**: a score-range filter
   (min/max + preset buttons) plus label filters for **Fit** (Strong/Good/
   Moderate/Weak), **Rec** (Apply/Review/Skip), **Source** (LinkedIn/Job Bank/
   ATS/Workday/Other), and **Remote**. Each `<li class="job">` carries
   `data-score`, `data-verdict`, `data-recommendation`, `data-source`, and
   `data-remote` attributes consumed by a small inline `<script>` (no external JS).
   The header also shows aggregate stat pills (unique companies/positions/cities),
   and a collapsible `<details class="aggstats">` (hidden by default) breaks down
   counts by level, city, source, and top companies/positions.

9. **Optionally push to a GitHub repo** (the user may keep a `job-search-YYYY`
   repo): clone, copy the `.html`, add a short `README.md`, commit,
   push. See the GitHub pitfalls below re: fine-grained PATs.

10. **Publish to GitHub Pages (if asked).** When the user wants the HTML rendered
    in-browser, enable Pages and route the report through `docs/`. Copy the dated
    report **and** a fresh `index.html` into `docs/` so the site root always shows
    the latest report. Enabling Pages via the API requires a fine-grained PAT with
    the **"Pages"** (or "Administration") permission — a contents-only token 403s.
    Pages is unavailable on private repos for free accounts. See
   `references/github-pages-deployment.md` for the API, `/docs` mapping, and
   build-verification steps.

11. **Schedule a daily refresh (if asked).** The cron job `job-search-daily` runs
    in **agent mode** (`no_agent=false`) so the LLM passes are available daily:
    phase 1 (`scripts/jobsearch_scrape.sh` — scrape + `build_candidates.py`),
    then the agent runs the LLM title-triage (`triage_indices.json`) → `deep_dive.py`
    fetch → LLM evaluation (`llm_results.json`), then phase 2
    (`scripts/jobsearch_finalize.sh` — build + commit/push). Dated reports
    accumulate (old files are never deleted); only `.html` is saved (no `.txt`).

12. **Report back** with a short summary table of top matches and the file path(s).

## Sources & techniques

- **LinkedIn guest API (no login):**
  `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=...&location=...&start=N&f_WT=2`
  Returns HTML `<li>` cards. See `references/linkedin-guest-api.md`.
- **Government of Canada Job Bank:** plain curl + a browser `User-Agent` works
  (no JS/API key). Parse `<article>` blocks. See `references/job-bank-scraping.md`.
- **Targeted-employer ATS boards (Greenhouse / Lever / Ashby):** clean public
  JSON APIs, no bot protection — ideal for hitting specific Toronto tech
  employers directly. `scripts/jobscrape_ats.py`. Endpoints + field maps in
  `references/ats-and-workday-apis.md`.
- **Workday boards (banks/insurers/pensions):** public POST jobs endpoint +
  JSON-LD description. High-value for enterprise-technology leadership roles.
  `scripts/jobscrape_workday.py`. Tenant discovery + endpoint in
  `references/ats-and-workday-apis.md`.
- **Adzuna aggregator API (paid free tier):** `https://api.adzuna.com/v1/api/jobs/ca/search/N`
  with `app_id` + `app_key` (both required). Credentials live in
  `/opt/data/adzuna_credentials.json` (mode 600, NOT committed to git).
  `scripts/jobscrape_adzuna.py` queries 10 title×location pairs (Toronto + Canada),
  `sort_by=date` + `max_days_old=30`, `results_per_page=50`. The key differentiator
  vs the free scrapers is **salary data** (`salary_min`/`salary_max`) on ~20% of
  postings and broad aggregator reach (Deloitte/KPMG/PwC/consultancies the ATS
  boards miss). Descriptions are **truncated ~300 chars** — fine for a title-level
  signal, but weaker for the LLM pass than full-text sources. Full field map +
  auth + query set in `references/adzuna-api.md`.
- **Full job descriptions (deep-dive):** LinkedIn
  `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{jobId}` (description
  in `<div class="show-more-less-html__markup">`); Job Bank
  `https://www.jobbank.gc.ca/jobsearch/jobposting/{id}`. See
  `references/deep-dive-descriptions.md` for extraction + the two-pass scoring
  model.
- **Scoring & HTML report:** `references/scoring-model.md` documents the 0–10
  rubric and the styled-HTML output built by `scripts/build_scored.py`.
- **GitHub Pages deployment:** `references/github-pages-deployment.md` — the
  Pages API, `/docs` source mapping, fine-grained-PAT permission gotcha, and
  build-status verification.
- **Networking & career events (in-person):** meetups + Luma + Career Fair
  Canada, filtered to free/low-cost in-person+hybrid GTA tech events for the
  candidate to attend while job hunting. See `references/events-monitoring.md`
  (endpoints, Meetup-RSS date pitfall, Luma public API, bot-walled sources).
  Script: `/opt/data/events_monitor.py` → `resumes/events/events-gta-YYYY-MM-DD.{html,json}`.
- **Daily pipeline:** `scripts/jobsearch_pipeline.sh` — end-to-end scrape →
  deep-dive → build → push-to-`docs/` script, meant to run on a cron schedule.

## Pitfalls

- `web_extract` does **not** support LinkedIn (returns "Website Not Supported").
  Use `urllib.request` with a desktop `User-Agent` against the guest API instead.
- The browser tool may have no Chrome available in the environment; don't rely on
  it — curl/urllib against the HTML endpoints is faster and more reliable here.
- LinkedIn "remote" results with a `location` of US city+state are usually
  US-only hiring; drop them unless the candidate is open to US roles. Re-run a
  **Canada-wide** remote query (`location=Canada`, `f_WT=2`) for Canadian remote.
- LinkedIn result links carry long `?position=...&refId=...&trackingId=...`
  tracking params — strip the query string for a clean, stable URL.
- The Job Bank search HTML contains per-session `;jsessionid=...` tokens in
  links; strip them (canonical URL is `/jobsearch/jobposting/<id>`).
- Distinguish what the user means by "Software Manager" vs "Software Development
  Manager" — the latter is hands-on dev-team leadership and is commonly excluded.
- The Job Bank **detail page** appends "Similar job postings" / "Job market
  information" / "Who can apply" boilerplate that pollutes description text —
  cut at the first occurrence of any of those three before scoring (a sidebar
  "help desk" link otherwise false-flags an IT-director role).
- Job Bank descriptions are terse bullet lists — they under-match keyword themes.
  Treat Job Bank deep-scores as a lower bound; don't over-correct for them.
- **ATS boards include ALL managers, not just tech.** Greenhouse/Lever/Ashby
  scrape every function (sales, marketing, HR, finance, customer success).
  Filter non-tech function managers out by title before scoring — but keep
  "Technical Account Manager" / "Technical … Manager" (they carry a tech signal).
- **Lever `createdAt` is epoch MILLISECONDS** (divide by 1000, then format); it
  is not a string/seconds. Salary is in `salaryDescription`, description in
  `descriptionPlain`, location in `categories.location`.
- **Workday jobs endpoint is POST-only** — `GET …/jobs?limit=…` returns HTTP 400.
  POST `{"limit":N,"offset":M,"searchText":"","appliedFacets":{}}`. Workday job
  descriptions + salary are NOT in the list response; fetch the job page and
  parse the `application/ld+json` `<script>` block's `description` field.
- **Finding the Workday tenant is the hard part** — brute-forcing `wdN`/tenant/
  site fails (three unknowns). Find the real board URL via vanity career-domain
  redirects or a web search for `"{company} careers myworkdayjobs.com"`, then
  extract the endpoint from there. Known Canadian boards are tabulated in
  `references/ats-and-workday-apis.md`.
- **Slug guessing alone is unreliable — use a curated employer→ATS list first.**
  Guessing Greenhouse/Lever/Ashby slugs (e.g. `tophat` vs the real `top-hat`)
  misses most boards. A maintained public list of Canadian tech employers' exact
  ATS endpoints is documented in `references/ats-and-workday-apis.md` ("Discovery
  shortcut") — check it before brute-forcing.
- **Some boards resist scraping — don't burn time reverse-engineering them.**
  Indeed returns 403 bot-protection; Built In's location filter is client-side JS
  (a plain request returns US-wide jobs); Hays is a Liferay JS app; the federal
  GC Jobs portal is a JSF session app. For these, point the user at their
  saved-search **email alerts** instead (same data, zero scraping).
- **French/bilingual postings** under-score against English keyword themes.
  Detect with accented chars + unambiguous French words (NOT bare `des/les/sur`,
  which false-positive on English) and flag "verify manually" rather than
  auto-adjusting.
- GitHub push with a **fine-grained** PAT: authenticate with
  `Authorization: Bearer <token>` (NOT `Authorization: token …`, which only
  works for classic PATs). Fine-grained PATs return no `x-oauth-scopes` header —
  that's expected, not an error. If `gh` is absent, use plain `git` +
  `credential.helper store`.
- **Enabling GitHub Pages needs a token permission push-contents lacks.** A
  fine-grained PAT scoped to repo *contents* can push files but returns **403
  "Resource not accessible by personal access token"** on
  `POST /repos/{owner}/{repo}/pages`. The user must add **Pages → Read and write**
  (or **Administration → Read and write**) to the token. The token value is
  unchanged, so existing auth keeps working.
- **Pages on a private repo requires a paid plan** (Pro/Team/Enterprise); free
  accounts can only use Pages on public repos. This is a user billing/visibility
  decision — ask rather than assume.
- **GitHub Pages is ALWAYS public — there is no private mode.** Even with a paid
  plan, the published site is publicly reachable, and removing `index.html` does
  NOT hide anything: other files (`job-search-YYYY-MM-DD.html`) remain
  directly downloadable by URL. There's no directory listing, but that's not
  protection — "random filename" is only security-through-obscurity. For reports
  containing PII (name, phone, email, LinkedIn, job-search activity), surface
  this and let the user choose: (a) turn Pages off and keep the repo private
  (safest), (b) publish an anonymized copy, (c) login-gate with Cloudflare Access
  (free), or (d) accept obscurity. This session's user chose (a) — they are
  privacy-sensitive about exposing PII on a public site.
- **A stale "errored" Pages build is not a failure of the latest push.** When the
  source path is `/docs` but an earlier commit had files at repo root, that old
  build shows `errored`. Push the report into `docs/` and verify the LATEST
  commit's build reaches `built` via `GET .../pages/builds`, then confirm the
  live URL returns HTTP 200 with the report `<title>`.
- Writes are confined to `/opt/data` (HERMES_WRITE_SAFE_ROOT); write scripts and
  outputs under `/opt/data`, not `/tmp`. (`cp` into a cloned repo under `/tmp`
  works, but `write_file` there is denied.)
- **Adzuna needs BOTH `app_id` and `app_key`.** The 32-char hex the user pastes
  is the `app_key`; the short alphanumeric `app_id` is a separate field on the
  developer dashboard. Passing the key as `app_id` too returns `AUTH_FAIL`.
  Credentials are stored in `/opt/data/adzuna_credentials.json` (mode 600) — keep
  them OUT of git; the script reads them from that file, never hardcodes them.
- **Adzuna free tier = 1,000 calls/month**, ~1 req/sec. The scraper uses 10 queries
  × ≤2 pages ≈ 14-20 calls/run — fine for daily, but don't add many more queries
  without checking the monthly budget. Descriptions are truncated (~300 chars), so
  Adzuna deep-scores are a lower bound like Job Bank.
- **Two copies of every script exist — edit BOTH when changing behaviour.** The
  LIVE pipeline the daily cron `job-search-daily` runs is the **agent prompt**
  (not a single shell script): it invokes `scripts/jobsearch_scrape.sh` (scrape +
  `build_candidates.py`), then the agent does triage + `deep_dive.py` + LLM eval,
  then `scripts/jobsearch_finalize.sh` (build + push). All scrapers/builders are
  the LIVE copies at the `/opt/data` **root** — `jobscrape*.py`, `build_candidates.py`,
  `deep_dive.py`, `build_scored.py`. The copies under
  `skills/career/job-search/scripts/` are reference copies only. To change the
  daily run, edit the `/opt/data` root + `/opt/data/scripts/` copies FIRST, then
  mirror the same change into the skill `scripts/` copies (and SKILL.md) so the
  two stay in sync. Editing only the skill copies changes nothing at runtime.
- **Cron `script` param must be a bare filename relative to `~/.hermes/scripts/`.**
  Absolute paths are rejected ("Script path must be relative to ~/.hermes/scripts/").
  `HERMES_HOME=/opt/data`, so that dir is `/opt/data/scripts/`. For a deterministic
  scraper use `no_agent=true` — stdout is delivered verbatim, and EMPTY stdout
  sends nothing, so keep the script printing a summary line even on a no-op run.