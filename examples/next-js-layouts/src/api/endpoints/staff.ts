import { staffSchema } from "@/lib/schemas/staff";
import { requireSession } from "../auth";
import { HttpError, type ApiHandler } from "../types";

let nextId = 1;

/** POST /staff: validates the body and echoes it with an id. Nothing is stored. */
export const createStaff: ApiHandler = (context) => {
  requireSession(context);
  const parsed = staffSchema.safeParse(context.body);
  if (!parsed.success) throw new HttpError(422, parsed.error.issues[0]?.message ?? "Invalid staff member", "VALIDATION");
  return { status: 201, results: { id: nextId++, ...parsed.data } };
};
