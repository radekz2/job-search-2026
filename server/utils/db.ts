import type { H3Event } from 'h3'
import type { D1Database } from '@cloudflare/workers-types'

/**
 * D1 helper — returns the bound D1 database from the Cloudflare context.
 * Usage in server routes:
 *   const db = useDB(event)
 *   const rows = await db.prepare('SELECT * FROM jobs LIMIT 10').all()
 */
export function useDB(event: H3Event) {
  const { cloudflare } = event.context as unknown as { cloudflare: { env: { DB: D1Database } } }
  return cloudflare.env.DB
}
