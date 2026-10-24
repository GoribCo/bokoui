import { nextTick, onBeforeUnmount, reactive, watch, type Ref } from "vue";
import { computePosition, type Placement, type Side } from "../core";

/** Vue counterpart of the React `useFloating`/`useTopLayer` hooks; same pure core logic. */

export interface FloatingState {
  top: number;
  left: number;
  side: Side;
  /** False until the first measurement, so the element stays invisible (no flash at 0,0). */
  ready: boolean;
}

/** The DOM element behind a template ref, whether it holds an element or a component instance. */
export function toElement(value: unknown): HTMLElement | null {
  if (!value) return null;
  const maybe = value as { $el?: unknown };
  return (maybe.$el ?? value) as HTMLElement;
}

export function useFloating(
  anchor: Ref<HTMLElement | null>,
  floating: Ref<HTMLElement | null>,
  open: Ref<boolean>,
  placement: () => Placement,
  offset = 8,
) {
  const state = reactive<FloatingState>({ top: 0, left: 0, side: "bottom", ready: false });

  function update() {
    const a = anchor.value;
    const f = floating.value;
    if (!a || !f) return;
    const rect = a.getBoundingClientRect();
    const next = computePosition({
      anchor: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      floating: { width: f.offsetWidth, height: f.offsetHeight },
      viewport: { width: window.innerWidth, height: window.innerHeight },
      placement: placement(),
      offset,
    });
    state.top = next.top;
    state.left = next.left;
    state.side = next.side;
    state.ready = true;
  }

  function stop() {
    // The immediate watcher below also runs during server rendering, where there is no window.
    if (typeof window === "undefined") return;
    window.removeEventListener("resize", update);
    window.removeEventListener("scroll", update, true);
  }

  watch(
    open,
    async (isOpen) => {
      stop();
      if (!isOpen || typeof window === "undefined") {
        state.ready = false;
        return;
      }
      await nextTick();
      update();
      window.addEventListener("resize", update);
      window.addEventListener("scroll", update, true);
    },
    { flush: "post", immediate: true },
  );
  onBeforeUnmount(stop);

  return { state, update };
}

/** Promotes a `popover="manual"` element to the top layer while it is rendered, where supported. */
export function useTopLayer(el: Ref<HTMLElement | null>, open: Ref<boolean>) {
  watch(
    [el, open],
    ([node, isOpen]) => {
      if (node && isOpen && typeof node.showPopover === "function") {
        try {
          node.showPopover();
        } catch {
          // Already showing.
        }
      }
    },
    { flush: "post", immediate: true },
  );
}
