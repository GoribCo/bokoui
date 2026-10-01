import { notifications } from "../data/notifications";
import { requireSession } from "../auth";
import { HttpError, type ApiHandler } from "../types";

/** Ids marked read since the server started. Sample state only: a real backend stores this per user. */
const readIds = new Set<string>();

const current = () => notifications.map((item) => ({ ...item, unread: item.unread && !readIds.has(item.id) }));

/** GET /notifications */
export const listNotifications: ApiHandler = (context) => {
  requireSession(context);
  return { results: current() };
};

/** POST /notifications/read with `{ ids?: string[] }`; without `ids` every notification is marked read. */
export const markNotificationsRead: ApiHandler = (context) => {
  requireSession(context);
  const ids = (context.body as { ids?: unknown } | undefined)?.ids;
  if (ids !== undefined && !(Array.isArray(ids) && ids.every((id) => typeof id === "string"))) {
    throw new HttpError(400, "`ids` must be a list of strings", "BAD_REQUEST");
  }
  for (const id of ids ?? notifications.map((item) => item.id)) readIds.add(id);
  return { results: current() };
};
