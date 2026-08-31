#!/usr/bin/env node
/**
 * run-pipeline.js — orchestrates the full job-search pipeline.
 *
 * Steps:
 *   1. Scrape all sources in parallel
 *   2. Deduplicate + filter candidates
 *   3. Fetch full descriptions for top-N candidates (deep-dive)
 *   4. Score top candidates with LLM
 *   5. Write all records (with scores for top-N, null score for the rest) to PostgreSQL
 *   6. Log the run
 *
 * Run:
 *   node pipeline/run-pipeline.js
 *
 * Environment variables:
 *   OPENAI_API_KEY           – LLM scoring (or OPENAI_BASE_URL + OPENAI_MODEL for alternatives)
 *   NETLIFY_DATABASE_URL     – PostgreSQL connection string
 *   DEEP_DIVE_N              – how many jobs to fetch descriptions + score (default 40)
 */

import { scrapeLinkedIn } from './scrape-linkedin.js'
import { scrapeJobBank } from './scrape-jobbank.js'
import { scrapeATS } from './scrape-ats.js'
import { scrapeWorkday } from './scrape-workday.js'
import { scrapeExtra } from './scrape-extra.js'
import { deepDive } from './deep-dive.js'
import { scoreJobs } from './llm-score.js'
import { writeJobs, logRun } from './db-write.js'

const DEEP_DIVE_N = Number(process.env.DEEP_DIVE_N) || 40
const TODAY = new Date().toISOString().slice(0, 10)

// ── Filtering logic (ported from build_candidates.py) ────────────────────────

const LEAD = /\b(manager|managing\s+director|director|head|head\s+of|vp|vice[\s-]?president|svp|evp|avp|chief|cto|cio|ciso|lead|owner|principal|supervisor|superintendent)\b/i
const BELOW_SENIORITY = /\b(intern|internship|co-?op|coop|student|new\s+grad|graduate\s+program|early\s+(career|talent)|trainee|apprentice|summer\s+(student|intern))\b/i
const DEV_EXCLUDE = /\b(software\s+development\s+manager|development\s+manager|team\s+lead|tech\s+lead|technical\s+lead|software\s+development\s+director|director\s+of\s+software\s+development|manager,\s+software\s+development|application\s+development\s+director|engineering\s+team\s+lead|software\s+engineering\s+lead|software\s+team\s+lead|software\s+development)\b/i
const IC_JUNK = /\b(teller|banker|advisor|adviser|representative|specialist|agent|assistant|clerk|technician|coordinator|attendant|cashier|receptionist)\b/i
const DIRECTOR = /\b(director|vp|vice president|head of|chief|cto|cio)\b/i
const IT_TECH = /\b(it|information technology|technology|tech)\b/i
const SW_DEV = /(software engineering|engineering manager|engineering director|manager software engineering|director of engineering|director, engineering|head of engineering|vp of engineering|software manager|software engineering manager)/i
const ENTERPRISE = /\b(enterprise|business systems|business applications|application|applications)\b/i
const SAAS_CLOUD = /\b(saas|cloud)\b/i
const AI_RE = /\b(ai|a\.i\.|copilot|generative|automation|innovation|digital transformation|transformation)\b/i
const SERVICE = /\b(service management|service delivery|itsm|it operations)\b/i

function locRank(loc) {
  const l = (loc || '').toLowerCase()
  if (l.includes('toronto')) return 'toronto'
  if (['mississauga', 'vaughan', 'markham', 'north york', 'etobicoke', 'scarborough', 'greater toronto',
    'richmond hill', 'oakville', 'woodbridge', 'courtice', 'milton', 'hamilton', 'waterloo', 'cambridge',
    'kitchener', 'guelph', 'oshawa', 'brampton', 'ajax', 'pickering', 'newmarket', 'aurora', 'whitby'
  ].some(x => l.includes(x))) return 'gta'
  if (l.includes('ontario')) return 'ontario'
  return 'canada'
}

function regexScore(job) {
  const t = (job.title || '').toLowerCase()
  const loc = (job.location || '').toLowerCase()
  let seniority = DIRECTOR.test(t) ? 3.0 : 2.5
  let dom = 1.5
  if (IT_TECH.test(t)) dom += 0.5
  if (ENTERPRISE.test(t)) dom += 0.5
  if (SAAS_CLOUD.test(t)) dom += 0.5
  if (AI_RE.test(t)) dom += 0.5
  if (SERVICE.test(t)) dom += 0.5
  dom = Math.max(0.5, Math.min(3.0, dom))
  const devLean = SW_DEV.test(t)
  if (devLean) dom = Math.min(dom, 1.5)
  const lr = locRank(loc)
  const location = job.remote ? 1.5 : { toronto: 2.0, gta: 1.6, ontario: 1.3, canada: 1.0 }[lr]
  let total = seniority + dom + location
  if (devLean) total -= 1.0
  return { score: Math.max(0, Math.min(10, total)), devLean }
}

function filterCandidates(records) {
  const kept = []
  for (const r of records) {
    const t = (r.title || '').trim()
    if (!t) continue
    if (r.link?.includes('linkedin.com/jobs/view/')) {
      r.link = r.link.replace(/\?.*$/, '')
    }
    if (BELOW_SENIORITY.test(t) || DEV_EXCLUDE.test(t)) continue
    if (IC_JUNK.test(t) && !LEAD.test(t)) continue
    if (!LEAD.test(t) && !IT_TECH.test(t)) continue
    const { score, devLean } = regexScore(r)
    r.regex_score = score
    r.dev_lean = devLean
    r.level = DIRECTOR.test(t) ? 'director' : 'manager'
    r.bucket = SW_DEV.test(t) ? 'sw' : 'it'
    kept.push(r)
  }
  // dedupe by title+company
  const seen = new Set()
  const deduped = []
  for (const r of kept) {
    const key = `${(r.title || '').toLowerCase()}|${(r.company || '').toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(r)
  }
  deduped.sort((a, b) => b.regex_score - a.regex_score)
  return deduped
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const logs = []
  const log = (...args) => {
    console.log(...args)
    logs.push(args.join(' '))
  }

  log(`\n${'='.repeat(60)}`)
  log(`JOB SEARCH PIPELINE  ${new Date().toISOString()}`)
  log('='.repeat(60))

  // 1. Scrape all sources in parallel
  log('\n[1/5] Scraping all sources...')
  const [li, jb, ats, wd, extra] = await Promise.allSettled([
    scrapeLinkedIn(),
    scrapeJobBank(),
    scrapeATS(),
    scrapeWorkday(),
    scrapeExtra()
  ]).then(results => results.map((r, i) => {
    if (r.status === 'rejected') {
      log(`  WARN scraper ${i} failed: ${r.reason?.message}`)
      return []
    }
    return r.value
  }))

  const allRecords = [...li, ...jb, ...ats, ...wd, ...extra]
  log(`\n  Raw records: LI=${li.length}, JB=${jb.length}, ATS=${ats.length}, WD=${wd.length}, Extra=${extra.length}`)
  log(`  Total raw: ${allRecords.length}`)

  // 2. Filter + deduplicate
  log('\n[2/5] Filtering and deduplicating...')
  const candidates = filterCandidates(allRecords)
  log(`  Candidates after filtering: ${candidates.length}`)

  // 3. Deep-dive: fetch descriptions for top-N
  log(`\n[3/5] Fetching descriptions for top ${DEEP_DIVE_N}...`)
  const topWithDesc = await deepDive(candidates, DEEP_DIVE_N)

  // Merge descriptions back into the full candidates array
  const descById = new Map(topWithDesc.map(j => [`${j.title}|${j.company}`, j.description]))
  const candidatesWithDesc = candidates.map(c => ({
    ...c,
    description: descById.get(`${c.title}|${c.company}`) || c.description || ''
  }))

  // 4. LLM scoring for top-N only
  log(`\n[4/5] LLM scoring top ${topWithDesc.length}...`)
  const scoredTop = await scoreJobs(topWithDesc)

  // Merge LLM scores back
  const scoreMap = new Map(scoredTop.map(j => [`${j.title}|${j.company}`, j]))
  const finalCandidates = candidatesWithDesc.map((c) => {
    const scored = scoreMap.get(`${c.title}|${c.company}`)
    return scored ? { ...c, ...scored } : c
  })

  const scoredCount = finalCandidates.filter(c => c.score != null).length
  log(`  Scored: ${scoredCount}/${finalCandidates.length}`)

  // 5. Write to database
  log('\n[5/5] Writing to database...')
  const { written } = await writeJobs(finalCandidates, TODAY)

  // 6. Log run
  await logRun({
    jobsScraped: allRecords.length,
    jobsScored: scoredCount,
    jobsNew: written,
    status: 'ok',
    log: logs.join('\n')
  })

  log(`\nPipeline complete: ${new Date().toISOString()}`)
  log(`Written to database: ${written} records`)
}

main().catch((e) => {
  console.error('[pipeline] FATAL:', e)
  process.exit(1)
})
