import { defineComponent, h, type Component, type PropType } from "vue";
import { breadcrumbCurrentClass, breadcrumbItemClass, breadcrumbLinkClass, breadcrumbListClass } from "../core";
import { el } from "./render";

export const Breadcrumb = defineComponent({
  name: "BokoBreadcrumb",
  inheritAttrs: false,
  props: { label: { type: String, default: "Breadcrumb" } },
  setup(props, { attrs, slots }) {
    return () => {
      const { class: cls, ...rest } = attrs;
      return h("nav", { ...rest, "aria-label": props.label }, [h("ol", { class: breadcrumbListClass(cls as string) }, slots.default?.())]);
    };
  },
});

/** A link (give it `href`, or `as` a router link such as `NuxtLink` with `to`), or with `current` the page you are on. */
export const BreadcrumbItem = defineComponent({
  name: "BokoBreadcrumbItem",
  inheritAttrs: false,
  props: { current: { type: Boolean, default: false }, as: [String, Object] as PropType<string | Component> },
  setup(props, { attrs, slots }) {
    return () => {
      const { class: cls, ...rest } = attrs;
      const isLink = !props.current && (props.as || "href" in attrs || "to" in attrs);
      return h(
        "li",
        { class: breadcrumbItemClass() },
        isLink
          ? el(props.as ?? "a", { ...rest, class: breadcrumbLinkClass(cls as string) }, slots.default?.())
          : h("span", { ...rest, "aria-current": props.current ? "page" : undefined, class: props.current ? breadcrumbCurrentClass(cls as string) : cls }, slots.default?.()),
      );
    };
  },
});
