import { useRef, useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { type Action, type Color } from "@/core";
import { useTheme } from "../theme";
import { useTone } from "../internal/shared";
import { OptionList, type Option } from "../internal/option-list";
import { useControllable } from "../internal/use-controllable";
import { Input, type InputProps } from "../ui/input";

export type ComboboxOption = Option;

export interface ComboboxProps extends Omit<InputProps, "value" | "defaultValue" | "onChangeText" | "color" | "action"> {
  options: readonly ComboboxOption[];
  /** Selected option value (controlled). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown when the typed text matches nothing. */
  emptyText?: string;
  color?: Color;
  action?: Action;
  listStyle?: StyleProp<ViewStyle>;
}

/**
 * An editable field with a list that filters as you type. The list is drawn inline under the field
 * (a native Modal would take focus from the keyboard), so it pushes the content below it down.
 */
export function Combobox({ options, value, defaultValue, onValueChange, emptyText = "No results", color = "primary", action, invalid, listStyle, onFocus, onBlur, ...props }: ComboboxProps) {
  const { tokens } = useTheme();
  const c = useTone(color, action, invalid);
  const [current, set] = useControllable<string | undefined>(value, defaultValue, onValueChange as ((v: string | undefined) => void) | undefined);
  const labelOf = (v: string | undefined) => options.find((o) => o.value === v)?.label ?? "";
  const [text, setText] = useState(labelOf(current));
  const [open, setOpen] = useState(false);
  // The blur timeout runs after a selection, so it must read the latest value, not its closure.
  const latest = useRef(current);
  latest.current = current;
  const query = text.trim().toLowerCase();
  // Show everything until the user edits away from the selected label.
  const shown = !query || text === labelOf(current) ? options : options.filter((o) => o.label.toLowerCase().includes(query));
  return (
    <View style={{ alignSelf: "stretch", gap: 4 }}>
      <Input
        {...props}
        color={color}
        action={action}
        invalid={invalid}
        value={text}
        accessibilityRole="combobox"
        accessibilityState={{ expanded: open }}
        onChangeText={(t) => {
          setText(t);
          setOpen(true);
        }}
        onFocus={(e) => {
          setOpen(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          // Pressing an option blurs the input first; let that press land before closing.
          setTimeout(() => {
            setOpen(false);
            setText(labelOf(latest.current));
          }, 150);
          onBlur?.(e);
        }}
      />
      {open ? (
        <View style={[{ borderRadius: tokens.radiusCard, borderWidth: tokens.borderWidth, borderColor: tokens.border, backgroundColor: tokens.surface, overflow: "hidden" }, listStyle]}>
          <OptionList
            options={shown}
            value={current}
            tone={c}
            emptyText={emptyText}
            maxHeight={224}
            onSelect={(v) => {
              set(v);
              setText(labelOf(v));
              setOpen(false);
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
