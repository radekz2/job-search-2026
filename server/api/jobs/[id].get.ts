/**
 * GET /api/jobs/:id
 * Returns a single job with full description and shortlist status.
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing job id' })
  }

  const row = await db
    .prepare(
      `SELECT j.*,
              CASE WHEN s.job_id IS NOT NULL THEN 1 ELSE 0 END as shortlisted,
              s.status as shortlist_status, s.notes as shortlist_notes, s.date_added
       FROM jobs j
       LEFT JOIN shortlist s ON j.id = s.job_id
       WHERE j.id = ?`
    )
    .bind(id)
    .first()

  if (!row) {
    throw createError({ statusCode: 404, message: 'Job not found' })
  }

  return row
})
