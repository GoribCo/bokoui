/** Demo records for the sample pages. Real projects replace these pages with their own content. */
export interface SampleRecord {
  id: number;
  name: string;
  department: string;
  status: "active" | "archived";
  /** ISO date. */
  updated: string;
}

const departments = ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Radiology"];
const names = ["Amina Rahman", "Karim Hossain", "Nusrat Jahan", "Tanvir Ahmed", "Farzana Islam", "Rafiq Chowdhury", "Sadia Khan"];

export const sampleRecords: SampleRecord[] = Array.from({ length: 47 }, (_, index) => ({
  id: index + 1,
  name: `${names[index % names.length]} ${Math.floor(index / names.length) + 1}`,
  department: departments[index % departments.length],
  status: index % 3 === 0 ? "archived" : "active",
  updated: new Date(Date.UTC(2026, index % 12, (index % 27) + 1)).toISOString(),
}));

export interface SampleNotification {
  id: string;
  title: string;
  body: string;
  /** Relative time, already formatted. */
  time: string;
  unread: boolean;
}

/** Demo notifications; a real project loads them from its API. */
export const sampleNotifications: SampleNotification[] = [
  { id: "n1", title: "New appointment", body: "Karim Hossain booked 10:30 tomorrow.", time: "5 min ago", unread: true },
  { id: "n2", title: "Lab result ready", body: "Blood panel for Nusrat Jahan is available.", time: "1 hour ago", unread: true },
  { id: "n3", title: "Schedule updated", body: "Your Thursday shift moved to 14:00.", time: "Yesterday", unread: false },
];
