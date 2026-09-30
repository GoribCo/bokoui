import { defineComponent, h, type PropType } from "vue";
import {
  headingClass,
  icons,
  linkClass,
  resolveTone,
  textClass,
  type Action,
  type Color,
  type HeadingLevel,
  type HeadingSize,
  type LinkUnderline,
  type TextVariant,
} from "../core";
import { Icon } from "./icon";

export const Heading = defineComponent({
  name: "BokoHeading",
  inheritAttrs: false,
  props: {
    /** Rendered element. Default `h2`. */
    as: { type: String as PropType<HeadingLevel>, default: "h2" },
    /** Visual size, independent of the element. Defaults from `as`. */
    size: String as PropType<HeadingSize>,
  },
  setup(props, { attrs, slots }) {
    return () => h(props.as, { ...attrs, class: headingClass(props.as, props.size, attrs.class as string) }, slots.default?.());
  },
});

export const Text = defineComponent({
  name: "BokoText",
  inheritAttrs: false,
  props: {
    variant: String as PropType<TextVariant>,
    muted: { type: Boolean, default: false },
    as: String as PropType<"p" | "span" | "div" | "label" | "small" | "code">,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as ?? (props.variant === "code" ? "code" : "p"),
        { ...attrs, class: textClass(props.variant, props.muted, attrs.class as string) },
        slots.default?.(),
      );
  },
});

/** Plain `<a>`. For a router link, apply `linkClass()` from `bokoui/core` to `<NuxtLink>`. */
export const Link = defineComponent({
  name: "BokoLink",
  inheritAttrs: false,
  props: {
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    underline: String as PropType<LinkUnderline>,
    /** Opens in a new tab with `rel="noopener noreferrer"` and shows an icon. */
    external: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "a",
        {
          ...attrs,
          ...(props.external && { target: "_blank", rel: "noopener noreferrer" }),
          "data-tone": resolveTone(props.color, props.action),
          class: linkClass(props.underline, attrs.class as string),
        },
        [
          slots.default?.(),
          props.external && h(Icon, { node: icons.externalLink }),
          props.external && h("span", { class: "sr-only" }, "(opens in a new tab)"),
        ],
      );
  },
});
