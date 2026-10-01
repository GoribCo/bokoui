import { z } from "zod";
import { notificationSchema } from "@/lib/schemas";
import type { Notification } from "@/lib/types";
import { BaseService } from "./base.service";

const listSchema = z.array(notificationSchema);

export class NotificationService extends BaseService {
  async list(): Promise<Notification[]> {
    return listSchema.parse(await this.client.get("/notifications"));
  }

  /** Marks the given notifications read (all of them when `ids` is omitted) and returns the new list. */
  async markRead(ids?: string[]): Promise<Notification[]> {
    return listSchema.parse(await this.client.post("/notifications/read", ids ? { ids } : {}));
  }
}
