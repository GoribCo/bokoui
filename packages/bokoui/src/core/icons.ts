import { ExternalLink, LoaderCircle } from "lucide";

/** Lucide icon data (framework-neutral). React and Vue render it as <svg>. */
export type IconNode = [tag: string, attrs: Record<string, string | number>][];

export const icons = {
  loader: LoaderCircle as IconNode,
  externalLink: ExternalLink as IconNode,
};

/** Attributes shared by every Lucide `<svg>` (24px grid, stroke icons). */
export const iconSvgAttrs = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
} as const;
