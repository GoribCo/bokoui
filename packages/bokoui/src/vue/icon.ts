import { defineComponent, h, type PropType } from "vue";
import { iconSvgAttrs, type IconNode } from "../core";

/** Renders a core icon (Lucide data) as an inline <svg>. */
export const Icon = defineComponent({
  name: "BokoIcon",
  props: { node: { type: Array as PropType<IconNode>, required: true } },
  setup(props, { attrs }) {
    return () => h("svg", { ...iconSvgAttrs, ...attrs }, props.node.map(([tag, a]) => h(tag, a)));
  },
});
