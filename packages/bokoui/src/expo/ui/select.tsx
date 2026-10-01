import { useState } from "react";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color, type Size } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";
import { fieldStyle } from "../internal/field";
import { AnchoredLayer, useAnchor } from "../internal/anchored";
import { OptionList, type Option } from "../internal/option-list";
import { useControllable } from "../internal/use-controllable";

export type SelectOption = Option;

export interface SelectProps {
  options: readonly SelectOption[];
  /** Selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown while nothing is selected. */
  placeholder?: string;
  size?: Size;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** A listbox that opens under the field. Picking an option closes it. */
export function Select({ options, value, defaultValue, onValueChange, placeholder = "Select…", size = "md", color = "primary", action, invalid = false, disabled = false, accessibilityLabel, style }: SelectProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  const [current, set] = useControllable<string | undefined>(value, defaultValue, onValueChange as ((v: string | undefined) => void) | undefined);
  const [open, setOpen] = useState(false);
  const { ref, rect, measure } = useAnchor();
  const selected = options.find((o) => o.value === current);
  return (
    <>
      <View ref={ref} collapsable={false} style={{ alignSelf: "stretch" }}>
        <Pressable
          accessibilityRole="combobox"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ expanded: open, disabled }}
          accessibilityValue={{ text: selected?.label }}
          disabled={disabled}
          onPress={() => measure(() => setOpen(true))}
          style={[fieldStyle(tokens, c, { size, focused: open, invalid, disabled }), { justifyContent: "space-between" }, style]}
        >
          <RNText numberOfLines={1} style={{ flex: 1, color: selected ? tokens.fg : tokens.mutedFg, fontSize: 14 }}>
            {selected?.label ?? placeholder}
          </RNText>
          <RNText style={{ color: tokens.mutedFg, fontSize: 12 }}>▼</RNText>
        </Pressable>
      </View>
      <AnchoredLayer visible={open} rect={rect} align="stretch" onClose={() => setOpen(false)}>
        <OptionList
          options={options}
          value={current}
          tone={c}
          onSelect={(v) => {
            set(v);
            setOpen(false);
          }}
        />
      </AnchoredLayer>
    </>
  );
}
