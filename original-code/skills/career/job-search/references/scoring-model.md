# 0–10 Skill-Match Scoring Rubric (SECONDARY pre-filter)

> **This deterministic scoring is now a secondary pre-filter.** It decides *which*
> ~25 roles get their full descriptions fetched and handed to the **LLM
> evaluation pass** (the primary ranking). See `references/llm-evaluation.md`.
> The formula below is unchanged and still runs in `build_scored.py` /
> `deep_dive.py`, but the report presents the LLM scores first.

`scripts/build_scored.py` ranks every surviving posting 0–10 against the
candidate's **aggregate** profile. Read ALL resumes in `/opt/data/resumes/`
(not just the "latest") — different resumes emphasize different facets
(e.g. enterprise-tools vs. dev/architecture history) and the union is the
truest signal.

## Formula

```
Score = Seniority (0–3) + Domain fit (0.5–3) + Location (0–2) + Differentiators (0–2)
        − 1.0 dev-lean penalty (if Software-Engineering / Engineering Manager/Director)
```

Clamped to `[0, 10]`, rounded to 0.1.

| Component | Range | Rule |
|-----------|-------|------|
| Seniority | 0–3 | Director/VP/Head/CTO/CIO = 3.0; Manager = 2.5; −0.5 for a narrow/specialist function (SAP, Oracle, Workday, help desk, etc.) |
| Domain fit | 0.5–3 | Start 1.5. +0.5 each for IT/technology, enterprise apps, SaaS/cloud, AI/automation, collaboration tools, vendor/governance, service mgmt; +0.25 for data, platform. −0.5 security-only, −0.5 ERP-config, −1.0 help desk. Cap `dom` at 1.5 for dev-lean titles. |
| Location | 0–2 | Toronto 2.0 > GTA 1.6 > Canada-remote 1.5 > other Canada 1.0 (on-site). |
| Differentiators | 0–2 | +1.0 if AI/automation/transformation in title; +1.0 if enterprise/portfolio/global/strategy/platform/products. |

## Dev-lean penalty (the key non-obvious rule)

The user's standing instruction is "not a development manager." Titles like
`Manager, Software Engineering`, `Engineering Manager`, `Director of Engineering`
still *sound* senior but usually mean hands-on dev-team leadership. The model:
- caps their domain score at 1.5, **and**
- subtracts a flat −1.0.

This pushes them below the IT/enterprise-leadership roles the user actually
wants, and the script buckets them into a separate "review fit" section rather
than dropping them outright (they may still be worth a look).

## Output

- Both `job-search-YYYY-MM-DD.txt` and a styled `job-search-YYYY-MM-DD.html`.
- Four sections (IT/enterprise × {Director, Manager}, then Software/Eng ×
  {Director, Manager}), each sorted best-score-first.
- Every role carries a one-line **"Why"** rationale: matched strengths +
  caveats (e.g. `matches: enterprise applications; caveats: leans hands-on dev`).
- HTML uses color-coded score pills (high/good/mid/low) + Remote/Hybrid/Salary/
  Posted/Source badges; self-contained inline CSS, opens in any browser offline.

## Honest limitation

Scores are derived from **title + company + location metadata**, not the full
job description. They are a reproducible first-pass ranking, not a substitute
for reading a posting. For high-value candidates, offer to fetch the top ~15–20
full descriptions and re-score against actual requirements.

## Tuning

The domain regexes/weights in `build_scored.py` encode a *technology-leadership*
candidate (IT, enterprise apps, SaaS, AI, governance). For a different profile
(e.g. pure engineering, data science, security), re-weight the domain bonuses
and the dev-lean penalty accordingly.
