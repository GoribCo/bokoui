import { defineComponent, h, type PropType } from "vue";
import {
  checkboxCheckClass,
  checkboxClass,
  checkboxMinusClass,
  icons,
  radioClass,
  radioDotClass,
  radioGroupClass,
  resolveTone,
  switchClass,
  toggleLabelTextClass,
  toggleWrapperClass,
  type Action,
  type Color,
  type Size,
} from "../core";
import { Icon } from "./icon";

const shared = {
  size: String as PropType<Size>,
  color: { type: String as PropType<Color>, default: "primary" },
  action: String as PropType<Action>,
  invalid: { type: Boolean, default: false },
};

/** The label slot holds the text next to the control; it makes the whole row clickable. */
function toggle(name: string, type: "checkbox" | "radio", kind: "checkbox" | "radio" | "switch") {
  return defineComponent({
    name,
    inheritAttrs: false,
    props:
      type === "radio"
        ? { ...shared, modelValue: { type: [String, Number, Boolean], default: undefined }, value: { type: [String, Number, Boolean], default: undefined } }
        : { ...shared, modelValue: { type: Boolean, default: false } },
    emits: ["update:modelValue"],
    setup(props, { attrs, slots, emit }) {
      return () => {
        const label = slots.default?.();
        const { class: cls, ...rest } = attrs;
        const tone = props.invalid ? "danger" : resolveTone(props.color, props.action);
        const isRadio = kind === "radio";
        const input = h("input", {
          ...rest,
          type,
          role: kind === "switch" ? "switch" : undefined,
          value: isRadio ? (props as { value?: string | number | boolean }).value : undefined,
          checked: isRadio ? props.modelValue === (props as { value?: unknown }).value : Boolean(props.modelValue),
          "aria-invalid": props.invalid || undefined,
          class: (kind === "checkbox" ? checkboxClass : kind === "radio" ? radioClass : switchClass)({ size: props.size }),
          onChange: (event: Event) => {
            const el = event.target as HTMLInputElement;
            emit("update:modelValue", isRadio ? (props as { value?: unknown }).value : el.checked);
          },
        });
        const control =
          kind === "switch"
            ? input
            : h("span", { class: "relative inline-flex" }, [
                input,
                ...(kind === "checkbox"
                  ? [
                      h(Icon, { node: icons.check, "stroke-width": 3, class: checkboxCheckClass }),
                      h(Icon, { node: icons.minus, "stroke-width": 3, class: checkboxMinusClass }),
                    ]
                  : [h("span", { "aria-hidden": "true", class: radioDotClass })]),
              ]);
        return h(
          label ? "label" : "span",
          { "data-tone": tone, class: toggleWrapperClass(Boolean(label), cls as string) },
          [control, label && h("span", { class: toggleLabelTextClass }, label)],
        );
      };
    },
  });
}

export const Checkbox = toggle("BokoCheckbox", "checkbox", "checkbox");
export const Radio = toggle("BokoRadio", "radio", "radio");
export const Switch = toggle("BokoSwitch", "checkbox", "switch");

export const RadioGroup = defineComponent({
  name: "BokoRadioGroup",
  inheritAttrs: false,
  props: { orientation: { type: String as PropType<"vertical" | "horizontal">, default: "vertical" } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        "div",
        { ...attrs, role: "radiogroup", "aria-orientation": props.orientation, class: radioGroupClass(props.orientation, attrs.class as string) },
        slots.default?.(),
      );
  },
});
