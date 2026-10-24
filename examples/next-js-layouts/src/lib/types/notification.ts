export type NotificationKind = "action" | "info" | "success" | "invitation";

/** One entry of the notifications panel. */
export interface Notification {
  id: string;
  /** Drives the icon and the Invitations tab: `action` needs a decision, `info` is for awareness, `success` confirms something done. */
  kind: NotificationKind;
  /** Shown under the Urgent tab. */
  urgent?: boolean;
  title: string;
  body: string;
  /** Time or relative time, already formatted. */
  time: string;
  unread: boolean;
  href?: string;
}
