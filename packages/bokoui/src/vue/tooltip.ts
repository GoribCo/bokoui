import { cloneVNode, defineComponent, h, onBeforeUnmount, ref, useId, watch, type PropType, type VNode } from "vue";
import { tooltipClass, type Placement } from "../core";
import { toElement, useFloating, useTopLayer } from "./floating";

/**
 * Describes its trigger (the default slot's single element) on hover and keyboard focus.
 * Text goes in `content` or the `content` slot. Escape hides it. A hint only: never put
 * essential information or controls in it.
 */
export const Tooltip = defineComponent({
  name: "BokoTooltip",
  inheritAttrs: false,
  props: {
    content: String,
    placement: { type: String as PropType<Placement>, default: "top" },
    /** Delay before showing on hover, ms. Focus shows immediately. */
    delay: { type: Number, default: 300 },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const id = useId();
    const open = ref(false);
    const anchor = ref<HTMLElement | null>(null);
    const floating = ref<HTMLElement | null>(null);
    const visible = ref(false);
    watch([open, () => props.disabled], () => (visible.value = open.value && !props.disabled), { immediate: true });
    const { state } = useFloating(anchor, floating, visible, () => props.placement);
    useTopLayer(floating, visible);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const show = (immediately: boolean) => {
      clearTimeout(timer);
      if (immediately || props.delay <= 0) open.value = true;
      else timer = setTimeout(() => (open.value = true), props.delay);
    };
    const hide = () => {
      clearTimeout(timer);
      open.value = false;
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && hide();
    watch(visible, (v) => (v ? document.addEventListener("keydown", onKey) : document.removeEventListener("keydown", onKey)));
    onBeforeUnmount(() => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    });

    return () => {
      const trigger: VNode | undefined = slots.default?.().find((node) => typeof node.type !== "symbol");
      const own = trigger?.props?.["aria-describedby"] as string | undefined;
      return [
        trigger &&
          cloneVNode(
            trigger,
            {
              ref: (el: unknown) => (anchor.value = toElement(el)),
              "aria-describedby": visible.value ? [own, id].filter(Boolean).join(" ") : own,
              onMouseenter: () => show(false),
              onMouseleave: hide,
              onFocus: () => show(true),
              onBlur: hide,
            },
            true,
          ),
        visible.value &&
          h(
            "div",
            {
              ...attrs,
              ref: floating,
              id,
              role: "tooltip",
              popover: "manual",
              "data-side": state.side,
              class: tooltipClass(attrs.class as string),
              style: { inset: "auto", top: `${state.top}px`, left: `${state.left}px`, opacity: state.ready ? 1 : 0 },
            },
            slots.content?.() ?? props.content,
          ),
      ];
    };
  },
});
