import { defineComponent, h, type PropType } from "vue";
import { cardClass, cardFooterClass, cardHeaderClass, type CardPadding, type CardVariant } from "../core";

export const Card = defineComponent({
  name: "BokoCard",
  inheritAttrs: false,
  props: {
    variant: String as PropType<CardVariant>,
    padding: String as PropType<CardPadding>,
    interactive: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "div",
        { ...attrs, class: cardClass({ variant: props.variant, padding: props.padding, interactive: props.interactive }, attrs.class as string) },
        slots.default?.(),
      );
  },
});

export const CardHeader = defineComponent({
  name: "BokoCardHeader",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h("div", { ...attrs, class: cardHeaderClass(attrs.class as string) }, slots.default?.());
  },
});

export const CardFooter = defineComponent({
  name: "BokoCardFooter",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h("div", { ...attrs, class: cardFooterClass(attrs.class as string) }, slots.default?.());
  },
});
