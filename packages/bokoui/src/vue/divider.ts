import { defineComponent, h, type PropType } from "vue";
import { dividerClass, dividerLabelledClass, dividerLineClass, type DividerOrientation } from "../core";

export const Divider = defineComponent({
  name: "BokoDivider",
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<DividerOrientation>, default: "horizontal" },
    /** Centered text on a horizontal divider. */
    label: String,
  },
  setup(props, { attrs }) {
    return () => {
      if (props.label && props.orientation === "horizontal") {
        return h(
          "div",
          { ...attrs, role: "separator", "aria-orientation": "horizontal", class: dividerLabelledClass(attrs.class as string) },
          [
            h("span", { "aria-hidden": "true", class: dividerLineClass }),
            h("span", props.label),
            h("span", { "aria-hidden": "true", class: dividerLineClass }),
          ],
        );
      }
      const cls = dividerClass(props.orientation, attrs.class as string);
      return props.orientation === "vertical"
        ? h("div", { ...attrs, role: "separator", "aria-orientation": "vertical", class: cls })
        : h("hr", { ...attrs, class: cls });
    };
  },
});
