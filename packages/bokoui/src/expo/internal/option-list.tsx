import { Pressable, ScrollView, Text as RNText, View } from "react-native";
import { useTheme } from "../theme";
import { type Tone } from "./shared";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface OptionListProps {
  options: readonly Option[];
  value: string | undefined;
  onSelect: (value: string) => void;
  tone: Tone;
  /** Shown when `options` is empty. */
  emptyText?: string;
  role?: "menu" | "list";
  maxHeight?: number;
}

/** Scrollable list of choices with a check on the selected one (Select and Combobox). */
export function OptionList({ options, value, onSelect, tone: c, emptyText, maxHeight = 260 }: OptionListProps) {
  const { tokens } = useTheme();
  if (options.length === 0) {
    return emptyText ? <RNText style={{ padding: 12, color: tokens.mutedFg, fontSize: 14 }}>{emptyText}</RNText> : null;
  }
  return (
    <ScrollView style={{ maxHeight }} keyboardShouldPersistTaps="handled">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="menuitem"
            accessibilityState={{ selected, disabled: o.disabled }}
            disabled={o.disabled}
            onPress={() => onSelect(o.value)}
            style={({ pressed }) => ({
              minHeight: 44,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              paddingHorizontal: 12,
              backgroundColor: pressed ? c.soft : selected ? c.soft : "transparent",
              opacity: o.disabled ? tokens.disabledOpacity : 1,
            })}
          >
            <RNText style={{ flexShrink: 1, color: tokens.fg, fontSize: 14, fontWeight: selected ? "600" : "400" }}>{o.label}</RNText>
            {selected ? <RNText style={{ color: c.ink, fontSize: 16 }}>✓</RNText> : <View />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
