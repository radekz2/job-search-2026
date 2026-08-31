/**
 * GET /api/shortlist
 * Returns all shortlisted jobs joined with job data,
 * sorted by status then score DESC.
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  const q = getQuery(event)

  const conditions: string[] = []
  const params: (string | number)[] = []

  if (q.status) { conditions.push('s.status = ?'); params.push(String(q.status)) }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await db
    .prepare(
      `SELECT j.id, j.title, j.company, j.location, j.link, j.source, j.remote,
              j.salary, j.date_posted, j.bucket, j.level, j.score,
              j.score_rationale, j.recommendation, j.strengths, j.concerns,
              s.status, s.notes, s.date_added, s.date_updated
       FROM shortlist s
       JOIN jobs j ON j.id = s.job_id
       ${where}
       ORDER BY
         CASE s.status
           WHEN 'offer'        THEN 1
           WHEN 'interviewing' THEN 2
           WHEN 'applied'      THEN 3
           WHEN 'saved'        THEN 4
           WHEN 'rejected'     THEN 5
           ELSE 6
         END,
         j.score DESC`
    )
    .bind(...params)
    .all()

  return rows.results
})
