/**
 * D1 helper — returns the bound D1 database from the Cloudflare context.
 * Usage in server routes:
 *   const db = useDB(event)
 *   const rows = await db.prepare('SELECT * FROM jobs LIMIT 10').all()
 */
export function useDB(event: Parameters<typeof getRequestEvent>[0]) {
  const { cloudflare } = event.context as { cloudflare: { env: { DB: D1Database } } }
  return cloudflare.env.DB
}
