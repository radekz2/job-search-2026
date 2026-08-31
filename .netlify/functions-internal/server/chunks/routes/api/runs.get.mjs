import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import { u as useDB } from '../../_/db.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';
import 'postgres';

const runs_get = defineEventHandler(async (event) => {
  const db = useDB();
  const rows = await db.prepare("SELECT * FROM runs ORDER BY run_at DESC LIMIT 30").all();
  return rows.results;
});

export { runs_get as default };
//# sourceMappingURL=runs.get.mjs.map
