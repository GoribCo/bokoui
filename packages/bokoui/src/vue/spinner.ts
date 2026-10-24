import { defineComponent, h, type PropType } from "vue";
import { icons, resolveTone, spinnerClass, type Action, type Color, type Size } from "../core";
import { Icon } from "./icon";

export const Spinner = defineComponent({
  name: "BokoSpinner",
  inheritAttrs: false,
  props: {
    size: String as PropType<Size>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    /** Accessible text announced to screen readers. */
    label: { type: String, default: "Loading" },
  },
  setup(props, { attrs }) {
    return () =>
      h("span", { role: "status", "data-tone": resolveTone(props.color, props.action), class: "inline-flex" }, [
        h(Icon, { node: icons.loader, ...attrs, class: spinnerClass({ size: props.size }, attrs.class as string) }),
        h("span", { class: "sr-only" }, props.label),
      ]);
  },
});
