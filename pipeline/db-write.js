/**
 * D1 REST API writer — writes scraped + scored job records to Cloudflare D1
 * using the Cloudflare REST API (used from GitHub Actions, not from a Worker).
 *
 * Required environment variables:
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_D1_DATABASE_ID
 *   CLOUDFLARE_API_TOKEN        – needs Workers D1 write permission
 */

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID
const TOKEN = process.env.CLOUDFLARE_API_TOKEN

const D1_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DB_ID}`

async function d1Query(sql, params = []) {
  const res = await fetch(`${D1_BASE}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + TOKEN
    },
    body: JSON.stringify({ sql, params }),
    signal: AbortSignal.timeout(30_000)
  })
  const data = await res.json()
  if (!data.success) {
    throw new Error(`D1 error: ${JSON.stringify(data.errors)}`)
  }
  return data.result
}

/**
 * Generate a stable ID for a job posting.
 * Uses a simple hash of source + title (normalized) + company (normalized).
 */
function jobId(job) {
  const key = `${job.source}|${(job.title || '').toLowerCase().replace(/\s+/g, ' ').trim()}|${(job.company || '').toLowerCase().replace(/\s+/g, ' ').trim()}`
  // FNV-1a-style hash, hex string
  let hash = 2166136261
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i)
    hash = (hash * 16777619) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

const UPSERT_SQL = `
INSERT INTO jobs (id, title, company, location, link, source, remote, salary,
  date_posted, date_scraped, telework, description, bucket, level,
  score, score_rationale, recommendation, strengths, concerns, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
ON CONFLICT(id) DO UPDATE SET
  location   = excluded.location,
  link       = excluded.link,
  salary     = excluded.salary,
  date_posted = excluded.date_posted,
  date_scraped = excluded.date_scraped,
  telework   = excluded.telework,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE description END,
  score      = CASE WHEN excluded.score IS NOT NULL THEN excluded.score ELSE score END,
  score_rationale = CASE WHEN excluded.score_rationale != '' THEN excluded.score_rationale ELSE score_rationale END,
  recommendation = CASE WHEN excluded.recommendation != '' THEN excluded.recommendation ELSE recommendation END,
  strengths  = CASE WHEN excluded.strengths != '' THEN excluded.strengths ELSE strengths END,
  concerns   = CASE WHEN excluded.concerns != '' THEN excluded.concerns ELSE concerns END,
  updated_at = datetime('now')
`

/**
 * Write jobs to D1 in batches.
 * @param {object[]} jobs - enriched + scored job records
 * @param {string} dateScraped - YYYY-MM-DD
 * @returns {Promise<{inserted: number, updated: number}>}
 */
export async function writeJobs(jobs, dateScraped) {
  if (!ACCOUNT_ID || !DB_ID || !TOKEN) {
    throw new Error('Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, or CLOUDFLARE_API_TOKEN')
  }

  let written = 0
  const BATCH = 50 // D1 REST API max per request

  for (let i = 0; i < jobs.length; i += BATCH) {
    const batch = jobs.slice(i, i + BATCH)

    // D1 REST supports multi-statement or multiple queries in one call
    const statements = batch.map(job => ({
      sql: UPSERT_SQL,
      params: [
        jobId(job),
        (job.title || '').slice(0, 500),
        (job.company || '').slice(0, 300),
        (job.location || '').slice(0, 300),
        (job.link || '').slice(0, 1000),
        (job.source || '').slice(0, 50),
        job.remote ? 1 : 0,
        (job.salary || '').slice(0, 200),
        (job.date_posted || '').slice(0, 50),
        dateScraped,
        (job.telework || '').slice(0, 100),
        (job.description || '').slice(0, 10000),
        (job.bucket || ''),
        (job.level || ''),
        job.score ?? null,
        (job.score_rationale || '').slice(0, 1000),
        (job.recommendation || '').slice(0, 20),
        (job.strengths || '').slice(0, 500),
        (job.concerns || '').slice(0, 500)
      ]
    }))

    // D1 batch endpoint
    const res = await fetch(`${D1_BASE}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      },
      body: JSON.stringify(statements),
      signal: AbortSignal.timeout(60_000)
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error(`D1 batch error at offset ${i}: ${JSON.stringify(data.errors)}`)
    }
    written += batch.length
    console.log(`[db-write] Wrote ${written}/${jobs.length} jobs`)
  }

  return { written }
}

/**
 * Log a pipeline run to the runs table.
 */
export async function logRun({ jobsScraped, jobsScored, jobsNew, status = 'ok', log = '' }) {
  await d1Query(
    `INSERT INTO runs (jobs_scraped, jobs_scored, jobs_new, status, log) VALUES (?, ?, ?, ?, ?)`,
    [jobsScraped, jobsScored, jobsNew, status, log.slice(0, 4000)]
  )
}
