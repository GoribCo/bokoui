import { h, type Component, type VNodeArrayChildren } from "vue";

/** `h` for a tag that is either an element name or a component (e.g. `NuxtLink`): components take a default-slot function. */
export function el(type: string | Component, props: Record<string, unknown>, children: VNodeArrayChildren | undefined) {
  return typeof type === "string" ? h(type, props, children) : h(type, props, { default: () => children });
}
