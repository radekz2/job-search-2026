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

const _id__get = defineEventHandler(async (event) => {
  const db = useDB();
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing job id" });
  }
  const row = await db.prepare(
    `SELECT j.*,
              CASE WHEN s.job_id IS NOT NULL THEN 1 ELSE 0 END as shortlisted,
              s.status as shortlist_status, s.notes as shortlist_notes, s.date_added
       FROM jobs j
       LEFT JOIN shortlist s ON j.id = s.job_id
       WHERE j.id = ?`
  ).bind(id).first();
  if (!row) {
    throw createError({ statusCode: 404, message: "Job not found" });
  }
  return row;
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
