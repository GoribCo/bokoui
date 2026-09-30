import { defaultTheme, type CustomThemes, type ResolvedMode, type ThemeId } from "@/core";
import { generatedTokens } from "./tokens.generated";

/** Design tokens resolved for React Native: numbers instead of rem/px strings. */
export interface NativeTokens {
  bg: string;
  fg: string;
  surface: string;
  muted: string;
  mutedFg: string;
  border: string;
  field: string;
  fieldBorder: string;
  ring: string;
  radiusControl: number;
  radiusButton: number;
  radiusCard: number;
  borderWidth: number;
  /** 0..1: how much of the tone stays in `toneInk` (rest mixes toward fg). */
  inkTone: number;
  /** Warning is a light hue: in light mode its ink uses 45% tone to stay readable (see styles/tokens.css). */
  inkToneWarning: number;
  /** 0..1: how far a solid border mixes from the tone toward fg. */
  borderStrength: number;
  disabledOpacity: number;
  headingWeight: "400" | "500" | "600" | "700" | "800";
  headingTracking: number;
  headingTransform: "none" | "uppercase";
  textLeading: number;
  btnWeight: "400" | "500" | "600" | "700" | "800";
  btnTransform: "none" | "uppercase";
  btnTracking: number;
  hoverMix: string;
  activeMix: string;
  /** Raw token map (web values), for anything not modeled above. */
  raw: Record<string, string>;
}

export type ToneName =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";

const num = (v: string | undefined, fallback = 0) => {
  if (v === undefined) return fallback;
  const n = parseFloat(v);
  if (Number.isNaN(n)) return fallback;
  return v.trim().endsWith("rem") ? n * 16 : n;
};
const pct = (v: string | undefined, fallback: number) => (v === undefined ? fallback : parseFloat(v) / 100);
/** "0.04em" -> 0.04 (multiplied by font size at use), "normal" -> 0. */
const em = (v: string | undefined) => (v && v.endsWith("em") ? parseFloat(v) : 0);
const weight = (v: string | undefined, fallback: NativeTokens["btnWeight"]) => (v ?? fallback) as NativeTokens["btnWeight"];

export function resolveTokens(
  style: ThemeId,
  mode: ResolvedMode,
  customThemes: CustomThemes = {},
): NativeTokens & Record<ToneName | `${ToneName}Fg`, string> {
  const custom = customThemes[style];
  const baseId = custom ? (custom.base ?? defaultTheme) : style;
  const raw = {
    ...(generatedTokens[baseId] ?? generatedTokens[defaultTheme]).light,
    ...(generatedTokens[baseId] ?? generatedTokens[defaultTheme])[mode],
    ...(custom ? { ...custom.tokens, ...custom[mode] } : {}),
  } as Record<string, string>;

  const tones = (["primary", "secondary", "accent", "neutral", "success", "warning", "danger", "info"] as const).reduce(
    (acc, t) => ({ ...acc, [t]: raw[t], [`${t}Fg`]: raw[`${t}-fg`] }),
    {} as Record<ToneName | `${ToneName}Fg`, string>,
  );

  return {
    ...tones,
    bg: raw.bg,
    fg: raw.fg,
    surface: raw.surface,
    muted: raw.muted,
    mutedFg: raw["muted-fg"],
    border: raw.border,
    field: raw.field,
    fieldBorder: raw["field-border"],
    ring: raw.ring,
    radiusControl: num(raw["radius-control"]),
    radiusButton: num(raw["radius-button"]),
    radiusCard: num(raw["radius-card"]),
    borderWidth: num(raw["border-width"], 1),
    inkTone: pct(raw["ink-tone"], 0.6),
    inkToneWarning: mode === "light" ? 0.45 : pct(raw["ink-tone"], 0.6),
    borderStrength: pct(raw["border-strength"], 0),
    disabledOpacity: num(raw["disabled-opacity"], 0.5),
    headingWeight: weight(raw["heading-weight"], "600"),
    headingTracking: em(raw["heading-tracking"]),
    headingTransform: raw["heading-transform"] === "uppercase" ? "uppercase" : "none",
    textLeading: num(raw["text-leading"], 1.6),
    btnWeight: weight(raw["btn-weight"], "500"),
    btnTransform: raw["btn-transform"] === "uppercase" ? "uppercase" : "none",
    btnTracking: em(raw["btn-tracking"]),
    hoverMix: raw["hover-mix"] ?? "black 10%",
    activeMix: raw["active-mix"] ?? "black 18%",
    raw,
  };
}

export type ResolvedTokens = ReturnType<typeof resolveTokens>;

// --- color helpers (RN has no color-mix) ---

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

const toHex = (rgb: number[]) => "#" + rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

/** `weight` (0..1) of `a`, the rest `b`. Both `#rrggbb`. */
export function mix(a: string, b: string, weight: number) {
  const [x, y] = [parseHex(a), parseHex(b)];
  return toHex(x.map((v, i) => v * weight + y[i] * (1 - weight)));
}

/** `#rrggbb` + alpha 0..1 -> `rgba()`. */
export function withAlpha(color: string, alpha: number) {
  const [r, g, b] = parseHex(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Applies a token like "black 10%" / "white 14%" on top of `color`. */
export function applyMix(color: string, spec: string) {
  const [name, amount] = spec.split(/\s+/);
  const target = name === "white" ? "#ffffff" : "#000000";
  return mix(target, color, parseFloat(amount) / 100);
}
