import { defineComponent, h, inject, onBeforeUnmount, provide, ref, shallowRef, watch, type InjectionKey, type PropType } from "vue";
import { toastItemClass, toastViewportClass, type Action, type AlertVariant, type ToastPlacement } from "../core";
import { Alert } from "./alert";
import { useTopLayer } from "./floating";

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: Action;
  variant?: AlertVariant;
  /** Milliseconds before it dismisses itself. `0` keeps it until closed. Default from the provider. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

export interface ToastApi {
  /** Shows a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id?: number) => void;
}
const key: InjectionKey<ToastApi> = Symbol("bokoui-toast");

export function useToast(): ToastApi {
  const ctx = inject(key, null);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const ToastItem = defineComponent({
  name: "BokoToastItem",
  props: {
    entry: { type: Object as PropType<ToastEntry>, required: true },
    duration: { type: Number, required: true },
    closeLabel: { type: String, required: true },
  },
  emits: ["dismiss"],
  setup(props, { emit }) {
    const paused = ref(false);
    let timer: ReturnType<typeof setTimeout> | undefined;
    watch(
      [() => props.duration, paused],
      () => {
        clearTimeout(timer);
        if (props.duration > 0 && !paused.value) timer = setTimeout(() => emit("dismiss"), props.duration);
      },
      { immediate: true },
    );
    onBeforeUnmount(() => clearTimeout(timer));
    return () =>
      h(
        "div",
        {
          class: toastItemClass,
          onMouseenter: () => (paused.value = true),
          onMouseleave: () => (paused.value = false),
          onFocusin: () => (paused.value = true),
          onFocusout: () => (paused.value = false),
        },
        [
          h(
            Alert,
            { action: props.entry.action, variant: props.entry.variant ?? "soft", title: props.entry.title, closable: true, closeLabel: props.closeLabel, onClose: () => emit("dismiss") },
            () => props.entry.description,
          ),
        ],
      );
  },
});

/** Wrap the app once, then call `useToast().toast({ title })`. Toasts announce politely (errors and warnings assertively) and pause while hovered or focused. */
export const ToastProvider = defineComponent({
  name: "BokoToastProvider",
  props: {
    placement: { type: String as PropType<ToastPlacement>, default: "bottom-right" },
    /** Default auto-dismiss delay, ms. */
    duration: { type: Number, default: 5000 },
    /** Most toasts shown at once; the oldest is dropped. */
    max: { type: Number, default: 5 },
    closeLabel: { type: String, default: "Dismiss" },
  },
  setup(props, { slots }) {
    const toasts = shallowRef<ToastEntry[]>([]);
    let nextId = 1;
    const viewport = ref<HTMLElement | null>(null);
    const hasToasts = ref(false);
    watch(toasts, (all) => (hasToasts.value = all.length > 0), { immediate: true });
    useTopLayer(viewport, hasToasts);

    const dismiss = (id?: number) => (toasts.value = id === undefined ? [] : toasts.value.filter((t) => t.id !== id));
    provide(key, {
      dismiss,
      toast(options) {
        const id = nextId++;
        toasts.value = [...toasts.value, { ...options, id }].slice(-props.max);
        return id;
      },
    });

    return () => [
      slots.default?.(),
      toasts.value.length > 0 &&
        h(
          "div",
          { ref: viewport, popover: "manual", role: "region", "aria-label": "Notifications", class: toastViewportClass(props.placement) },
          toasts.value.map((t) => h(ToastItem, { key: t.id, entry: t, duration: t.duration ?? props.duration, closeLabel: props.closeLabel, onDismiss: () => dismiss(t.id) })),
        ),
    ];
  },
});
