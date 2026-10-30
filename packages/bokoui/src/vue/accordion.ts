import { computed, defineComponent, h, inject, provide, ref, useId, type ComputedRef, type InjectionKey, type PropType } from "vue";
import {
  accordionClass,
  accordionContentBodyClass,
  accordionContentClass,
  accordionContentInnerClass,
  accordionItemClass,
  accordionTriggerClass,
  getNextIndex,
  icons,
  resolveTone,
  type Action,
  type Color,
} from "../core";
import { Icon } from "./icon";

interface AccordionContext {
  base: string;
  regions: ComputedRef<boolean>;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}
const accordionKey: InjectionKey<AccordionContext> = Symbol("bokoui-accordion");
const itemKey: InjectionKey<{ value: string; disabled: ComputedRef<boolean> }> = Symbol("bokoui-accordion-item");

const slug = (value: string) => value.replace(/\s+/g, "-");

/**
 * `v-model` is the open item (`type="single"`, a string) or the open items (`type="multiple"`, a string array).
 * Up/Down, Home and End move between triggers; Enter and Space toggle.
 */
export const Accordion = defineComponent({
  name: "BokoAccordion",
  inheritAttrs: false,
  props: {
    type: { type: String as PropType<"single" | "multiple">, default: "single" },
    modelValue: [String, Array] as PropType<string | string[]>,
    defaultValue: [String, Array] as PropType<string | string[]>,
    /** Single mode: allow closing the open item, leaving none open. */
    collapsible: { type: Boolean, default: true },
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    /** Give each open panel `role="region"`. Off by default: with many panels the landmarks become noise. */
    regions: { type: Boolean, default: false },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, slots, emit }) {
    const toList = (v: string | string[] | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : []);
    const inner = ref<string[]>(toList(props.defaultValue) ?? []);
    const open = computed(() => toList(props.modelValue) ?? inner.value);

    provide(accordionKey, {
      base: useId(),
      regions: computed(() => props.regions),
      isOpen: (v) => open.value.includes(v),
      toggle(item) {
        const isOpen = open.value.includes(item);
        let next: string[];
        if (props.type === "multiple") next = isOpen ? open.value.filter((v) => v !== item) : [...open.value, item];
        else next = isOpen ? (props.collapsible ? [] : open.value) : [item];
        if (props.modelValue === undefined) inner.value = next;
        emit("update:modelValue", props.type === "multiple" ? next : (next[0] ?? ""));
      },
    });

    function onKeydown(event: KeyboardEvent) {
      (attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(event);
      if (event.defaultPrevented) return;
      const triggers = Array.from((event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]:not(:disabled)"));
      const next = getNextIndex(triggers.indexOf(document.activeElement as HTMLButtonElement), triggers.length, event.key, { orientation: "vertical" });
      if (next === undefined) return;
      event.preventDefault();
      triggers[next]?.focus();
    }

    return () =>
      h("div", { ...attrs, "data-tone": resolveTone(props.color, props.action), class: accordionClass(attrs.class as string), onKeydown }, slots.default?.());
  },
});

export const AccordionItem = defineComponent({
  name: "BokoAccordionItem",
  inheritAttrs: false,
  props: { value: { type: String, required: true }, disabled: { type: Boolean, default: false } },
  setup(props, { attrs, slots }) {
    const ctx = inject(accordionKey, null);
    if (!ctx) throw new Error("<AccordionItem> must be used inside <Accordion>");
    provide(itemKey, { value: props.value, disabled: computed(() => props.disabled) });
    return () => h("div", { ...attrs, "data-state": ctx.isOpen(props.value) ? "open" : "closed", class: accordionItemClass(attrs.class as string) }, slots.default?.());
  },
});

function useItem(part: string) {
  const accordion = inject(accordionKey, null);
  const item = inject(itemKey, null);
  if (!accordion || !item) throw new Error(`<${part}> must be used inside <AccordionItem>`);
  return { accordion, item };
}

export const AccordionTrigger = defineComponent({
  name: "BokoAccordionTrigger",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const { accordion, item } = useItem("AccordionTrigger");
    return () =>
      // The heading gives screen-reader users an outline; level 3 suits most pages.
      h("h3", { class: "m-0" }, [
        h(
          "button",
          {
            ...attrs,
            type: "button",
            id: `${accordion.base}-trigger-${slug(item.value)}`,
            "data-accordion-trigger": "",
            "aria-expanded": accordion.isOpen(item.value),
            "aria-controls": `${accordion.base}-content-${slug(item.value)}`,
            disabled: item.disabled.value,
            class: accordionTriggerClass(attrs.class as string),
            onClick: (event: MouseEvent) => {
              (attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(event);
              if (!event.defaultPrevented) accordion.toggle(item.value);
            },
          },
          [slots.default?.(), h(Icon, { node: icons.chevronDown })],
        ),
      ]);
  },
});

export const AccordionContent = defineComponent({
  name: "BokoAccordionContent",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const { accordion, item } = useItem("AccordionContent");
    return () => {
      const open = accordion.isOpen(item.value);
      const { class: cls, ...rest } = attrs;
      return h(
        "div",
        {
          ...rest,
          role: accordion.regions.value ? "region" : undefined,
          id: `${accordion.base}-content-${slug(item.value)}`,
          "aria-labelledby": accordion.regions.value ? `${accordion.base}-trigger-${slug(item.value)}` : undefined,
          // Closed content stays mounted for the height animation; inert removes it from focus and AT.
          inert: !open || undefined,
          class: accordionContentClass(open),
        },
        [h("div", { class: accordionContentInnerClass }, [h("div", { class: [accordionContentBodyClass, cls] }, slots.default?.())])],
      );
    };
  },
});
