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
