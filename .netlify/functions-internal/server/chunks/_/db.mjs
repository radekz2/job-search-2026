import postgres from 'postgres';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
let sqlClient = null;
function getSqlClient() {
  if (sqlClient) {
    return sqlClient;
  }
  const connectionString = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing NETLIFY_DATABASE_URL or DATABASE_URL environment variable");
  }
  sqlClient = postgres(connectionString, {
    max: 1,
    prepare: false
  });
  return sqlClient;
}
function convertPlaceholders(query) {
  let index = 0;
  return query.replace(/\?/g, () => {
    index += 1;
    return `$${index}`;
  });
}
class QueryBuilder {
  constructor(query) {
    __publicField(this, "query");
    __publicField(this, "params", []);
    this.query = query;
  }
  bind(...params) {
    this.params = params;
    return this;
  }
  async all() {
    const sql = getSqlClient();
    const rows = await sql.unsafe(convertPlaceholders(this.query), this.params);
    return { results: rows };
  }
  async first() {
    var _a;
    const { results } = await this.all();
    return (_a = results[0]) != null ? _a : null;
  }
  async run() {
    const sql = getSqlClient();
    await sql.unsafe(convertPlaceholders(this.query), this.params);
    return { success: true };
  }
}
function useDB(_event) {
  return {
    prepare(query) {
      return new QueryBuilder(query);
    }
  };
}

export { useDB as u };
//# sourceMappingURL=db.mjs.map
