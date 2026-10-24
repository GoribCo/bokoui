/**
 * Content areas the header search can look in. `menu` is answered in the browser from the loaded menu;
 * every other scope is answered by `GET /search?scope=...&q=...`. Add a scope here, handle it in the API,
 * and add `search.scope.{id}` to the message catalogs.
 */
export const searchScopes = ["menu", "people", "organizations", "hospitals", "pharmacies"] as const;

export type SearchScope = (typeof searchScopes)[number];

/** Scopes the API answers. */
export type RemoteSearchScope = Exclude<SearchScope, "menu">;

export const defaultSearchScope: SearchScope = "menu";

/** Fewer characters than this do not search. */
export const MIN_SEARCH_LENGTH = 2;

export const isRemoteScope = (scope: SearchScope): scope is RemoteSearchScope => scope !== "menu";
