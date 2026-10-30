import { defineComponent, h, onBeforeUnmount, ref, useId, watch, type Component, type PropType } from "vue";
import {
  cn,
  icons,
  navbarActionsClass,
  navbarBrandClass,
  navbarClass,
  navbarInnerClass,
  navbarLinkClass,
  navbarLinksClass,
  navbarToggleClass,
  resolveTone,
  type Action,
  type Color,
} from "../core";
import { el } from "./render";
import { Icon } from "./icon";

/** Slots: `brand` (usually a `NavbarBrand`), default (`NavbarLink`s, collapsed behind a menu button on small screens), `actions` (always visible). */
export const Navbar = defineComponent({
  name: "BokoNavbar",
  inheritAttrs: false,
  props: {
    sticky: { type: Boolean, default: undefined },
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    label: { type: String, default: "Main" },
    menuLabel: { type: String, default: "Menu" },
  },
  setup(props, { attrs, slots }) {
    const linksId = useId();
    const open = ref(false);
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && (open.value = false);
    watch(open, (v) => (v ? document.addEventListener("keydown", onKey) : document.removeEventListener("keydown", onKey)));
    onBeforeUnmount(() => document.removeEventListener("keydown", onKey));

    return () => {
      const actions = slots.actions?.();
      return h("header", { ...attrs, "data-tone": resolveTone(props.color, props.action), class: navbarClass(props.sticky, attrs.class as string) }, [
        h("nav", { "aria-label": props.label, class: navbarInnerClass }, [
          slots.brand?.(),
          h(
            "ul",
            {
              id: linksId,
              class: navbarLinksClass(open.value),
              // A link press on a small screen should close the menu.
              onClick: (event: MouseEvent) => (event.target as HTMLElement).closest("a") && (open.value = false),
            },
            slots.default?.(),
          ),
          actions && h("div", { class: navbarActionsClass() }, actions),
          h(
            "button",
            {
              type: "button",
              "aria-label": props.menuLabel,
              "aria-expanded": open.value,
              "aria-controls": linksId,
              // With actions, they take the free space (ms-auto); otherwise the button does.
              class: cn(navbarToggleClass, !actions && "ms-auto"),
              onClick: () => (open.value = !open.value),
            },
            [h(Icon, { node: open.value ? icons.close : icons.menu })],
          ),
        ]),
      ]);
    };
  },
});

const linkProp = { type: [String, Object] as PropType<string | Component>, default: "a" };

export const NavbarBrand = defineComponent({
  name: "BokoNavbarBrand",
  inheritAttrs: false,
  props: { as: linkProp },
  setup(props, { attrs, slots }) {
    return () => el(props.as, { ...attrs, class: navbarBrandClass(attrs.class as string) }, slots.default?.());
  },
});

export const NavbarLink = defineComponent({
  name: "BokoNavbarLink",
  inheritAttrs: false,
  props: { active: { type: Boolean, default: false }, as: linkProp },
  setup(props, { attrs, slots }) {
    return () => h("li", [el(props.as, { ...attrs, "aria-current": props.active ? "page" : undefined, class: navbarLinkClass(attrs.class as string) }, slots.default?.())]);
  },
});
