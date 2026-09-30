import { computed, defineComponent, h, onBeforeUnmount, ref, useId, watch, type PropType } from "vue";
import {
  cn,
  getNextIndex,
  icons,
  inputClass,
  isTypeaheadKey,
  menuItemClass,
  popoverPanelClass,
  resolveTone,
  typeaheadIndex,
  type Action,
  type Color,
  type InputVariant,
  type Responsive,
  type Size,
} from "../core";
import { Icon } from "./icon";
import { useFloating, useTopLayer } from "./floating";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Custom select (select-only combobox pattern) with `v-model`. Focus stays on the trigger and
 * the active option is announced through `aria-activedescendant`. Keyboard: arrows, Home/End,
 * typeahead, Enter/Space to choose, Escape to close.
 */
export const Select = defineComponent({
  name: "BokoSelect",
  inheritAttrs: false,
  props: {
    options: { type: Array as PropType<readonly SelectOption[]>, required: true },
    modelValue: String,
    placeholder: { type: String, default: "Select…" },
    variant: String as PropType<InputVariant>,
    size: [String, Object] as PropType<Responsive<Size>>,
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    /** Submitted with a surrounding `<form>` through a hidden input. */
    name: String,
    id: String,
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, emit }) {
    const listId = useId();
    const optionId = (index: number) => `${listId}-opt-${index}`;
    const open = ref(false);
    const active = ref(-1);
    const inner = ref<string | undefined>();
    const trigger = ref<HTMLElement | null>(null);
    const panel = ref<HTMLElement | null>(null);
    const query = { text: "", timer: undefined as ReturnType<typeof setTimeout> | undefined };
    const { state } = useFloating(trigger, panel, open, () => "bottom-start", 4);
    useTopLayer(panel, open);

    const current = computed(() => props.modelValue ?? inner.value);
    const selectedIndex = computed(() => props.options.findIndex((o) => o.value === current.value));
    const enabled = computed(() => props.options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0));

    function commit(index: number) {
      const option = props.options[index];
      if (!option || option.disabled) return;
      if (props.modelValue === undefined) inner.value = option.value;
      emit("update:modelValue", option.value);
    }
    function openList() {
      const s = selectedIndex.value;
      active.value = s >= 0 && !props.options[s].disabled ? s : (enabled.value[0] ?? -1);
      open.value = true;
    }
    function closeList() {
      open.value = false;
      trigger.value?.focus();
    }

    // Keep the active option visible in a long list.
    watch([open, active], () => {
      if (open.value && active.value >= 0) document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: "nearest" });
    }, { flush: "post" });

    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.value?.contains(target) && !trigger.value?.contains(target)) open.value = false;
    };
    watch(open, (v) => (v ? document.addEventListener("pointerdown", onDown) : document.removeEventListener("pointerdown", onDown)));
    onBeforeUnmount(() => document.removeEventListener("pointerdown", onDown));

    function onKeydown(event: KeyboardEvent) {
      (attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(event);
      if (event.defaultPrevented || props.disabled) return;
      const { key } = event;
      const list = enabled.value;

      if (isTypeaheadKey(event)) {
        clearTimeout(query.timer);
        query.text += key;
        query.timer = setTimeout(() => (query.text = ""), 500);
        const from = list.indexOf(open.value ? active.value : selectedIndex.value);
        const match = typeaheadIndex(list.map((i) => props.options[i].label), query.text, from);
        if (match >= 0) {
          if (open.value) active.value = list[match];
          else commit(list[match]);
        }
        return;
      }

      if (!open.value) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
          event.preventDefault();
          openList();
        }
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        closeList();
      } else if (key === "Enter" || key === " ") {
        event.preventDefault();
        commit(active.value);
        closeList();
      } else if (key === "Tab") {
        commit(active.value);
        open.value = false;
      } else {
        const next = getNextIndex(list.indexOf(active.value), list.length, key, { orientation: "vertical" });
        if (next !== undefined) {
          event.preventDefault();
          active.value = list[next];
        }
      }
    }

    return () => {
      const selected = selectedIndex.value >= 0 ? props.options[selectedIndex.value] : undefined;
      const tone = props.invalid ? "danger" : resolveTone(props.color, props.action);
      const { class: cls, onKeydown: _k, onClick: userClick, ...rest } = attrs as Record<string, unknown>;
      void _k;
      return h("div", { class: "relative w-full", "data-tone": tone }, [
        h(
          "button",
          {
            ...rest,
            ref: trigger,
            id: props.id,
            type: "button",
            role: "combobox",
            "aria-haspopup": "listbox",
            "aria-expanded": open.value,
            "aria-controls": open.value ? listId : undefined,
            "aria-activedescendant": open.value && active.value >= 0 ? optionId(active.value) : undefined,
            "aria-invalid": props.invalid || undefined,
            "aria-required": props.required || undefined,
            "data-tone": tone,
            disabled: props.disabled,
            class: cn(inputClass({ variant: props.variant, size: props.size }, "cursor-pointer justify-between gap-2 text-start"), cls as string),
            onKeydown,
            onClick: (event: MouseEvent) => {
              (userClick as ((e: MouseEvent) => void) | undefined)?.(event);
              if (event.defaultPrevented) return;
              if (open.value) open.value = false;
              else openList();
            },
          },
          [
            h("span", { class: cn("min-w-0 flex-1 truncate", !selected && "text-muted-foreground") }, selected?.label ?? props.placeholder),
            h(Icon, { node: icons.chevronDown, class: "size-4 shrink-0 text-muted-foreground" }),
          ],
        ),
        props.name && h("input", { type: "hidden", name: props.name, value: current.value ?? "" }),
        open.value &&
          h(
            "div",
            {
              ref: panel,
              id: listId,
              role: "listbox",
              "aria-label": rest["aria-label"] as string | undefined,
              "aria-labelledby": rest["aria-labelledby"] as string | undefined,
              popover: "manual",
              class: popoverPanelClass(),
              style: {
                inset: "auto",
                top: `${state.top}px`,
                left: `${state.left}px`,
                minWidth: `${trigger.value?.offsetWidth ?? 0}px`,
                opacity: state.ready ? 1 : 0,
              },
            },
            props.options.map((option, index) =>
              h(
                "div",
                {
                  key: option.value,
                  id: optionId(index),
                  role: "option",
                  "aria-selected": index === selectedIndex.value,
                  "aria-disabled": option.disabled || undefined,
                  "data-highlighted": index === active.value ? "" : undefined,
                  "data-tone": "primary",
                  class: menuItemClass(false, "justify-between"),
                  // Keep focus on the trigger; the click still registers.
                  onMousedown: (event: MouseEvent) => event.preventDefault(),
                  onMousemove: () => !option.disabled && (active.value = index),
                  onClick: () => {
                    if (option.disabled) return;
                    commit(index);
                    closeList();
                  },
                },
                [h("span", { class: "truncate" }, option.label), index === selectedIndex.value && h(Icon, { node: icons.check })],
              ),
            ),
          ),
      ]);
    };
  },
});
