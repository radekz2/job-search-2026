import postgres from 'postgres'

let sqlClient: postgres.Sql | null = null

type QueryParam = postgres.ParameterOrJSON<never>

function getSqlClient() {
  if (sqlClient) {
    return sqlClient
  }

  const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing NETLIFY_DATABASE_URL or DATABASE_URL environment variable')
  }

  sqlClient = postgres(connectionString, {
    max: 1,
    prepare: false
  })

  return sqlClient
}

function convertPlaceholders(query: string) {
  let index = 0
  return query.replace(/\?/g, () => {
    index += 1
    return `$${index}`
  })
}

class QueryBuilder {
  private readonly query: string

  private params: QueryParam[] = []

  constructor(query: string) {
    this.query = query
  }

  bind(...params: QueryParam[]) {
    this.params = params
    return this
  }

  async all() {
    const sql = getSqlClient()
    const rows = await sql.unsafe(convertPlaceholders(this.query), this.params)
    return { results: rows as Record<string, unknown>[] }
  }

  async first<T = Record<string, unknown>>() {
    const { results } = await this.all()
    return (results[0] as T | undefined) ?? null
  }

  async run() {
    const sql = getSqlClient()
    await sql.unsafe(convertPlaceholders(this.query), this.params)
    return { success: true }
  }
}

/**
 * Database helper compatible with the existing D1-style route usage.
 */
export function useDB(_event?: unknown) {
  return {
    prepare(query: string) {
      return new QueryBuilder(query)
    }
  }
}
