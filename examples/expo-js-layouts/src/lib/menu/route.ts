import type { Href } from "expo-router";

const EXTERNAL = /^[a-z][a-z0-9+.-]*:/i;

/** True for `https://…`, `mailto:…` and other absolute URLs that leave the app. */
export const isExternalHref = (href: string): boolean => EXTERNAL.test(href);

/**
 * The one place a menu `href` (a string from data) becomes a route of the app. Menu data stays plain
 * strings so it can come from an API, which the typed routes of expo-router cannot check at compile time.
 */
export const toRoute = (href: string): Href => href as Href;
