import { organizationTypes } from "@/lib/config/organization-types";
import { MIN_SEARCH_LENGTH, searchScopes } from "@/lib/config/search";
import type { SearchResult } from "@/lib/schemas/search";
import { publicOrganizationPath } from "@/lib/organization/organization-types";
import { people } from "../data/people";
import { publicOrganizations } from "../data/organizations";
import { requireSession } from "../auth";
import { HttpError, type ApiHandler } from "../types";

const MAX_RESULTS = 8;

const typeForScope = { hospitals: "hospital", pharmacies: "pharmacy" } as const;

/** GET /search?scope=people|organizations|hospitals|pharmacies&q=... */
export const search: ApiHandler = (context) => {
  requireSession(context);
  const scope = context.query.get("scope") ?? "";
  if (scope === "menu" || !(searchScopes as readonly string[]).includes(scope)) {
    throw new HttpError(422, `Unknown search scope "${scope}"`, "VALIDATION", "scope");
  }
  const needle = (context.query.get("q") ?? "").trim().toLowerCase();
  if (needle.length < MIN_SEARCH_LENGTH) return { results: [] };

  let results: SearchResult[];
  if (scope === "people") {
    results = people
      .filter((person) => `${person.name} ${person.role} ${person.organization}`.toLowerCase().includes(needle))
      .map((person) => ({ id: person.id, title: person.name, subtitle: `${person.role}, ${person.organization}` }));
  } else {
    const type = scope === "organizations" ? undefined : typeForScope[scope as keyof typeof typeForScope];
    results = publicOrganizations
      .filter((org) => (!type || org.type === type) && `${org.name} ${org.city}`.toLowerCase().includes(needle))
      .map((org) => ({
        id: org.id,
        title: org.name,
        subtitle: `${organizationTypes[org.type].label}, ${org.city}`,
        href: publicOrganizationPath(org),
      }));
  }
  return { results: results.slice(0, MAX_RESULTS) };
};
