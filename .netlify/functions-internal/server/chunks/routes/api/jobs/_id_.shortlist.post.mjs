import { d as defineEventHandler, g as getRouterParam, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
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

const _id__shortlist_post = defineEventHandler(async (event) => {
  var _a, _b;
  const db = useDB();
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing job id" });
  }
  const body = await readBody(event);
  const exists = await db.prepare("SELECT id FROM jobs WHERE id = ?").bind(id).first();
  if (!exists) {
    throw createError({ statusCode: 404, message: "Job not found" });
  }
  const status = (_a = body == null ? void 0 : body.status) != null ? _a : "saved";
  const notes = (_b = body == null ? void 0 : body.notes) != null ? _b : "";
  await db.prepare(
    `INSERT INTO shortlist (job_id, status, notes)
       VALUES (?, ?, ?)
       ON CONFLICT(job_id) DO UPDATE SET
         status = excluded.status,
         notes = excluded.notes,
         date_updated = NOW()`
  ).bind(id, status, notes).run();
  return { ok: true };
});

export { _id__shortlist_post as default };
//# sourceMappingURL=_id_.shortlist.post.mjs.map
