import { cloneVNode, defineComponent, h, nextTick, onBeforeUnmount, ref, useId, watch, type PropType, type VNode } from "vue";
import { popoverPanelClass, type Placement } from "../core";
import { toElement, useFloating, useTopLayer } from "./floating";

const FOCUSABLE = 'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

/**
 * A non-modal panel anchored to its trigger (the `trigger` slot). The default slot is the panel
 * content: text, a form, links. Focus moves into the panel on open; Escape closes it and returns
 * focus; so does clicking outside or tabbing out. `v-model:open` is optional.
 */
export const Popover = defineComponent({
  name: "BokoPopover",
  inheritAttrs: false,
  props: {
    placement: { type: String as PropType<Placement>, default: "bottom" },
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    /** Accessible name of the panel. */
    ariaLabel: String,
  },
  emits: ["update:open"],
  setup(props, { attrs, slots, emit }) {
    const id = useId();
    const inner = ref(props.defaultOpen);
    const isOpen = ref(props.open ?? inner.value);
    watch(() => props.open ?? inner.value, (v) => (isOpen.value = v));
    const anchor = ref<HTMLElement | null>(null);
    const panel = ref<HTMLElement | null>(null);
    // Top layer first: a hidden popover has no size, so it must be shown before it is measured.
    useTopLayer(panel, isOpen);
    const { state } = useFloating(anchor, panel, isOpen, () => props.placement, 8);

    function setOpen(next: boolean, returnFocus = false) {
      if (props.open === undefined) inner.value = next;
      emit("update:open", next);
      if (!next && returnFocus) anchor.value?.focus();
    }

    watch(
      () => isOpen.value && state.ready,
      async (ready) => {
        if (!ready) return;
        await nextTick();
        const el = panel.value;
        // Content may have focused something itself (e.g. a Calendar's selected day); keep that.
        if (el?.contains(document.activeElement)) return;
        (el?.querySelector<HTMLElement>(FOCUSABLE) ?? el)?.focus();
      },
      { flush: "post" },
    );

    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.value?.contains(target) && !anchor.value?.contains(target)) setOpen(false);
    };
    watch(isOpen, (v) => (v ? document.addEventListener("pointerdown", onDown) : document.removeEventListener("pointerdown", onDown)));
    onBeforeUnmount(() => document.removeEventListener("pointerdown", onDown));

    return () => {
      const trigger: VNode | undefined = slots.trigger?.().find((node) => typeof node.type !== "symbol");
      return [
        trigger &&
          cloneVNode(
            trigger,
            {
              ref: (el: unknown) => (anchor.value = toElement(el)),
              "aria-haspopup": "dialog",
              "aria-expanded": isOpen.value,
              "aria-controls": isOpen.value ? id : undefined,
              onClick: () => setOpen(!isOpen.value),
            },
            true,
          ),
        isOpen.value &&
          h(
            "div",
            {
              ...attrs,
              ref: panel,
              id,
              role: "dialog",
              "aria-label": props.ariaLabel,
              tabindex: -1,
              popover: "manual",
              class: popoverPanelClass(["p-4 max-w-sm", attrs.class as string]),
              style: { inset: "auto", top: `${state.top}px`, left: `${state.left}px`, opacity: state.ready ? 1 : 0 },
              onKeydown: (event: KeyboardEvent) => {
                if (event.key !== "Escape") return;
                event.preventDefault();
                event.stopPropagation();
                setOpen(false, true);
              },
              // Tabbing out of a non-modal panel closes it (focus moving to the trigger is fine).
              onFocusout: (event: FocusEvent) => {
                const next = event.relatedTarget as Node | null;
                if (next && !panel.value?.contains(next) && !anchor.value?.contains(next)) setOpen(false);
              },
            },
            slots.default?.(),
          ),
      ];
    };
  },
});
