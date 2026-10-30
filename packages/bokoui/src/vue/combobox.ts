import { computed, defineComponent, h, nextTick, ref, useId, watch, type PropType } from "vue";
import { cn, getNextIndex, icons, inputClass, menuItemClass, popoverPanelClass, resolveTone, type Action, type Color, type InputStyleProps } from "../core";
import { Icon } from "./icon";
import { useFloating, useTopLayer } from "./floating";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const matches = (option: ComboboxOption, query: string) => option.label.toLowerCase().includes(query.trim().toLowerCase());

/**
 * Select with type-to-filter, `v-model` is the chosen option's value. Focus stays in the input;
 * the active option is announced through `aria-activedescendant`. Arrows move, Enter chooses,
 * Escape closes; leaving the field restores the chosen option's text. Other attrs go to the input.
 */
export const Combobox = defineComponent({
  name: "BokoCombobox",
  inheritAttrs: false,
  props: {
    options: { type: Array as PropType<readonly ComboboxOption[]>, required: true },
    modelValue: String,
    defaultValue: String,
    /** Shown when the typed text matches nothing. */
    emptyText: { type: String, default: "No results" },
    variant: String as PropType<InputStyleProps["variant"]>,
    size: String as PropType<InputStyleProps["size"]>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Submitted with a surrounding `<form>` through a hidden input. */
    name: String,
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    const listId = useId();
    const optionId = (i: number) => `${listId}-opt-${i}`;
    const inner = ref(props.defaultValue);
    const current = computed(() => props.modelValue ?? inner.value);
    const selected = computed(() => props.options.find((o) => o.value === current.value));
    const text = ref(selected.value?.label ?? "");
    const open = ref(false);
    const active = ref(-1);
    const input = ref<HTMLInputElement | null>(null);
    const panel = ref<HTMLElement | null>(null);
    useTopLayer(panel, open);
    const { state } = useFloating(input, panel, open, () => "bottom-start", 4);

    // When the text still equals the chosen label, show everything (like a select), else filter.
    const visible = computed(() => (text.value !== (selected.value?.label ?? "") && text.value ? props.options.filter((o) => matches(o, text.value)) : props.options));
    const enabled = computed(() => visible.value.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0));

    // Keep the field's text in step with a controlled value.
    watch(() => selected.value?.label, (label) => (text.value = label ?? ""));
    watch([open, active], async () => {
      if (!open.value || active.value < 0) return;
      await nextTick();
      document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: "nearest" });
    });

    function choose(option: ComboboxOption) {
      if (option.disabled) return;
      if (props.modelValue === undefined) inner.value = option.value;
      text.value = option.label;
      open.value = false;
      emit("update:modelValue", option.value);
    }

    function openList() {
      const idx = visible.value.findIndex((o) => o.value === current.value && !o.disabled);
      active.value = idx >= 0 ? idx : (enabled.value[0] ?? -1);
      open.value = true;
    }

    function onKeydown(event: KeyboardEvent) {
      (attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(event);
      if (event.defaultPrevented || props.disabled) return;
      if (!open.value) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          openList();
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        open.value = false;
        text.value = selected.value?.label ?? "";
      } else if (event.key === "Enter") {
        event.preventDefault();
        const option = visible.value[active.value];
        if (option) choose(option);
      } else {
        const next = getNextIndex(enabled.value.indexOf(active.value), enabled.value.length, event.key, { orientation: "vertical" });
        if (next !== undefined && event.key !== "Home" && event.key !== "End") {
          event.preventDefault();
          active.value = enabled.value[next];
        }
      }
    }

    return () => {
      const tone = props.invalid ? "danger" : resolveTone(props.color, props.action);
      const { class: cls, onKeydown: _k, onBlur, onFocus, onClick, ...rest } = attrs as Record<string, unknown>;
      return h("div", { class: "relative w-full", "data-tone": tone }, [
        h("input", {
          ...rest,
          ref: input,
          type: "text",
          role: "combobox",
          autocomplete: "off",
          "aria-autocomplete": "list",
          "aria-expanded": open.value,
          "aria-controls": open.value ? listId : undefined,
          "aria-activedescendant": open.value && active.value >= 0 ? optionId(active.value) : undefined,
          "aria-invalid": props.invalid || undefined,
          "data-tone": tone,
          disabled: props.disabled,
          value: text.value,
          class: cn(inputClass({ variant: props.variant, size: props.size, endAdornment: true }, cls as string)),
          onInput: (event: Event) => {
            const value = (event.target as HTMLInputElement).value;
            text.value = value;
            open.value = true;
            // Put the cursor on the first enabled match as the list narrows.
            active.value = props.options.filter((o) => matches(o, value)).findIndex((o) => !o.disabled);
          },
          onFocus: (event: FocusEvent) => {
            (onFocus as ((e: FocusEvent) => void) | undefined)?.(event);
            (event.currentTarget as HTMLInputElement).select();
          },
          onBlur: (event: FocusEvent) => {
            (onBlur as ((e: FocusEvent) => void) | undefined)?.(event);
            open.value = false;
            // Discard half-typed text that never became a choice.
            text.value = selected.value?.label ?? "";
          },
          onKeydown,
          onClick: (event: MouseEvent) => {
            (onClick as ((e: MouseEvent) => void) | undefined)?.(event);
            if (!open.value && !props.disabled) openList();
          },
        }),
        h("span", { "aria-hidden": "true", class: "pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground [&>svg]:size-4" }, [h(Icon, { node: icons.chevronDown })]),
        props.name && h("input", { type: "hidden", name: props.name, value: current.value ?? "" }),
        open.value &&
          h(
            "div",
            {
              ref: panel,
              id: listId,
              role: "listbox",
              "aria-label": rest["aria-label"] as string | undefined,
              popover: "manual",
              class: popoverPanelClass(),
              style: { inset: "auto", top: `${state.top}px`, left: `${state.left}px`, minWidth: `${input.value?.offsetWidth ?? 0}px`, opacity: state.ready ? 1 : 0 },
            },
            visible.value.length === 0
              ? [h("div", { role: "presentation", class: "px-2.5 py-2 text-muted-foreground" }, props.emptyText)]
              : visible.value.map((option, index) =>
                  h(
                    "div",
                    {
                      key: option.value,
                      id: optionId(index),
                      role: "option",
                      "aria-selected": option.value === current.value,
                      "aria-disabled": option.disabled || undefined,
                      "data-highlighted": index === active.value ? "" : undefined,
                      "data-tone": "primary",
                      class: menuItemClass(false, "justify-between"),
                      onMousedown: (event: MouseEvent) => event.preventDefault(),
                      onMousemove: () => !option.disabled && (active.value = index),
                      onClick: () => choose(option),
                    },
                    [h("span", { class: "truncate" }, option.label), option.value === current.value && h(Icon, { node: icons.check })],
                  ),
                ),
          ),
      ]);
    };
  },
});
