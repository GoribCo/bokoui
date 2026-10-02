import {
  NotoSansBengali_400Regular,
  NotoSansBengali_500Medium,
  NotoSansBengali_700Bold,
} from "@expo-google-fonts/noto-sans-bengali";
import type { LocaleCode } from "@/lib/i18n/config";

/**
 * The one place that maps locales to fonts (FR-12.1). Latin text uses the platform font, which every
 * device has; Bengali gets Noto Sans Bengali so glyph shapes and weights match on every platform.
 * `fontAssets` is what `useFonts` loads; `fontFamilyFor` is what text style code asks for.
 */
export const fontAssets = {
  NotoSansBengali_400Regular,
  NotoSansBengali_500Medium,
  NotoSansBengali_700Bold,
};

export type FontWeightName = "regular" | "medium" | "bold";

const families: Partial<Record<LocaleCode, Record<FontWeightName, string>>> = {
  bn: {
    regular: "NotoSansBengali_400Regular",
    medium: "NotoSansBengali_500Medium",
    bold: "NotoSansBengali_700Bold",
  },
};

/** Font family for a locale and weight, or `undefined` for the platform font. */
export function fontFamilyFor(locale: LocaleCode, weight: FontWeightName = "regular"): string | undefined {
  return families[locale]?.[weight];
}
