import { defineComponent, h, type PropType } from "vue";
import {
  buttonClass,
  icons,
  resolveTone,
  type Action,
  type Breakpoint,
  type Color,
  type Responsive,
  type Size,
  type Variant,
} from "../core";
import { Icon } from "./icon";

export const Button = defineComponent({
  name: "BokoButton",
  inheritAttrs: false,
  props: {
    variant: String as PropType<Variant>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    /** A size, or a per-breakpoint map: `{ base: "sm", md: "lg" }` (mobile-first). */
    size: [String, Object] as PropType<Responsive<Size>>,
    iconOnly: { type: Boolean, default: false },
    /** Boolean, or per-breakpoint map: `{ base: true, md: false }`. */
    fullWidth: { type: [Boolean, Object] as PropType<boolean | Partial<Record<Breakpoint, boolean>>>, default: undefined },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { type: String as PropType<"button" | "submit" | "reset">, default: "button" },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          type: props.type,
          "data-tone": resolveTone(props.color, props.action),
          "data-loading": props.loading || undefined,
          "aria-busy": props.loading || undefined,
          disabled: props.disabled || props.loading,
          class: buttonClass(
            { variant: props.variant, size: props.size, iconOnly: props.iconOnly, fullWidth: props.fullWidth },
            attrs.class as string,
          ),
        },
        [
          props.loading
            ? h(Icon, { node: icons.loader, class: "animate-spin motion-reduce:animate-pulse" })
            : slots.leftIcon?.(),
          slots.default?.(),
          !props.loading ? slots.rightIcon?.() : undefined,
        ],
      );
  },
});
