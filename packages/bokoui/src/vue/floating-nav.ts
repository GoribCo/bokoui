import { defineComponent, h, type Component, type PropType } from "vue";
import { floatingNavClass, floatingNavItemClass, floatingNavListClass, floatingNavListItemClass } from "../core";
import { el } from "./render";

/** Floating pill navigation for phones. Hide it from wide screens with a class, e.g. `class="md:hidden"`. */
export const FloatingNav = defineComponent({
  name: "BokoFloatingNav",
  inheritAttrs: false,
  props: {
    /** Pin the bar above the bottom edge and the safe area. */
    fixed: { type: Boolean, default: true },
    label: { type: String, default: "Main" },
  },
  setup(props, { attrs, slots }) {
    return () => h("nav", { ...attrs, "aria-label": props.label, class: floatingNavClass(props.fixed, attrs.class as string) }, [h("ul", { class: floatingNavListClass }, slots.default?.())]);
  },
});

/** The icon goes in the default slot; it has no text, so give it an `aria-label`. `as` is a link component or `button`. */
export const FloatingNavItem = defineComponent({
  name: "BokoFloatingNavItem",
  inheritAttrs: false,
  props: { active: { type: Boolean, default: false }, as: { type: [String, Object] as PropType<string | Component>, default: "a" } },
  setup(props, { attrs, slots }) {
    return () =>
      h("li", { class: floatingNavListItemClass }, [
        el(props.as, { ...attrs, "aria-current": props.active ? "page" : undefined, class: floatingNavItemClass(attrs.class as string) }, slots.default?.()),
      ]);
  },
});
