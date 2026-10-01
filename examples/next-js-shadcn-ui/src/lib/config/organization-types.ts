import type { IconName } from "@/lib/types";

export interface OrganizationTypeDefinition {
  /** First URL segment of the public profile: `/{segment}/{slug}`. Needs a matching folder under `app/(public)/`. */
  segment: string;
  /** Fallback name, used when the message catalog has no `organizationType.{key}` entry. */
  label: string;
  icon: IconName;
}

/**
 * Organization types. Adding a type = one entry here, one folder `app/(public)/{segment}/[slug]` and, for
 * its profile sections, one member of `OrganizationDetails` (FR-3.8). The shell itself does not change.
 */
export const organizationTypes = {
  hospital: { segment: "hospital", label: "Hospital", icon: "hospital" },
  pharmacy: { segment: "pharmacy", label: "Pharmacy", icon: "pill" },
  company: { segment: "company", label: "Company", icon: "building-2" },
} as const satisfies Record<string, OrganizationTypeDefinition>;
