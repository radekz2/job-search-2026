/**
 * POST /api/jobs/:id/shortlist
 * Body: { notes?: string, status?: string }
 * Adds or updates a job on the shortlist.
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing job id' })
  }

  const body = await readBody(event) as { notes?: string, status?: string }

  const exists = await db.prepare('SELECT id FROM jobs WHERE id = ?').bind(id).first()
  if (!exists) {
    throw createError({ statusCode: 404, message: 'Job not found' })
  }

  const status = body?.status ?? 'saved'
  const notes = body?.notes ?? ''

  await db
    .prepare(
      `INSERT INTO shortlist (job_id, status, notes)
       VALUES (?, ?, ?)
       ON CONFLICT(job_id) DO UPDATE SET
         status = excluded.status,
         notes = excluded.notes,
         date_updated = NOW()`
    )
    .bind(id, status, notes)
    .run()

  return { ok: true }
})
