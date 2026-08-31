/**
 * GET /api/runs
 * Returns recent pipeline run history.
 */
export default defineEventHandler(async (event) => {
  const db = useDB(event)

  const rows = await db
    .prepare('SELECT * FROM runs ORDER BY run_at DESC LIMIT 30')
    .all()

  return rows.results
})
