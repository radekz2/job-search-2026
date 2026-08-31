/**
 * GET /api/jobs
 * Query params:
 *   source    – filter by source name (LinkedIn, Greenhouse, etc.)
 *   bucket    – 'it' | 'sw'
 *   level     – 'director' | 'manager'
 *   remote    – '1' | '0'
 *   score_min – number (0-10)
 *   score_max – number (0-10)
 *   rec       – 'Apply' | 'Review' | 'Skip'
 *   search    – full-text search across title, company, location
 *   shortlisted – '1' to return only shortlisted jobs
 *   page      – page number (default 1)
 *   per_page  – items per page (default 25, max 100)
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  const q = getQuery(event)

  const page = Math.max(1, Number(q.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(q.per_page) || 25))
  const offset = (page - 1) * perPage

  const conditions: string[] = []
  const params: (string | number)[] = []

  if (q.source) {
    conditions.push('j.source = ?')
    params.push(String(q.source))
  }
  if (q.bucket) {
    conditions.push('j.bucket = ?')
    params.push(String(q.bucket))
  }
  if (q.level) {
    conditions.push('j.level = ?')
    params.push(String(q.level))
  }
  if (q.remote !== undefined) {
    conditions.push('j.remote = ?')
    params.push(q.remote === '1' ? 1 : 0)
  }
  if (q.score_min) {
    conditions.push('j.score >= ?')
    params.push(Number(q.score_min))
  }
  if (q.score_max) {
    conditions.push('j.score <= ?')
    params.push(Number(q.score_max))
  }
  if (q.rec) {
    conditions.push('j.recommendation = ?')
    params.push(String(q.rec))
  }
  if (q.search) {
    const term = `%${q.search}%`
    conditions.push('(j.title LIKE ? OR j.company LIKE ? OR j.location LIKE ?)')
    params.push(term, term, term)
  }
  if (q.shortlisted === '1') {
    conditions.push('s.job_id IS NOT NULL')
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const countResult = await db
    .prepare(`SELECT COUNT(*) as total FROM jobs j LEFT JOIN shortlist s ON j.id = s.job_id ${where}`)
    .bind(...params)
    .first<{ total: number }>()

  const rows = await db
    .prepare(
      `SELECT j.id, j.title, j.company, j.location, j.link, j.source, j.remote,
              j.salary, j.date_posted, j.date_scraped, j.telework, j.bucket, j.level,
              j.score, j.score_rationale, j.recommendation, j.strengths, j.concerns,
              CASE WHEN s.job_id IS NOT NULL THEN 1 ELSE 0 END as shortlisted,
              s.status as shortlist_status, s.notes as shortlist_notes
       FROM jobs j
       LEFT JOIN shortlist s ON j.id = s.job_id
       ${where}
       ORDER BY j.score DESC NULLS LAST, j.date_scraped DESC
       LIMIT ? OFFSET ?`
    )
    .bind(...params, perPage, offset)
    .all()

  return {
    data: rows.results,
    meta: {
      total: countResult?.total ?? 0,
      page,
      per_page: perPage,
      pages: Math.ceil((countResult?.total ?? 0) / perPage)
    }
  }
})
