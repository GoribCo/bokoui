import { ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, CircleCheck, Ellipsis, ExternalLink, Info, LoaderCircle, Menu, Minus, PanelLeftClose, PanelLeftOpen, TriangleAlert, X } from "lucide";

/** Lucide icon data (framework-neutral). React and Vue render it as <svg>. */
export type IconNode = [tag: string, attrs: Record<string, string | number>][];

export const icons = {
  loader: LoaderCircle as IconNode,
  externalLink: ExternalLink as IconNode,
  info: Info as IconNode,
  success: CircleCheck as IconNode,
  warning: TriangleAlert as IconNode,
  danger: CircleAlert as IconNode,
  close: X as IconNode,
  check: Check as IconNode,
  chevronDown: ChevronDown as IconNode,
  minus: Minus as IconNode,
  chevronLeft: ChevronLeft as IconNode,
  chevronRight: ChevronRight as IconNode,
  ellipsis: Ellipsis as IconNode,
  menu: Menu as IconNode,
  panelClose: PanelLeftClose as IconNode,
  panelOpen: PanelLeftOpen as IconNode,
  sortAsc: ArrowUp as IconNode,
  sortDesc: ArrowDown as IconNode,
  sortNone: ArrowUpDown as IconNode,
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
