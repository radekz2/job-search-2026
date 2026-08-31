# LLM Title-Triage Pass (Stage 2)

Between the deterministic recall filter and the deep-dive fetch, an LLM reads
**every candidate title** and shortlists the ~40 most relevant for full
description fetching. This fixes the fundamental regex weakness: job titles are
lossy and unpredictable, and no keyword list catches every relevant title
("Head, Responsible AI", "Business Systems & Technology Lead", "Enterprise
Application Support Lead") while rejecting dev-lean false positives ("Software
Engineering Team Lead") and non-tech leads ("Brand Lead — Marketing").

## Why this stage exists

- The deterministic regex filter (`build_candidates.py`) is **recall-oriented** —
  it deliberately keeps anything that *might* be leadership + technology, so it
  never silently drops a relevant title.
- Reading full descriptions is expensive (one rate-limited network call per
  role). So the LLM triages **titles only** (cheap, ~2k tokens total) to pick
  the ~40 worth fetching.

## Inputs / outputs

- **Input:** `/opt/data/resumes/candidates_compact.txt` — one tab-delimited line
  per candidate: `index\tTitle\tCompany\tSource\tLocation|Remote|Salary\tLink`.
  (`candidates.json` holds the full records keyed by the same index order.)
- **Output:** `/opt/data/resumes/triage_indices.json` — array of top-40 objects
  (sorted best-first):

```json
[
  {"index": 12, "triage_score": 8.5, "triage_rationale": "Enterprise-apps portfolio leadership; Toronto."},
  {"index": 345, "triage_score": 8.0, "triage_rationale": "Head of AI governance — strong fit."}
]
```

The `index` MUST match the line number in `candidates_compact.txt` (0-based
order = `candidates.json` array order). Do NOT invent links or titles — only
emit indices; `deep_dive.py` resolves them to full records.

## Triage rubric (title-level only)

Score **0–10** = how likely this role is a strong fit for Radek, judging the
**title + company + location + remote + salary** only (no description yet).

- **Strong (>=8.0):** enterprise applications / business-systems / IT /
  technology leadership; SaaS/cloud/transformation; AI governance/enablement;
  data platform; vendor/procurement; service management; GTA or remote.
- **Medium (5.0–7.9):** adjacent (digital strategy, enterprise architecture as
  a *practice lead*, HRIS/HR-technology systems, M&A tech integration) or a
  location/domain caveat.
- **Weak (<5.0):** dev-team delivery ("Software Engineering Lead", "Tech Lead",
  "Development Lead"), individual contributor (analyst / engineer / architect
  as IC / consultant), or non-technology function (sales, marketing, HR, finance,
  customer success, supply chain, banking coverage) with no tech mandate.
- **VP/C-level:** `Vice President`, `SVP`, `EVP`, `Chief …`, `C-level` → score
  low and mark for exclusion in the eval stage; do not spend a fetch slot on a
  pure VP/C title unless it is clearly a Director-band role in disguise.

Emit the **top 40** by `triage_score` (ties: prefer Toronto/GTA/remote, then
manager-before-director). Include a 1-line `triage_rationale` for each.

## Deterministic resolution

`deep_dive.py` maps each `index` → full candidate record and fetches its
description. No triage file → it falls back to the regex-score top 25.
