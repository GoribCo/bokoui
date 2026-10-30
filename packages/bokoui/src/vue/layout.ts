import { defineComponent, h, type PropType } from "vue";
import {
  containerClass,
  gridClass,
  inlineClass,
  stackClass,
  type ContainerStyleProps,
  type GridStyleProps,
  type InlineStyleProps,
  type StackStyleProps,
} from "../core";

const as = { type: String as PropType<string>, default: "div" };

/** Children in a column with a gap. `as` sets the element (`ul`, `section`, `nav`…). */
export const Stack = defineComponent({
  name: "BokoStack",
  inheritAttrs: false,
  props: { as, gap: [Number, String] as PropType<StackStyleProps["gap"]>, align: String as PropType<StackStyleProps["align"]> },
  setup(props, { attrs, slots }) {
    return () => h(props.as, { ...attrs, class: stackClass({ gap: props.gap, align: props.align }, attrs.class as string) }, slots.default?.());
  },
});

/** Children in a wrapping row with a gap: button rows, tag lists, toolbars. */
export const Inline = defineComponent({
  name: "BokoInline",
  inheritAttrs: false,
  props: {
    as,
    gap: [Number, String] as PropType<InlineStyleProps["gap"]>,
    align: String as PropType<InlineStyleProps["align"]>,
    justify: String as PropType<InlineStyleProps["justify"]>,
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(props.as, { ...attrs, class: inlineClass({ gap: props.gap, align: props.align, justify: props.justify }, attrs.class as string) }, slots.default?.());
  },
});

/** Centers content with a max width and responsive side padding. */
export const Container = defineComponent({
  name: "BokoContainer",
  inheritAttrs: false,
  props: { as, size: String as PropType<ContainerStyleProps["size"]> },
  setup(props, { attrs, slots }) {
    return () => h(props.as, { ...attrs, class: containerClass({ size: props.size }, attrs.class as string) }, slots.default?.());
  },
});

/** Responsive columns. */
export const Grid = defineComponent({
  name: "BokoGrid",
  inheritAttrs: false,
  props: { as, gap: [Number, String] as PropType<GridStyleProps["gap"]>, cols: [Number, String, Object] as PropType<GridStyleProps["cols"]> },
  setup(props, { attrs, slots }) {
    return () => h(props.as, { ...attrs, class: gridClass({ gap: props.gap, cols: props.cols }, attrs.class as string) }, slots.default?.());
  },
});
