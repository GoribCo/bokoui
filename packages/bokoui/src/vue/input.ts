import { defineComponent, h, type PropType } from "vue";
import {
  cn,
  inputAdornmentClass,
  inputClass,
  resolveTone,
  type Action,
  type Color,
  type InputVariant,
  type Responsive,
  type Size,
} from "../core";

export const Input = defineComponent({
  name: "BokoInput",
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number], default: undefined },
    variant: String as PropType<InputVariant>,
    size: [String, Object] as PropType<Responsive<Size>>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    type: { type: String, default: "text" },
    containerClass: String,
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, slots, emit }) {
    return () => {
      const start = slots.startAdornment;
      const end = slots.endAdornment;
      const input = h("input", {
        ...attrs,
        type: props.type,
        value: props.modelValue,
        onInput: (event: Event) => {
          emit("update:modelValue", (event.target as HTMLInputElement).value);
          (attrs.onInput as ((e: Event) => void) | undefined)?.(event);
        },
        "data-tone": props.invalid ? "danger" : resolveTone(props.color, props.action),
        "aria-invalid": props.invalid || undefined,
        class: inputClass(
          { variant: props.variant, size: props.size, startAdornment: Boolean(start), endAdornment: Boolean(end) },
          attrs.class as string,
        ),
      });
      if (!start && !end) return input;
      return h("div", { class: cn("relative w-full", props.containerClass) }, [
        input,
        start && h("span", { class: inputAdornmentClass("start", props.variant) }, start()),
        end && h("span", { class: inputAdornmentClass("end", props.variant) }, end()),
      ]);
    };
  },
});
