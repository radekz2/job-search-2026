# ATS + Workday job-board APIs

Concrete endpoints, field maps, and discovery recipes for the targeted-employer
ATS sources. All are public and need no login/API key — just a desktop
`User-Agent` (some, like Greenhouse, don't even need that).

## Greenhouse

Board JSON (list + descriptions when `content=true`):

```
GET https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true
```

Response `jobs[]` fields used:
- `title`, `absolute_url`, `location.name` (nested dict)
- `content` (full HTML description — only present with `content=true`)
- `updated_at` (date), `company_name` (sometimes blank — fill from board name)

## Lever

```
GET https://api.lever.co/v0/postings/{slug}?mode=json
```

Returns a top-level JSON **array**. Per job:
- `text` = title, `hostedUrl` = link
- `categories.location` = location, `categories.commitment` = telework
- `createdAt` = **epoch milliseconds** (divide by 1000 before formatting)
- `salaryDescription` = salary text, `descriptionPlain` = full description
- `workplaceType` = remote/hybrid/on-site

## Ashby

```
GET https://api.ashbyhq.com/posting-api/job-board/{slug}
```

Response `jobs[]`:
- `title`, `jobUrl`, `location`, `isRemote` (bool), `workplaceType`
- `publishedAt`, `descriptionPlain`

## Workday

List endpoint (POST — GET returns HTTP 400):

```
POST https://{tenant}.wd{N}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
Content-Type: application/json
{"limit":20,"offset":0,"searchText":"","appliedFacets":{}}
```

Response:
```
{ "total": N, "jobPostings": [ { "title", "externalPath",
    "locationsText", "postedOn", "remoteType", "bulletFields": [...] } ] }
```

- Paginate `offset` by `limit` until `offset >= total`.
- Job link = `https://{host}/en-US/{site}{externalPath}`.
- `remoteType` values: "On Site", "Hybrid", "Remote".

Job description + salary (NOT in list response) — fetch the job page and parse
the JSON-LD block:

```
<script type="application/ld+json">{ "title", "description", "datePosted",
  "jobLocation", "hiringOrganization", ... }</script>
```

`description` is full plain text and usually leads with pay details
(e.g. "Pay Details: $69,700 - $98,400 CAD").

### Finding the Workday tenant (the hard part)

The URL hides three unknowns (`wdN` instance, tenant, site) — brute-forcing is
impractical. Two reliable paths:

1. **Vanity career domain + redirect:** `jobs.rbc.com`, `careers.manulife.com`,
   etc. — follow the redirect chain; the final host is the Workday board.
2. **Web search:** `"{company} careers myworkdayjobs.com"` — the SERP exposes the
   full board URL (e.g. `manulife.wd3.myworkdayjobs.com/MFCJH_Jobs`).

Known Canadian Workday boards (verified 2026-08):

| Company | Host | Tenant | Site |
|---|---|---|---|
| TD Bank | td.wd3.myworkdayjobs.com | td | TD_Bank_Careers |
| BMO | bmo.wd3.myworkdayjobs.com | bmo | External |
| CIBC | cibc.wd3.myworkdayjobs.com | cibc | search |
| Manulife | manulife.wd3.myworkdayjobs.com | manulife | MFCJH_Jobs |
| Sun Life | sunlife.wd3.myworkdayjobs.com | sunlife | Experienced-Jobs |
| OMERS | omers.wd3.myworkdayjobs.com | omers | OMERS_External |
| CPP Investments | cppib.wd10.myworkdayjobs.com | cppib | cppinvestments |
| OTPP (Ontario Teachers') | otppb.wd3.myworkdayjobs.com | otppb | OntarioTeachers_Careers |
| Clio | clio.wd3.myworkdayjobs.com | clio | ClioCareerSite |

Also verified 2026-08-30 (Ashby unless noted): **Wealthsimple** (`wealthsimple`),
**Jobber** (`jobber`), **Nylas** (`nylas`), **Top Hat** (`top-hat`),
**Hootsuite** (`hootsuite`, Greenhouse), **Faire** (`faire`, Greenhouse).

Note: RBC uses **Phenom** (a talent layer), not plain Workday — separate effort
if specifically requested.

## SmartRecruiters

``` 
GET https://api.smartrecruiters.com/v1/companies/{Company}/postings
```

Response: `{ "totalFound": N, "content": [...] }`. `totalFound` can be **zero**
between hiring waves — that's a valid (empty) board, not a broken extractor.
Coveo uses SmartRecruiters; not wired into a scraper yet (was empty at discovery).

## Shopify (custom Ashby GraphQL — not slug-addressable)

Shopify runs a **hosted** Ashby board served via
`jobs.ashbyhq.com/api/non-user-graphql` with `organizationHostedJobsPageName:
"shopify"`. The slug-based Ashby endpoint (`job-board/shopify`) 404s. Scraping it
needs a bespoke GraphQL client, not the standard extractor.

## Discovery shortcut: curated Canadian-employer ATS list

Instead of brute-forcing slugs, check a maintained public list of Canadian tech
employers' exact ATS endpoints first:

```
https://git.levkin.ca/ilia/Jobber/raw/branch/main/docs-site/docs/extractors/canadian-companies-qa-ats.md
```

It tabulates Tier-1 (verified Ashby/Greenhouse/Lever/Workday/SmartRecruiters
endpoints) and Tier-2 (custom surfaces) for Shopify, Clio, Coveo, Hootsuite,
Faire, Jobber, Nylas, Wealthsimple, RBC Borealis, Vidyard, Lightspeed, Loblaw
Digital, and more. Slug guesses alone (e.g. `tophat` vs the real `top-hat`) fail
often — this list gives the confirmed slug/tenant and is the fastest reliable
discovery path for Canadian employers.

| Board | Why |
|---|---|
| Indeed | 403 bot-protection; no free public API (needs partner key) |
| Built In | location filter is client-side JS — plain request returns US-wide jobs |
| Hays | Liferay JS-rendered app, no public endpoint |
| GC Jobs (federal) | JSF session app at psjobs-emploisfp.psc-cfp.gc.ca |

These still offer saved-search email alerts — point the user there rather than
burning time reverse-engineering.

## Non-tech function-manager filter

ATS boards return every function. Drop titles matching a non-tech function
(sales / marketing / HR / finance / customer success / legal / supply chain)
that ALSO lack a tech signal (it / technology / software / engineering /
platform / data / AI / cloud / systems / SAP / Workday / Salesforce). Keep
"Technical Account Manager" etc. — the tech adjective is the keep-signal.
