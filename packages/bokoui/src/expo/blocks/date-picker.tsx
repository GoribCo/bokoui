import { useState } from "react";
import { Pressable, Text as RNText, type StyleProp, type ViewStyle } from "react-native";
import type { Action, Color, DateBounds, Size, WeekStart } from "@/core";
import { resolveTone } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";
import { fieldStyle } from "../internal/field";
import { useControllable } from "../internal/use-controllable";
import { Calendar } from "./calendar";
import { Modal } from "./modal";

export interface DatePickerProps extends DateBounds {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date) => void;
  placeholder?: string;
  locale?: string;
  weekStartsOn?: WeekStart;
  size?: Size;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  disabled?: boolean;
  /** Title of the dialog. Default "Choose a date". */
  title?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** A field that shows the chosen date and opens a Calendar in a dialog. Choosing a day closes it. */
export function DatePicker({ value, defaultValue = null, onValueChange, placeholder = "Select date", locale, weekStartsOn, size = "md", color = "primary", action, invalid = false, disabled = false, title = "Choose a date", accessibilityLabel, style, min, max, isDisabled }: DatePickerProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  const [date, set] = useControllable<Date | null>(value, defaultValue, onValueChange as ((v: Date | null) => void) | undefined);
  const [open, setOpen] = useState(false);
  const text = date ? date.toLocaleDateString(locale, { dateStyle: "medium" }) : placeholder;
  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: date ? text : undefined }}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[fieldStyle(tokens, c, { size, focused: open, invalid, disabled }), { justifyContent: "space-between" }, style]}
      >
        <RNText style={{ flex: 1, color: date ? tokens.fg : tokens.mutedFg, fontSize: 14 }}>{text}</RNText>
        <RNText style={{ color: tokens.mutedFg, fontSize: 16 }}>📅</RNText>
      </Pressable>
      <Modal open={open} onOpenChange={setOpen} title={title} size="sm">
        <Calendar
          value={date}
          locale={locale}
          weekStartsOn={weekStartsOn}
          color={color}
          action={action}
          min={min}
          max={max}
          isDisabled={isDisabled}
          onValueChange={(d) => {
            set(d);
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
