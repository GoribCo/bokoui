import { cloneVNode, defineComponent, h, inject, nextTick, onBeforeUnmount, provide, ref, useId, watch, type InjectionKey, type PropType, type VNode } from "vue";
import {
  getNextIndex,
  isTypeaheadKey,
  menuItemClass,
  menuLabelClass,
  menuSeparatorClass,
  popoverPanelClass,
  resolveTone,
  typeaheadIndex,
  type Placement,
} from "../core";
import { toElement, useFloating, useTopLayer } from "./floating";

interface MenuContext {
  close: (returnFocus?: boolean) => void;
}
const key: InjectionKey<MenuContext> = Symbol("bokoui-menu");

const ITEMS = '[role="menuitem"]:not([aria-disabled="true"])';

/**
 * Dropdown menu. The `trigger` slot holds the opening element (a Button); the default slot
 * holds `MenuItem`, `MenuSeparator` and `MenuLabel`. Arrows, Home/End and typeahead move;
 * Enter/Space select; Escape closes and returns focus to the trigger.
 */
export const Menu = defineComponent({
  name: "BokoMenu",
  inheritAttrs: false,
  props: {
    placement: { type: String as PropType<Placement>, default: "bottom-start" },
    ariaLabel: String,
  },
  setup(props, { attrs, slots }) {
    const id = useId();
    const open = ref(false);
    const anchor = ref<HTMLElement | null>(null);
    const panel = ref<HTMLElement | null>(null);
    let initialFocus: "first" | "last" = "first";
    const query = { text: "", timer: undefined as ReturnType<typeof setTimeout> | undefined };
    const { state } = useFloating(anchor, panel, open, () => props.placement, 4);
    useTopLayer(panel, open);

    const items = () => Array.from(panel.value?.querySelectorAll<HTMLElement>(ITEMS) ?? []);

    function close(returnFocus = true) {
      open.value = false;
      if (returnFocus) anchor.value?.focus();
    }
    provide(key, { close });

    // Move focus into the menu once it is positioned.
    watch(
      () => open.value && state.ready,
      async (ready) => {
        if (!ready) return;
        await nextTick();
        const list = items();
        (initialFocus === "last" ? list[list.length - 1] : list[0])?.focus();
      },
      { flush: "post" },
    );

    // Light dismiss: pointer down outside both the trigger and the panel.
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.value?.contains(target) && !anchor.value?.contains(target)) close(false);
    };
    watch(open, (v) => (v ? document.addEventListener("pointerdown", onDown) : document.removeEventListener("pointerdown", onDown)));
    onBeforeUnmount(() => document.removeEventListener("pointerdown", onDown));

    function onPanelKeydown(event: KeyboardEvent) {
      const list = items();
      const current = list.indexOf(document.activeElement as HTMLElement);
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") {
        close(false);
        return;
      }
      const next = getNextIndex(current, list.length, event.key, { orientation: "vertical" });
      if (next !== undefined) {
        event.preventDefault();
        list[next]?.focus();
        return;
      }
      if (isTypeaheadKey(event)) {
        clearTimeout(query.timer);
        query.text += event.key;
        query.timer = setTimeout(() => (query.text = ""), 500);
        const match = typeaheadIndex(list.map((el) => el.textContent ?? ""), query.text, current);
        if (match >= 0) list[match]?.focus();
      }
    }

    return () => {
      const trigger: VNode | undefined = slots.trigger?.().find((node) => typeof node.type !== "symbol");
      return [
        trigger &&
          cloneVNode(
            trigger,
            {
              ref: (el: unknown) => (anchor.value = toElement(el)),
              "aria-haspopup": "menu",
              "aria-expanded": open.value,
              "aria-controls": open.value ? id : undefined,
              onKeydown: (event: KeyboardEvent) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  initialFocus = event.key === "ArrowUp" ? "last" : "first";
                  open.value = true;
                }
              },
              onClick: () => {
                initialFocus = "first";
                open.value = !open.value;
              },
            },
            true,
          ),
        open.value &&
          h(
            "div",
            {
              ...attrs,
              ref: panel,
              id,
              role: "menu",
              "aria-label": props.ariaLabel,
              "aria-orientation": "vertical",
              popover: "manual",
              class: popoverPanelClass(attrs.class as string),
              style: { inset: "auto", top: `${state.top}px`, left: `${state.left}px`, opacity: state.ready ? 1 : 0 },
              onKeydown: onPanelKeydown,
            },
            slots.default?.(),
          ),
      ];
    };
  },
});

/** Emits `select` with the click event; call `event.preventDefault()` to keep the menu open. */
export const MenuItem = defineComponent({
  name: "BokoMenuItem",
  inheritAttrs: false,
  props: { disabled: { type: Boolean, default: false }, danger: { type: Boolean, default: false } },
  emits: ["select"],
  setup(props, { attrs, slots, emit }) {
    const menu = inject(key, null);
    if (!menu) throw new Error("<MenuItem> must be used inside <Menu>");
    return () =>
      h(
        "button",
        {
          ...attrs,
          type: "button",
          role: "menuitem",
          tabindex: -1,
          "aria-disabled": props.disabled || undefined,
          "data-tone": resolveTone("primary", props.danger ? "danger" : undefined),
          class: menuItemClass(props.danger, attrs.class as string),
          onMouseenter: (event: MouseEvent) => !props.disabled && (event.currentTarget as HTMLElement).focus(),
          onClick: (event: MouseEvent) => {
            if (props.disabled) return;
            emit("select", event);
            if (!event.defaultPrevented) menu.close();
          },
        },
        slots.default?.(),
      );
  },
});

export const MenuSeparator = defineComponent({
  name: "BokoMenuSeparator",
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h("div", { ...attrs, role: "separator", class: [menuSeparatorClass, attrs.class] });
  },
});

export const MenuLabel = defineComponent({
  name: "BokoMenuLabel",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h("div", { ...attrs, role: "presentation", class: [menuLabelClass, attrs.class] }, slots.default?.());
  },
});
