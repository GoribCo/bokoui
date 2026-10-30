import { defineComponent, h, type Component, type PropType } from "vue";
import {
  resolveTone,
  sidebarClass,
  sidebarItemClass,
  sidebarItemDescriptionClass,
  sidebarItemEndClass,
  sidebarItemLabelClass,
  sidebarSectionClass,
  sidebarSectionTitleClass,
  type Action,
  type Color,
} from "../core";
import { el } from "./render";

/** Vertical navigation. Compose with `SidebarSection` and `SidebarItem`. `collapsed` (an icon-only rail) comes from you; wrap items in a `Tooltip` to keep names discoverable. */
export const Sidebar = defineComponent({
  name: "BokoSidebar",
  inheritAttrs: false,
  props: {
    collapsed: { type: Boolean, default: false },
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    label: { type: String, default: "Sidebar" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "nav",
        {
          ...attrs,
          "aria-label": props.label,
          "data-tone": resolveTone(props.color, props.action),
          "data-collapsed": props.collapsed || undefined,
          class: sidebarClass(attrs.class as string),
        },
        slots.default?.(),
      );
  },
});

export const SidebarSection = defineComponent({
  name: "BokoSidebarSection",
  inheritAttrs: false,
  props: { title: String },
  setup(props, { attrs, slots }) {
    return () =>
      h("div", { ...attrs, role: "group", "aria-label": props.title, class: sidebarSectionClass(attrs.class as string) }, [
        props.title && h("div", { class: sidebarSectionTitleClass }, props.title),
        slots.default?.(),
      ]);
  },
});

/** Slots: default (label), `icon`, `end` (trailing content, e.g. a `Badge`). `as` is a link component such as `NuxtLink`. */
export const SidebarItem = defineComponent({
  name: "BokoSidebarItem",
  inheritAttrs: false,
  props: {
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Secondary line under the label (hidden when collapsed). */
    description: String,
    as: { type: [String, Object] as PropType<string | Component>, default: "a" },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const end = slots.end?.();
      return el(
        props.as,
        { ...attrs, "aria-current": props.active ? "page" : undefined, "aria-disabled": props.disabled || undefined, class: sidebarItemClass(attrs.class as string) },
        [
          slots.icon?.(),
          h("span", { class: sidebarItemLabelClass }, [slots.default?.(), props.description && h("span", { class: sidebarItemDescriptionClass }, props.description)]),
          end && h("span", { class: sidebarItemEndClass }, end),
        ],
      );
    };
  },
});
