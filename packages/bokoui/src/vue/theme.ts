import { computed, defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type PropType } from "vue";
import {
  applyTheme,
  cn,
  modes,
  normalizeMode,
  normalizeStyle,
  readMode,
  readStyle,
  subscribeStorage,
  subscribeSystem,
  systemPrefersDark,
  themes,
  writeMode,
  writeStyle,
  type CustomThemes,
  type ResolvedMode,
  type ThemeId,
  type ThemeMode,
} from "@/core";
import { Button } from "./button";

// Client-only state. Server render and first client render use the defaults (no hydration
// mismatch); ThemeProvider syncs from storage after mount. ThemeScript already painted the
// saved theme, so there is no visual flash.
const style = ref<ThemeId>("flat");
const mode = ref<ThemeMode>("system");
const systemDark = ref(false);
const custom = ref<CustomThemes>({});
let applied = false;

const resolvedMode = computed<ResolvedMode>(() =>
  mode.value === "system" ? (systemDark.value ? "dark" : "light") : mode.value,
);
const options = computed(() => [
  ...themes,
  ...Object.entries(custom.value).map(([id, t]) => ({ id, label: t.label })),
]);

function sync() {
  style.value = normalizeStyle(readStyle(), options.value.map((o) => o.id));
  mode.value = normalizeMode(readMode());
  systemDark.value = systemPrefersDark();
}

export function useTheme() {
  return {
    style,
    mode,
    resolvedMode,
    themes: options,
    setStyle: (next: ThemeId) => writeStyle(next),
    setMode: (next: ThemeMode) => writeMode(next),
  };
}

/** Wrap the app once. Pass `customThemes` (stable reference) for user-defined styles. */
export const ThemeProvider = defineComponent({
  name: "BokoThemeProvider",
  props: { customThemes: { type: Object as PropType<CustomThemes>, default: () => ({}) } },
  setup(props, { slots }) {
    custom.value = props.customThemes;
    let stops: (() => void)[] = [];
    onBeforeUnmount(() => stops.forEach((stop) => stop()));
    onMounted(() => {
      sync();
      stops = [subscribeStorage(sync), subscribeSystem(sync)];
      watch(
        [style, resolvedMode, custom],
        () => {
          applyTheme(style.value, resolvedMode.value, custom.value, applied);
          applied = true;
        },
        { immediate: true },
      );
    });
    return () => slots.default?.();
  },
});

const modeLabels = { light: "Light", dark: "Dark", system: "System" } as const;

export const ThemeSwitcher = defineComponent({
  name: "BokoThemeSwitcher",
  inheritAttrs: false,
  setup(_, { attrs }) {
    const t = useTheme();
    return () =>
      h("div", { class: cn("flex flex-wrap items-center gap-3", attrs.class as string) }, [
        h("label", { class: "flex items-center gap-2 text-sm" }, [
          h("span", { class: "text-muted-foreground" }, "Style"),
          h(
            "select",
            {
              value: t.style.value,
              onChange: (event: Event) => t.setStyle((event.target as HTMLSelectElement).value),
              class:
                "focus-ring h-8 rounded-control border-[length:var(--bokoui-border-width)] border-field-border bg-field px-2 text-sm text-foreground",
            },
            t.themes.value.map((theme) =>
              h("option", { key: theme.id, value: theme.id, selected: theme.id === t.style.value }, theme.label),
            ),
          ),
        ]),
        h(
          "div",
          { role: "group", "aria-label": "Color mode", class: "flex gap-1" },
          modes.map((m) =>
            h(
              Button,
              {
                key: m,
                size: "sm",
                color: "neutral",
                variant: t.mode.value === m ? "solid" : "outline",
                "aria-pressed": t.mode.value === m,
                onClick: () => t.setMode(m),
              },
              { default: () => modeLabels[m] },
            ),
          ),
        ),
      ]);
  },
});
