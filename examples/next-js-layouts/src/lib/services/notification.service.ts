import { endpoints } from "@/lib/contract";
import type { Notification } from "@/lib/types";
import { BaseService } from "./base.service";

export class NotificationService extends BaseService {
  list(): Promise<Notification[]> {
    return this.request(endpoints.listNotifications);
  }

  /** Marks the given notifications read (all of them when `ids` is omitted) and returns the new list. */
  markRead(ids?: string[]): Promise<Notification[]> {
    return this.request(endpoints.markNotificationsRead, { body: ids ? { ids } : {} });
  }
}
