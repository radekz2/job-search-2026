# Improved Keyword Set (LLM-regenerated, 2026-08-30)

One LLM pass over `CANDIDATE_PROFILE.md` + the real scraped title vocabulary
produced this keyword set. It supersedes the original patterns. It is **not**
the primary filter (the LLM title-triage is) — it serves two roles:

1. **Recall funnel** in `build_candidates.py` — broad, never drops a relevant title.
2. **Precision + rationale** in `build_scored.py` — deterministic report sections
   and the "strengths/caveats" labels.

## 1. Leadership capture

Two tiers on purpose:

**Recall (`build_candidates.py` LEAD)** — deliberately broad; the triage re-judges:
```
manager, managing director, director, head, head of, vp, vice[- ]president,
svp, evp, avp, chief, cto, cio, ciso, lead, owner, principal, supervisor,
superintendent, responsable, directeur, directrice, gestionnaire, chef
```

**Precision (`build_scored.py` MGMT)** — report sections only; omits ambiguous
`owner`/`principal` (usually IC):
```
manager, director, head, head of, vp, vice[- ]president, avp, svp, evp,
chief, cto, cio, lead, supervisor, responsable, directeur, directrice,
chef d'équipe, gestionnaire
```

## 2. Hard exclusions (both files)

- **Below seniority:** intern, internship, co-op/coop, student, new grad,
  graduate program, early career/talent, trainee, apprentice, summer student/intern
- **Hands-on dev-team delivery (the #1 exclusion):** software development
  manager, development manager, team lead, tech lead, technical lead, software
  development director, director of software development, application
  development director, engineering team lead, software engineering lead,
  software team lead, software development
- **Individual contributor junk (cheap drop):** teller, banker, advisor/adviser,
  representative, specialist, agent, assistant, clerk, technician, coordinator,
  attendant, cashier, receptionist
- **Non-technology function (build_scored):** sales, account executive/manager,
  business development, revenue operations/growth, marketing, brand,
  communications, content, creative, social media, human resources, HR, people
  operations, recruiting, talent acquisition, customer success/operations,
  client success/services, customer experience, finance, accounting, payroll,
  treasury, financial planning, legal, counsel, public policy, government
  affairs, regulatory, supply chain, logistics, warehouse, purchasing, store
  operations, retail operations, field operations

## 3. Positive fit themes (raise score + rationale labels)

| Theme | New/expanded patterns |
|---|---|
| enterprise-apps | enterprise, business systems/applications, application(s), portfolio, corporate systems, information systems |
| saas-cloud | saas, software as a service, cloud, aws, azure, migration, modernization, technical debt |
| ai-automation | ai, a.i., agentic, llm, large language model, generative, machine learning, automation, copilot, responsible ai, digital transformation, transformation, innovation, ml |
| collab-tools | collaboration, productivity, atlassian, jira, confluence, microsoft 365, office 365, m365, 365 |
| vendor-governance | vendor, procurement, rfp, governance, licensing, compliance, budget, contract(s), negotiation |
| service-mgmt | service management, it service management, itil, service delivery, sla, itsm, it operations/ops, techops, operations |
| data-analytics | data, data platform/engineering/governance, analytics, power bi, fabric, business intelligence, reporting, dashboard |
| platform | platform, developer platform/experience/excellence |

## 4. Negative / caveat signals (lower score, flag)

security/cyber (specialist), erp/sap/oracle/workday/d365/dynamics/crm/salesforce/
plm/hcm (specialist config), help desk/service desk/support (below seniority),
narrow-fn (single-platform specialist), infrastructure/network (not portfolio).

## Rationale for the changes (what the pass found)

- The original `MGMT` missed **standalone `Head`**, `Lead` (as a senior title
  suffix), `AVP`, `SVP/EVPs` — all frequent in the data. "Head, Responsible AI
  & Governance" was a top-tier match the old regex dropped.
- `AVP` in Canadian banks is a Director-band leadership level (NOT C-level); it
  should be *considered*, then judged on scope — not auto-dropped.
- Titles use "Lead" both ways: "Software Engineering Team Lead" (dev → exclude)
  vs "Enterprise Application Support Lead" (portfolio → keep). Only an LLM can
  tell them apart; regex treats "team/tech/technical lead" as dev and leaves the
  rest for the triage.
