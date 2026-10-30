import { defineComponent, h, type PropType } from "vue";
import { resolveTone, sliderClass, type Action, type Color, type SliderStyleProps } from "../core";

/** A native range input with `v-model` (a number). Label it with `FormField` or `aria-label`. */
export const Slider = defineComponent({
  name: "BokoSlider",
  inheritAttrs: false,
  props: {
    modelValue: Number,
    size: String as PropType<SliderStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    return () =>
      h("input", {
        ...attrs,
        type: "range",
        min: props.min,
        max: props.max,
        step: props.step,
        value: props.modelValue,
        "data-tone": props.invalid ? "danger" : resolveTone(props.color, props.action),
        "aria-invalid": props.invalid || undefined,
        class: sliderClass({ size: props.size }, attrs.class as string),
        onInput: (event: Event) => {
          emit("update:modelValue", Number((event.target as HTMLInputElement).value));
          (attrs.onInput as ((e: Event) => void) | undefined)?.(event);
        },
      });
  },
});
