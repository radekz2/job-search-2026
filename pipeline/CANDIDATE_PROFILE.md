# Candidate Profile — Radek Zajkowski

Grounding document for the LLM evaluation pass. The evaluator reads this file
plus the fetched job descriptions and produces a **fit score + rationale** based
**only** on comparing the candidate's actual experience (across ALL resumes) to
the job posting. See `references/llm-evaluation.md` for the rubric and schema.

This profile is the UNION of all four resumes in `/opt/data/resumes/`:
`Radek Zajkowski Resume 2026 — Kitco Metals.docx`, `Radek Zajkowski Resume 2026.docx`,
`R_Zajkowski_Resume_2025-1Password.docx`, `R_Zajkowski_Resume_2025-Metrolinx.docx`.
Different resumes emphasize different facets; the union is the truest signal.

## Identity
- **Name:** Radek Zajkowski
- **Location:** Toronto, ON, Canada (this is informational only — location does
  NOT affect the fit score; see rubric)
- **Experience:** 20+ years, technology leadership

## What the score measures
The `llm_score` is a **resume ↔ posting experience-fit** judgment: how well the
role's stated responsibilities and requirements map onto what the candidate has
actually done and demonstrated. It is NOT influenced by language or company
brand — those are recorded as practical notes but never move the number.

### Location rule (practical feasibility exception)
Location does **not** affect the score — EXCEPT one hard case: a role that is
**outside the GTA AND requires in-office days** (on-site, or hybrid with a stated
in-office requirement). The candidate cannot travel 50+ km to an office, so such
roles MUST be flagged in `concerns` AND capped **below 8.0** (max 7.9). Remote-only
roles outside the GTA are NOT capped (no travel required). GTA roles are never capped.

## Target roles (what he WANTS)
Manager or Director positions in **technology**:
- Software Manager / IT Manager
- Director of Technology / Enterprise Applications / Business Systems
- Enterprise applications / business-systems portfolio leadership

**Vice President / C-level roles are EXCLUDED** — do not consider them (mark
`recommendation: "Skip"`, `seniority: "vp"`/`"chief"`, and flag in `concerns`).

## Explicit exclusions (affect the score — they are fit mismatches)
- **Vice President / C-level roles** (VP, SVP, EVP, Chief) — excluded entirely;
  do not consider these regardless of fit.
- **Hands-on development-team leadership** where the core of the role is daily
  coding, code review, or running a software-engineering team in sprints.
  (Note: he HAS deep hands-on technical history — see below — and he CAN lead
  developers as part of a broader remit. The mismatch is specifically roles whose
  *primary* job is hands-on dev-team delivery, not roles that merely include some
  engineering oversight.)
- **Individual-contributor roles** with no people/portfolio leadership (e.g. a
  pure architect or analyst with no reports and no platform ownership).
- **Non-technology function managers** (sales, marketing, HR, finance, customer
  success, supply chain) unless the title/scope clearly carries a technology or
  enterprise-applications mandate.

## Resume profile (aggregate — the union of all four)

### Current / most recent (highest weight)
**Manager, Enterprise Software Services — TVO (Ontario Educational Communications Authority), Feb 2023–present, Toronto**
Resumes differ slightly on team size (6 BSO + 4 developers, or 8 BSO + 2 developers);
the union: led a team of Business System Owners + developers supporting internal
business applications organization-wide.
- Portfolio of **20+ enterprise applications**; accountable for **~$2M annual software budget**;
  led the single largest procurement (~$1M) through RFP design, vendor evaluation,
  contract negotiation, and license governance.
- Drove org-wide rollout/adoption of **Atlassian Suite (Jira, Jira Service Management,
  Confluence)** to all ~500 staff across 7+ departments, plus **Microsoft Copilot 365**,
  **Sparkrock365 (Finance ERP)**, and **VSN (Media Asset Management)**.
- Drove analytics/reporting modernization via **Power BI + Microsoft Fabric**.
- **Authored TVO's Generative AI Use Policy**; established a governed, employee-driven
  process for evaluating and approving AI use cases.
- Migrated custom on-premises systems to cloud-hosted SaaS, reducing technical debt
  and improving reliability for 500 staff + ~20,000 external users (ILC online HS).
- Implemented request-type **SLAs** in JSM and a formal **change management** process
  (change requests, test cases, deployment approvals).
- Procured/managed vendor relationships, renewals, and RFP processes; quarterly budget
  variance reports; multi-year technology planning.
- Partnered with Infrastructure + Cybersecurity on vulnerability management, remediation,
  and tabletop exercises.

### Prior leadership (2004–2023)
- **VP Technology & Tech Lead — No Fixed Address Inc. (2018–2023):** led internal +
  client teams (3 developers + 1 DevOps engineer + external partners/freelancers);
  governed solution architectures across JAMstack, PHP, and cloud-native; configured and
  managed AWS (EC2/S3/CloudFront); cloud cost optimization; web performance/accessibility/
  SEO audits; resourcing, budget tracking, DevOps practices.
- **CTO & Technical Architect — Reddin Global (2015–2018):** led up to 7 developers,
  2 QA, 2 UX/UI designers building mobile web products; technical strategy, architecture
  standards, DevOps/CI-CD (continuous deployment, branching, code review workflows);
  Agile/Scrum; resourcing, budgets, SR&ED/IRAP grants; technical liaison with partner agencies.
- **Director of Development — Workbay.Net (Aug–Dec 2014):** transitioned LMS dev team to
  Symfony2 + AngularJS; performance tuning on multi-tier AWS EC2; requirements gathering.
- **Technical Architect — Proximity Canada (2011–2014):** architected Sitecore CMS
  (campbellskitchen.com), Solr search, "Do Us a Flavour" campaigns (Lay's, 9M+ submissions),
  Pepsi Xbox contest app (90M pin redemptions), HP multi-source document repository
  (Umbraco CMS + REST API); led estimation, offshore team coordination, Git/Symfony2/Jenkins CI adoption.
- **Senior Web Developer & Technology Lead — Twist Image (2010–2011):** campaigns + CMS for
  Canadian Cancer Society, TD Bank, Dairy Farmers, Xbox, Moneris.
- **Systems Engineer — Engage Learning Systems (2004–2010):** built e-learning/LMS systems
  (Walmart Canada LMS, Four Seasons portal, Home Depot Moodle, Teva SCORM).

### Hands-on technical history (early career — relevant context)
Strong practical engineering background across PHP, JAMstack, Symfony2, AngularJS,
Sitecore, Solr, Moodle, Umbraco, Jenkins CI, AWS EC2. This means he is *technically
literate* and can credibly lead technical teams and evaluate architecture — but his
recent and target roles are **management/portfolio leadership, not hands-on delivery**,
and roles whose primary job is daily coding are a deliberate mismatch.

### Key skill themes (for fit matching)
- Enterprise application / business-systems portfolio management (20+ apps)
- SaaS / cloud migration (AWS, Azure), DevOps & CI/CD *strategy*
- AI enablement + responsible-AI governance (authored GenAI policy)
- Data platform & analytics modernization (Power BI, Microsoft Fabric)
- Vendor management, RFP/procurement, licensing, SaaS governance, budget (~$2M)
- ITIL4 / service management, SLAs, change management
- Collaboration tooling (Atlassian Jira/JSM/Confluence, Microsoft 365 / Copilot)
- People leadership (teams of ~3–10), Agile/Scrum, cross-functional stakeholders
- Technical architecture & platform design (historical, hands-on)
- Certifications: ITIL4 Foundation

### Positive fit signals (raise the score)
Enterprise applications / business systems / application portfolio; SaaS/cloud/
transformation/modernization; AI/automation/governance; data platform/analytics;
vendor/procurement/RFP/budget/governance; service management (ITIL/SLA/change);
collaboration tools (Atlassian/M365/Copilot); people leadership; strategy/roadmap;
technology leadership of technical teams (he has the background to lead engineers).

### Negative fit signals (lower the score)
- Role whose PRIMARY job is hands-on coding / code review / running a dev team in sprints
- Individual-contributor role (no reports, no platform ownership)
- Non-technology function (sales/marketing/HR/finance/customer success/supply chain)
- Requirements demanding domain depth he has not demonstrated (e.g. PhD-level AI research,
  deep financial-services model-risk/OSFI compliance, manufacturing/SAP-MES specialization)
