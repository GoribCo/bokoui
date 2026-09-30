import { computed, defineComponent, h, inject, provide, ref, useId, type ComputedRef, type InjectionKey, type PropType } from "vue";
import {
  getNextIndex,
  resolveTone,
  tabClass,
  tabListClass,
  tabPanelClass,
  tabsRootClass,
  type Action,
  type Color,
  type TabsOrientation,
  type TabsVariant,
} from "../core";

interface TabsContext {
  value: ComputedRef<string | undefined>;
  select: (value: string) => void;
  base: string;
  variant: ComputedRef<TabsVariant | undefined>;
  orientation: ComputedRef<TabsOrientation>;
}

const key: InjectionKey<TabsContext> = Symbol("bokoui-tabs");

function useTabs(part: string) {
  const ctx = inject(key, null);
  if (!ctx) throw new Error(`<${part}> must be used inside <Tabs>`);
  return ctx;
}

const slug = (value: string) => value.replace(/\s+/g, "-");

/** `<Tabs v-model="tab"><TabList><Tab value="a">A</Tab></TabList><TabPanel value="a">…</TabPanel></Tabs>` */
export const Tabs = defineComponent({
  name: "BokoTabs",
  inheritAttrs: false,
  props: {
    modelValue: String,
    defaultValue: String,
    variant: String as PropType<TabsVariant>,
    orientation: { type: String as PropType<TabsOrientation>, default: "horizontal" },
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, slots, emit }) {
    const inner = ref(props.defaultValue);
    const value = computed(() => props.modelValue ?? inner.value);
    provide(key, {
      value,
      select(next) {
        if (props.modelValue === undefined) inner.value = next;
        emit("update:modelValue", next);
      },
      base: useId(),
      variant: computed(() => props.variant),
      orientation: computed(() => props.orientation),
    });
    return () =>
      h(
        "div",
        { ...attrs, "data-tone": resolveTone(props.color, props.action), class: tabsRootClass(props.orientation, attrs.class as string) },
        slots.default?.(),
      );
  },
});

export const TabList = defineComponent({
  name: "BokoTabList",
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const ctx = useTabs("TabList");
    function onKeydown(event: KeyboardEvent) {
      (attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(event);
      if (event.defaultPrevented) return;
      const root = event.currentTarget as HTMLElement;
      const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
      const next = getNextIndex(tabs.indexOf(document.activeElement as HTMLButtonElement), tabs.length, event.key, {
        orientation: ctx.orientation.value,
        rtl: getComputedStyle(root).direction === "rtl",
      });
      if (next === undefined) return;
      event.preventDefault();
      // Automatic activation: focusing a tab selects it.
      tabs[next]?.focus();
      tabs[next]?.click();
    }
    return () =>
      h(
        "div",
        {
          ...attrs,
          role: "tablist",
          "aria-orientation": ctx.orientation.value,
          class: tabListClass({ variant: ctx.variant.value, orientation: ctx.orientation.value }, attrs.class as string),
          onKeydown,
        },
        slots.default?.(),
      );
  },
});

export const Tab = defineComponent({
  name: "BokoTab",
  inheritAttrs: false,
  props: { value: { type: String, required: true }, disabled: { type: Boolean, default: false } },
  setup(props, { attrs, slots }) {
    const ctx = useTabs("Tab");
    return () => {
      const active = ctx.value.value === props.value;
      return h(
        "button",
        {
          ...attrs,
          type: "button",
          role: "tab",
          id: `${ctx.base}-tab-${slug(props.value)}`,
          disabled: props.disabled,
          "aria-selected": active,
          "aria-controls": `${ctx.base}-panel-${slug(props.value)}`,
          // Roving tabindex: only the active tab is in the tab order; arrows move between tabs.
          tabindex: active ? 0 : -1,
          class: tabClass({ variant: ctx.variant.value, orientation: ctx.orientation.value }, attrs.class as string),
          onClick: (event: MouseEvent) => {
            (attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(event);
            if (!event.defaultPrevented) ctx.select(props.value);
          },
        },
        slots.default?.(),
      );
    };
  },
});

export const TabPanel = defineComponent({
  name: "BokoTabPanel",
  inheritAttrs: false,
  props: { value: { type: String, required: true } },
  setup(props, { attrs, slots }) {
    const ctx = useTabs("TabPanel");
    return () =>
      h(
        "div",
        {
          ...attrs,
          role: "tabpanel",
          id: `${ctx.base}-panel-${slug(props.value)}`,
          "aria-labelledby": `${ctx.base}-tab-${slug(props.value)}`,
          hidden: ctx.value.value !== props.value,
          tabindex: 0,
          class: tabPanelClass(attrs.class as string),
        },
        slots.default?.(),
      );
  },
});
