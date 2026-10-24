import { defineComponent, h, type PropType } from "vue";
import { resolveTone, textareaClass, type Action, type Color, type InputVariant, type Size, type TextareaResize } from "../core";

export const Textarea = defineComponent({
  name: "BokoTextarea",
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: undefined },
    variant: String as PropType<InputVariant>,
    size: String as PropType<Size>,
    resize: String as PropType<TextareaResize>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    rows: { type: Number, default: 3 },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    return () =>
      h("textarea", {
        ...attrs,
        rows: props.rows,
        value: props.modelValue,
        onInput: (event: Event) => {
          emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
          (attrs.onInput as ((e: Event) => void) | undefined)?.(event);
        },
        "data-tone": props.invalid ? "danger" : resolveTone(props.color, props.action),
        "aria-invalid": props.invalid || undefined,
        class: textareaClass({ variant: props.variant, size: props.size, resize: props.resize }, attrs.class as string),
      });
  },
});
