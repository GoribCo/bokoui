import { Button } from "bokoui/expo/ui";
import { ScrollView, View } from "react-native";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedChipsProps<T extends string> {
  options: readonly ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  /** Scroll sideways instead of wrapping (long lists such as the design styles). */
  scroll?: boolean;
}

/** A row of mutually exclusive choices; the chosen one is filled. */
export function SegmentedChips<T extends string>({ options, value, onChange, label, scroll = false }: SegmentedChipsProps<T>) {
  const chips = options.map((option) => (
    <Button
      key={option.value}
      size="sm"
      color="neutral"
      variant={option.value === value ? "solid" : "outline"}
      accessibilityRole="radio"
      accessibilityState={{ selected: option.value === value }}
      onPress={() => onChange(option.value)}
    >
      {option.label}
    </Button>
  ));
  return scroll ? (
    <ScrollView horizontal accessibilityLabel={label} accessibilityRole="radiogroup" showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {chips}
    </ScrollView>
  ) : (
    <View accessibilityLabel={label} accessibilityRole="radiogroup" style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {chips}
    </View>
  );
}
