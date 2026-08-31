/**
 * DELETE /api/jobs/:id/shortlist
 * Removes a job from the shortlist.
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing job id' })
  }

  await db.prepare('DELETE FROM shortlist WHERE job_id = ?').bind(id).run()

  return { ok: true }
})
