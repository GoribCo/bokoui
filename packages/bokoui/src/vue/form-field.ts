import { defineComponent, h, useId, type VNode } from "vue";
import { describedBy, fieldErrorClass, fieldHintClass, formFieldClass, formFieldIds, labelClass, labelRequiredClass } from "../core";

export const Label = defineComponent({
  name: "BokoLabel",
  inheritAttrs: false,
  props: {
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h("label", { ...attrs, class: labelClass(props.disabled, attrs.class as string) }, [
        slots.default?.(),
        props.required && h("span", { "aria-hidden": "true", "data-tone": "danger", class: labelRequiredClass }, "*"),
      ]);
  },
});

/**
 * The default slot is scoped: spread `controlProps` onto the control.
 *
 *   <FormField label="Email" :error="err" v-slot="{ controlProps }"><Input v-bind="controlProps" /></FormField>
 */
export const FormField = defineComponent({
  name: "BokoFormField",
  inheritAttrs: false,
  props: {
    label: String,
    hint: String,
    error: String,
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Base id for the control and its label/hint/error. Generated when omitted. */
    id: String,
  },
  setup(props, { attrs, slots }) {
    const generated = useId();
    return () => {
      const ids = formFieldIds(props.id ?? generated);
      const invalid = Boolean(props.error || slots.error);
      const hasHint = Boolean(props.hint || slots.hint);
      const controlProps = {
        id: ids.control,
        "aria-describedby": describedBy(ids, { hint: hasHint, error: invalid }),
        invalid,
        required: props.required || undefined,
        disabled: props.disabled || undefined,
      };
      const children: (VNode | false | undefined)[] = [
        Boolean(props.label || slots.label) &&
          h(Label, { for: ids.control, required: props.required, disabled: props.disabled }, () => slots.label?.() ?? props.label),
        ...(slots.default?.({ controlProps }) ?? []),
        hasHint && h("p", { id: ids.hint, class: fieldHintClass() }, slots.hint?.() ?? props.hint),
        invalid && h("p", { id: ids.error, role: "alert", "data-tone": "danger", class: fieldErrorClass() }, slots.error?.() ?? props.error),
      ];
      return h("div", { ...attrs, class: formFieldClass(attrs.class as string) }, children);
    };
  },
});
