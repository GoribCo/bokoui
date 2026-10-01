import type { Organization, PublicOrganization, UserProfile } from "@/lib/types";

export const profile: UserProfile = {
  id: "user-1",
  name: "Amina Rahman",
  email: "amina.rahman@example.com",
  phone: "+880 1700 000000",
  jobTitle: "Chief Medical Officer",
  joinedAt: "2022-03-14",
};

/** One user, three organizations of different types, with different roles in each. */
export const organizations: Organization[] = [
  {
    id: "org-hospital",
    slug: "green-valley-hospital",
    name: "Green Valley Hospital",
    type: "hospital",
    roles: ["doctor", "admin"],
  },
  {
    id: "org-pharmacy",
    slug: "citycare-pharmacy",
    name: "CityCare Pharmacy",
    type: "pharmacy",
    roles: ["pharmacist"],
  },
  {
    id: "org-company",
    slug: "acme-health",
    name: "Acme Health Solutions with an Exceptionally Long Registered Name Ltd",
    type: "company",
    roles: ["manager", "auditor"],
  },
];

/** Public profiles: the user's organizations plus a few others, slugs unique within a type. */
export const publicOrganizations: PublicOrganization[] = [
  {
    id: "org-hospital",
    slug: "green-valley-hospital",
    name: "Green Valley Hospital",
    type: "hospital",
    description: "A 420-bed teaching hospital with a 24-hour emergency department.",
    city: "Dhaka",
    phone: "+880 2 5550 0100",
    website: "https://example.com/green-valley",
    details: {
      type: "hospital",
      beds: 420,
      departments: ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Radiology"],
      emergency: true,
    },
  },
  {
    id: "pub-hospital-2",
    slug: "lakeside-clinic",
    name: "Lakeside Clinic",
    type: "hospital",
    description: "Outpatient clinic focused on family medicine and diagnostics.",
    city: "Chattogram",
    details: { type: "hospital", beds: 40, departments: ["Family medicine", "Diagnostics"], emergency: false },
  },
  {
    id: "org-pharmacy",
    slug: "citycare-pharmacy",
    name: "CityCare Pharmacy",
    type: "pharmacy",
    description: "Neighborhood pharmacy with home delivery and round-the-clock service.",
    city: "Dhaka",
    phone: "+880 2 5550 0200",
    details: { type: "pharmacy", licenseNo: "PH-2041-77", open24h: true, delivery: true },
  },
  {
    id: "pub-pharmacy-2",
    slug: "greenleaf-drugs",
    name: "Greenleaf Drugs",
    type: "pharmacy",
    description: "Independent pharmacy specializing in chronic care prescriptions.",
    city: "Sylhet",
    details: { type: "pharmacy", licenseNo: "PH-1188-02", open24h: false, delivery: false },
  },
  {
    id: "org-company",
    slug: "acme-health",
    name: "Acme Health Solutions Ltd",
    type: "company",
    description: "Healthcare software and supply-chain services for hospitals and pharmacies.",
    city: "Dhaka",
    website: "https://example.com/acme-health",
    details: { type: "company", industry: "Healthcare technology", employees: 240, founded: 2011 },
  },
  {
    id: "pub-company-2",
    slug: "northwind-labs",
    name: "Northwind Labs",
    type: "company",
    description: "Diagnostic equipment manufacturer.",
    city: "Khulna",
    details: { type: "company", industry: "Medical devices", employees: 85, founded: 2016 },
  },
];
