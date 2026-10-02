import { createElement, type SVGProps } from "react";
import { iconSvgAttrs, type IconNode } from "@/core";

/** SVG presentation attributes are kebab-case in the core data (Vue/HTML); React wants camelCase (aria and data attributes stay). */
const camel = (attrs: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(attrs).map(([k, v]) => [/^(aria|data)-/.test(k) ? k : k.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()), v]));

/** Renders a core icon (Lucide data) as an inline <svg>. */
export function Icon({ node, ...props }: { node: IconNode } & SVGProps<SVGSVGElement>) {
  return (
    <svg {...camel(iconSvgAttrs)} {...props}>
      {node.map(([tag, attrs], i) => createElement(tag, { key: i, ...camel(attrs) }))}
    </svg>
  );
}
