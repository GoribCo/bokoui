import { records } from "../data/records";
import { requireSession } from "../auth";
import type { ApiHandler } from "../types";

const MAX_PAGE_SIZE = 100;

/** GET /records?status=&q=&page=&pageSize= */
export const listRecords: ApiHandler = (context) => {
  requireSession(context);
  const status = context.query.get("status");
  const needle = (context.query.get("q") ?? "").trim().toLowerCase();
  const pageSize = Math.min(Math.max(Number(context.query.get("pageSize")) || 8, 1), MAX_PAGE_SIZE);

  const matches = records.filter(
    (record) =>
      (!status || status === "all" || record.status === status) && (!needle || record.name.toLowerCase().includes(needle)),
  );
  const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
  const page = Math.min(Math.max(Number(context.query.get("page")) || 1, 1), totalPages);

  return {
    results: matches.slice((page - 1) * pageSize, page * pageSize),
    meta: { total: matches.length, page, pageSize, totalPages },
  };
};
