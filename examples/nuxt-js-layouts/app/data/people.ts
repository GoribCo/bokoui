/** Sample people for the search; a real project searches its own directory. */
export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
}

export const people: Person[] = [
  { id: "p1", name: "Amina Rahman", role: "Chief Medical Officer", organization: "Green Valley Hospital" },
  { id: "p2", name: "Nusrat Jahan", role: "Pathologist", organization: "Green Valley Hospital" },
  { id: "p3", name: "Dr. Sadia Khan", role: "Visiting consultant", organization: "Lakeside Clinic" },
  { id: "p4", name: "Imran Hossain", role: "Pharmacist", organization: "CityCare Pharmacy" },
  { id: "p5", name: "Farhana Akter", role: "Head nurse", organization: "Green Valley Hospital" },
  { id: "p6", name: "Tanvir Ahmed", role: "Operations manager", organization: "Acme Health Solutions" },
  { id: "p7", name: "Rafiq Islam", role: "Auditor", organization: "Acme Health Solutions" },
  { id: "p8", name: "Sumaiya Chowdhury", role: "Radiologist", organization: "Lakeside Clinic" },
  { id: "p9", name: "Kamal Uddin", role: "Pharmacy technician", organization: "GreenLeaf Drugs" },
  { id: "p10", name: "Mehnaz Sultana", role: "Data analyst", organization: "Northwind Labs" },
];
