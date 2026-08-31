/**
 * PostgreSQL writer — writes scraped + scored job records using Netlify database connection.
 *
 * Required environment variables:
 *   NETLIFY_DATABASE_URL (preferred) or DATABASE_URL
 */

import postgres from 'postgres'

const CONNECTION_STRING = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL

if (!CONNECTION_STRING) {
  throw new Error('Missing NETLIFY_DATABASE_URL or DATABASE_URL')
}

const sql = postgres(CONNECTION_STRING, {
  max: 1,
  prepare: false
})

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
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
ON CONFLICT(id) DO UPDATE SET
  location   = excluded.location,
  link       = excluded.link,
  salary     = excluded.salary,
  date_posted = excluded.date_posted,
  date_scraped = excluded.date_scraped,
  telework   = excluded.telework,
  description = CASE WHEN excluded.description != '' THEN excluded.description ELSE jobs.description END,
  score      = CASE WHEN excluded.score IS NOT NULL THEN excluded.score ELSE jobs.score END,
  score_rationale = CASE WHEN excluded.score_rationale != '' THEN excluded.score_rationale ELSE jobs.score_rationale END,
  recommendation = CASE WHEN excluded.recommendation != '' THEN excluded.recommendation ELSE jobs.recommendation END,
  strengths  = CASE WHEN excluded.strengths != '' THEN excluded.strengths ELSE jobs.strengths END,
  concerns   = CASE WHEN excluded.concerns != '' THEN excluded.concerns ELSE jobs.concerns END,
  updated_at = NOW()
`

/**
 * Write jobs to database in batches.
 * @param {object[]} jobs - enriched + scored job records
 * @param {string} dateScraped - YYYY-MM-DD
 * @returns {Promise<{written: number}>}
 */
export async function writeJobs(jobs, dateScraped) {
  let written = 0
  const BATCH = 200

  for (let i = 0; i < jobs.length; i += BATCH) {
    const batch = jobs.slice(i, i + BATCH)

    await sql.begin(async (tx) => {
      for (const job of batch) {
        await tx.unsafe(UPSERT_SQL, [
          jobId(job),
          (job.title || '').slice(0, 500),
          (job.company || '').slice(0, 300),
          (job.location || '').slice(0, 300),
          (job.link || '').slice(0, 1000),
          (job.source || '').slice(0, 50),
          Boolean(job.remote),
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
        ])
      }
    })

    written += batch.length
    console.log(`[db-write] Wrote ${written}/${jobs.length} jobs`)
  }

  return { written }
}

/**
 * Log a pipeline run to the runs table.
 */
export async function logRun({ jobsScraped, jobsScored, jobsNew, status = 'ok', log = '' }) {
  await sql.unsafe(
    'INSERT INTO runs (jobs_scraped, jobs_scored, jobs_new, status, log) VALUES ($1, $2, $3, $4, $5)',
    [jobsScraped, jobsScored, jobsNew, status, log.slice(0, 4000)]
  )
}
