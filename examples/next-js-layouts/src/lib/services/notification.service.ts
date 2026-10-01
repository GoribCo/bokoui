import { z } from "zod";
import type { ApiClient } from "@/lib/api/client";
import { notificationSchema } from "@/lib/schemas";
import type { Notification } from "@/lib/types";

const listSchema = z.array(notificationSchema);

export function createNotificationService(client: ApiClient) {
  return {
    async list(): Promise<Notification[]> {
      return listSchema.parse(await client.get("/notifications"));
    },
    /** Marks the given notifications read (all of them when `ids` is omitted) and returns the new list. */
    async markRead(ids?: string[]): Promise<Notification[]> {
      return listSchema.parse(await client.post("/notifications/read", ids ? { ids } : {}));
    },
  };
}
