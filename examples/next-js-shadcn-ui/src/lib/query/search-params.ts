import { parseAsInteger, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const listTabs = ["all", "active", "archived"] as const;
export type ListTab = (typeof listTabs)[number];

/** Parsers for the list pages (tabs, filter, pagination); shared by the client hook and server pages. */
export const listParamParsers = {
  tab: parseAsStringLiteral(listTabs).withDefault("all"),
  q: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};
