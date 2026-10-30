import type { Notification } from "~/utils/types";

/** Demo notifications; a real project loads them from its API. */
export const notifications: Notification[] = [
  {
    id: "n1",
    kind: "action",
    urgent: true,
    title: "Critical lab result awaiting review",
    body: "Blood panel for Nusrat Jahan was released by Pathology.",
    time: "10:42",
    unread: true,
    href: "/examples/table",
  },
  {
    id: "n2",
    kind: "action",
    title: "Schedule change needs confirmation",
    body: "Thursday shift moved from 09:00 to 14:00.",
    time: "09:15",
    unread: true,
    href: "/examples/form",
  },
  {
    id: "n5",
    kind: "invitation",
    title: "Invitation to join Clinic B",
    body: "Dr. Sadia Khan invited you as a visiting consultant.",
    time: "Mon",
    unread: true,
  },
  {
    id: "n6",
    kind: "invitation",
    title: "Grand rounds, 12 Oct",
    body: "Cardiology department, Lecture Hall 2, 08:00.",
    time: "Mon",
    unread: false,
  },
  {
    id: "n3",
    kind: "info",
    title: "Credential renewal due in 14 days",
    body: "Medical license renewal closes on 15 Oct 2026.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n4",
    kind: "success",
    title: "Appointment confirmed",
    body: "Karim Hossain, 10:30 tomorrow, Room 4.",
    time: "Yesterday",
    unread: false,
  },
];
