import { defineComponent, h, type PropType } from "vue";
import { badgeClass, resolveTone, type Action, type BadgeVariant, type Color, type Size } from "../core";

export const Badge = defineComponent({
  name: "BokoBadge",
  inheritAttrs: false,
  props: {
    variant: String as PropType<BadgeVariant>,
    size: String as PropType<Size>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "span",
        {
          ...attrs,
          "data-tone": resolveTone(props.color, props.action),
          class: badgeClass({ variant: props.variant, size: props.size }, attrs.class as string),
        },
        slots.default?.(),
      );
  },
});
