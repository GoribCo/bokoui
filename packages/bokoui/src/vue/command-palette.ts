import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, useId, watch, type PropType, type VNodeChild } from "vue";
import { cn, getNextIndex, icons, inputClass, menuItemClass } from "../core";
import { Icon } from "./icon";
import { Modal } from "./modal";

export interface Command {
  id: string;
  label: string;
  /** Extra search words, e.g. synonyms. */
  keywords?: string;
  /** Right-aligned hint, e.g. a shortcut. */
  hint?: string;
  /** An icon vnode, e.g. `h(Icon, { node })`. */
  icon?: () => VNodeChild;
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandGroup {
  heading?: string;
  commands: readonly Command[];
}

const matches = (c: Command, q: string) => `${c.label} ${c.keywords ?? ""}`.toLowerCase().includes(q.trim().toLowerCase());

/**
 * Searchable list of actions in a dialog (Cmd/Ctrl+K), `v-model` is open. Type to filter; Up/Down move;
 * Enter runs the command and closes; Escape closes. Built on `Modal`, so focus is trapped and restored.
 */
export const CommandPalette = defineComponent({
  name: "BokoCommandPalette",
  props: {
    modelValue: { type: Boolean, default: false },
    groups: { type: Array as PropType<readonly CommandGroup[]>, required: true },
    placeholder: { type: String, default: "Type a command or search…" },
    emptyText: { type: String, default: "No results" },
    /** Letter that toggles the palette with Ctrl or Cmd (e.g. "k"). Omit to manage opening yourself. */
    hotkey: String,
    /** Accessible name of the dialog. */
    label: { type: String, default: "Command palette" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const listId = useId();
    const query = ref("");
    const active = ref(0);
    const input = ref<HTMLInputElement | null>(null);
    const optionId = (i: number) => `${listId}-opt-${i}`;

    const visible = computed(() => props.groups.map((g) => ({ ...g, commands: g.commands.filter((c) => matches(c, query.value)) })).filter((g) => g.commands.length > 0));
    const flat = computed(() => visible.value.flatMap((g) => g.commands));
    const enabled = computed(() => flat.value.map((c, i) => (c.disabled ? -1 : i)).filter((i) => i >= 0));

    const onHotkey = (event: KeyboardEvent) => {
      if (props.hotkey && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === props.hotkey.toLowerCase()) {
        event.preventDefault();
        emit("update:modelValue", !props.modelValue);
      }
    };
    onMounted(() => document.addEventListener("keydown", onHotkey));
    onBeforeUnmount(() => document.removeEventListener("keydown", onHotkey));

    watch(
      () => props.modelValue,
      async (open) => {
        if (!open) return;
        query.value = "";
        active.value = 0;
        await nextTick();
        input.value?.focus();
      },
    );
    watch(active, async () => {
      await nextTick();
      document.getElementById(optionId(active.value))?.scrollIntoView?.({ block: "nearest" });
    });

    function run(command: Command | undefined) {
      if (!command || command.disabled) return;
      emit("update:modelValue", false);
      command.onSelect();
    }

    function onKeydown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
        run(flat.value[active.value]);
        return;
      }
      const next = getNextIndex(enabled.value.indexOf(active.value), enabled.value.length, event.key, { orientation: "vertical" });
      if (next !== undefined && event.key !== "Home" && event.key !== "End") {
        event.preventDefault();
        active.value = enabled.value[next];
      }
    }

    return () => {
      let index = -1;
      return h(
        Modal,
        {
          modelValue: props.modelValue,
          "onUpdate:modelValue": (v: boolean) => emit("update:modelValue", v),
          showClose: false,
          size: "md",
          "aria-label": props.label,
          class: "mt-[10vh] mb-auto max-h-[70dvh]",
        },
        () =>
          h("div", { class: "-mx-5 -my-4 flex max-h-[70dvh] flex-col" }, [
            h("div", { class: "relative border-b border-border p-3" }, [
              h("span", { "aria-hidden": "true", class: "pointer-events-none absolute inset-y-0 start-6 flex items-center text-muted-foreground [&>svg]:size-4" }, [h(Icon, { node: icons.search })]),
              h("input", {
                ref: input,
                role: "combobox",
                "aria-expanded": "true",
                "aria-controls": listId,
                "aria-autocomplete": "list",
                "aria-activedescendant": flat.value.length ? optionId(active.value) : undefined,
                "aria-label": props.label,
                placeholder: props.placeholder,
                value: query.value,
                "data-tone": "primary",
                class: cn(inputClass({ variant: "flushed", startAdornment: true }), "border-b-0"),
                onInput: (event: Event) => {
                  query.value = (event.target as HTMLInputElement).value;
                  active.value = 0;
                },
                onKeydown,
              }),
            ]),
            h("div", { id: listId, role: "listbox", "aria-label": props.label, class: "min-h-0 flex-1 overflow-y-auto p-2" }, [
              flat.value.length === 0 && h("p", { role: "presentation", class: "px-3 py-6 text-center text-sm text-muted-foreground" }, props.emptyText),
              ...visible.value.map((group, g) =>
                h("div", { key: group.heading ?? g, role: "group", "aria-label": group.heading }, [
                  group.heading && h("div", { class: "px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase" }, group.heading),
                  ...group.commands.map((command) => {
                    const i = ++index;
                    return h(
                      "div",
                      {
                        key: command.id,
                        id: optionId(i),
                        role: "option",
                        "aria-selected": i === active.value,
                        "aria-disabled": command.disabled || undefined,
                        "data-highlighted": i === active.value ? "" : undefined,
                        "data-tone": "primary",
                        class: menuItemClass(false),
                        onMousedown: (event: MouseEvent) => event.preventDefault(),
                        onMousemove: () => !command.disabled && (active.value = i),
                        onClick: () => run(command),
                      },
                      [command.icon?.(), h("span", { class: "min-w-0 flex-1 truncate" }, command.label), command.hint && h("span", { class: "shrink-0 text-xs text-muted-foreground" }, command.hint)],
                    );
                  }),
                ]),
              ),
            ]),
          ]),
      );
    };
  },
});
