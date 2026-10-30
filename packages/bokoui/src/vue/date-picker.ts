import { computed, defineComponent, h, ref, type PropType } from "vue";
import { cn, icons, inputClass, resolveTone, toISODate, type Action, type Color, type DateBounds, type InputStyleProps, type WeekStart } from "../core";
import { Calendar } from "./calendar";
import { Icon } from "./icon";
import { Popover } from "./popover";

/** A button that shows the chosen date (`v-model`) and opens a Calendar in a popover. Choosing a day closes it. */
export const DatePicker = defineComponent({
  name: "BokoDatePicker",
  inheritAttrs: false,
  props: {
    modelValue: { type: Object as PropType<Date | null>, default: undefined },
    defaultValue: { type: Object as PropType<Date | null>, default: null },
    placeholder: { type: String, default: "Pick a date" },
    locale: String,
    weekStartsOn: Number as PropType<WeekStart>,
    min: Object as PropType<DateBounds["min"]>,
    max: Object as PropType<DateBounds["max"]>,
    isDisabled: Function as PropType<DateBounds["isDisabled"]>,
    variant: String as PropType<InputStyleProps["variant"]>,
    size: String as PropType<InputStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Submitted as `YYYY-MM-DD` through a hidden input. */
    name: String,
    label: { type: String, default: "Choose date" },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    const inner = ref<Date | null>(props.defaultValue);
    const open = ref(false);
    const selected = computed(() => (props.modelValue === undefined ? inner.value : props.modelValue));

    return () => {
      const tone = props.invalid ? "danger" : resolveTone(props.color, props.action);
      const format = new Intl.DateTimeFormat(props.locale, { dateStyle: "long" });
      return h("div", { class: "relative w-full", "data-tone": tone }, [
        h(
          Popover,
          { open: open.value, "onUpdate:open": (v: boolean) => (open.value = v), placement: "bottom-start", ariaLabel: props.label, class: "p-0" },
          {
            trigger: () =>
              h(
                "button",
                {
                  ...attrs,
                  type: "button",
                  disabled: props.disabled,
                  "aria-invalid": props.invalid || undefined,
                  "aria-required": props.required || undefined,
                  "data-tone": tone,
                  class: cn(inputClass({ variant: props.variant, size: props.size }, "cursor-pointer justify-between gap-2 text-start"), attrs.class as string),
                },
                [
                  h("span", { class: cn("min-w-0 flex-1 truncate", !selected.value && "text-muted-foreground") }, selected.value ? format.format(selected.value) : props.placeholder),
                  h(Icon, { node: icons.calendar, class: "size-4 shrink-0 text-muted-foreground" }),
                ],
              ),
            default: () =>
              h(Calendar, {
                autoFocus: true,
                modelValue: selected.value,
                defaultMonth: selected.value ?? undefined,
                locale: props.locale,
                weekStartsOn: props.weekStartsOn,
                min: props.min,
                max: props.max,
                isDisabled: props.isDisabled,
                color: props.color,
                action: props.action,
                class: "border-0",
                "onUpdate:modelValue": (date: Date) => {
                  if (props.modelValue === undefined) inner.value = date;
                  emit("update:modelValue", date);
                  open.value = false;
                },
              }),
          },
        ),
        props.name && h("input", { type: "hidden", name: props.name, value: selected.value ? toISODate(selected.value) : "" }),
      ]);
    };
  },
});
