/** Sample rows for the table and filter screens; a real project loads them through a service. */
export interface SampleRecord {
  id: number;
  name: string;
  department: string;
  status: "active" | "archived";
  /** ISO date. */
  updated: string;
}

const names = ["Amina Rahman", "Nusrat Jahan", "Sadia Khan", "Imran Hossain", "Farhana Akter", "Tanvir Ahmed", "Rafiq Islam", "Sumaiya Chowdhury", "Kamal Uddin", "Mehnaz Sultana", "Karim Hossain", "Lutfa Begum"];
const departments = ["Cardiology", "Neurology", "Pharmacy", "Radiology", "Pediatrics", "Operations"];

export const sampleRecords: SampleRecord[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `${names[index % names.length]}${index >= names.length ? ` ${Math.floor(index / names.length) + 1}` : ""}`,
  department: departments[index % departments.length],
  status: index % 3 === 2 ? "archived" : "active",
  updated: new Date(Date.UTC(2026, 8, 30 - index)).toISOString().slice(0, 10),
}));
