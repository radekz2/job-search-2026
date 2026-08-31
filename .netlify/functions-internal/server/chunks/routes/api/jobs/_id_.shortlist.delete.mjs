import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
import { u as useDB } from '../../../_/db.mjs';
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

const _id__shortlist_delete = defineEventHandler(async (event) => {
  const db = useDB();
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing job id" });
  }
  await db.prepare("DELETE FROM shortlist WHERE job_id = ?").bind(id).run();
  return { ok: true };
});

export { _id__shortlist_delete as default };
//# sourceMappingURL=_id_.shortlist.delete.mjs.map
