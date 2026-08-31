# Deep-Dive: Scoring Against Full Job Descriptions

The title-based score (from `references/scoring-model.md`) is fast but only uses
title + company + location. A **second pass** fetches the *actual* job
description and re-scores against the posting's real requirements — far more
accurate, and it catches mis-titled roles and "hands-on dev" landmines that a
title alone hides.

## Fetching full descriptions (no auth needed)

### LinkedIn job-detail endpoint

```
https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{jobId}
```

- `jobId` = the trailing numeric id in the result link
  (`/jobs/view/<slug>-<jobId>`), or the `urn:li:jobPosting:<id>` value.
- Returns `HTTP 200` full page HTML. The description lives in:
  `<div class="show-more-less-html__markup …"> … </div>`
  (fallback: `<div class="description__text …">`).
- Strip all tags + collapse whitespace with `strip_tags`.

### Job Bank detail endpoint

```
https://www.jobbank.gc.ca/jobsearch/jobposting/{id}
```

- Same `<id>` as the search-result link.
- The description body is a short, terse bullet list (not prose) — it will
  under-match keyword themes. Expect this; treat Job Bank deep-scores as a
  lower bound.
- **PITFALL (important):** the detail page appends a "Similar job postings"
  sidebar, "Job market information", and "Who can apply for this job" sections
  that pollute the extracted text (e.g. a sidebar "help desk manager" link
  falsely flags an IT-director role as help-desk). Cut the text at the first
  occurrence of any of:
  - `"Similar job postings"`
  - `"Job market information"`
  - `"Who can apply for this job"`

## Two-pass scoring formula

```
deep = 0.45 * title_score + 0.55 * raw_description_fit
```

- `raw_description_fit` = (count of matched POSITIVE requirement themes) / (total
  POSITIVE themes) × 10.0 — i.e. what fraction of the candidate's skill themes
  the posting actually calls for.
- **Penalties** applied after blending:
  - `hands-on-dev` signal → −1.5  (posting expects coding / names languages)
  - `hands-on-dev` AND `dev-management` → extra −0.5
  - `help-desk` signal → −1.5
  - `below-seniority` signal → −2.0
  - `security/compliance`-dominated (≤4 other matched themes) → −0.5
- Clamp to [0, 10], round to 1 decimal. Verdicts: ≥8 Strong, ≥6.5 Good, ≥5
  Moderate, else Weak.

## Requirement-theme model

Define a dict of `theme → compiled regex`. Split into three sets:

- **POSITIVE** (what the candidate *brings* — count matches to compute coverage):
  enterprise-apps, saas-cloud, ai-automation, collab-tools,
  vendor-governance, service-mgmt, leadership, agile, data-analytics,
  strategy-roadmap.
- **NEUTRAL** (mention-only, not counted in coverage, surfaced as "Also
  mentions"): security-compliance, erp-crm.
- **NEGATIVE** (penalize): hands-on-dev, dev-management, helpdesk,
  below-seniority.

Key regex nuances learned:

- `enterprise-apps` must ALSO match Job Bank's terse wording:
  `information systems`, `it systems`, `systems and services` — otherwise
  legitimate IT-director postings under-score.
- `below-seniority` must NOT include bare `administrator` or `coordinator`
  (they appear as *tool admin* / project-context words and cause false
  "below seniority" flags). Use `entry[- ]level|junior|technician|help desk technician|deskside`.
- `hands-on-dev` = phrases like `hands-on coding`, `write code`, `full-stack`,
  `code reviews`, `ci/cd pipelines`, OR a concrete language token (`java`,
  `python`, `c++`, `c#`, `javascript`, `typescript`, `react`, `angular`,
  `node.js`, `golang`, `kotlin`, `swift`, `.net`).

## French / bilingual detection

French-language postings under-score because the English keyword themes don't
match. Detect and flag (don't auto-adjust the score — just tell the user to
verify manually):

```python
def is_french(desc):
    accented = sum(1 for c in desc if c in 'éèêëàâçùûîïôœ')
    fr_words = ['équipe','numérique','entreprise','technologie','gestionnaire',
                'responsable','directeur','directrice','nous ','vous ','votre ',
                'avec ','dans ','pour ','poste','emploi','au sein','ainsi',
                'défi','levier','croissance','recherchons','rejoindre','chef']
    hits = sum(1 for w in fr_words if w in desc.lower())
    return accented >= 3 or hits >= 3
```

**PITFALL:** a naive `des|les|sur|être|pour` list false-positives on English
postings (those substrings appear in English too). Use accented characters +
unambiguous French words (with trailing spaces / accents), not bare 2–3 letter
fragments.

## Caching

Cache each fetched description to disk keyed by source+id (e.g.
`li_<jobId>.txt`, `jb_<jobId>.txt`). Re-runs after a regex tweak can then
**delete only the cache files** and re-fetch — much faster than a full scrape.

## End-to-end script

`scripts/deep_dive.py` implements the whole pipeline (title-score → fetch top N
descriptions → analyze → write `deep_results.json`). It reads the same
intermediate JSON as `scripts/build_scored.py`, which then renders the DEEP-DIVE
section into the `.txt` and `.html` reports.
