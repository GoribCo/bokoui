import { Switch as RNSwitch, Pressable, Text as RNText, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color, type Size } from "@/core";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";

export interface ToggleProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Text next to the control; the whole row is pressable. */
  label?: string;
  /** Keep `label` as the accessible name of a `Switch` but do not draw it (the row already says it). */
  hideLabel?: boolean;
  size?: Size;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const boxPx: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

function ToggleRow({
  role,
  checked,
  onCheckedChange,
  label,
  size = "md",
  color = "primary",
  action,
  invalid = false,
  disabled = false,
  style,
}: ToggleProps & { role: "checkbox" | "radio" }) {
  const { tokens } = useTheme();
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  const box = boxPx[size];
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onCheckedChange?.(role === "radio" ? true : !checked)}
      hitSlop={8}
      style={[
        { flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44, opacity: disabled ? tokens.disabledOpacity : 1 },
        style,
      ]}
    >
      <View
        style={{
          width: box,
          height: box,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: role === "radio" ? box / 2 : tokens.radiusControl / 2,
          borderWidth: tokens.borderWidth,
          borderColor: checked || invalid ? c.border : tokens.fieldBorder,
          backgroundColor: checked ? c.base : tokens.field,
        }}
      >
        {checked ? (
          role === "radio" ? (
            <View style={{ width: box * 0.4, height: box * 0.4, borderRadius: box, backgroundColor: c.fg }} />
          ) : (
            <RNText style={{ color: c.fg, fontSize: box * 0.7, lineHeight: box * 0.85, fontWeight: "700" }}>✓</RNText>
          )
        ) : null}
      </View>
      {label ? <RNText style={{ color: tokens.fg, fontSize: 14 }}>{label}</RNText> : null}
    </Pressable>
  );
}

export const Checkbox = (props: ToggleProps) => <ToggleRow role="checkbox" {...props} />;
export const Radio = (props: ToggleProps) => <ToggleRow role="radio" {...props} />;

export function Switch({ checked, onCheckedChange, label, hideLabel = false, color = "primary", action, invalid, disabled, style }: ToggleProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: 8, minHeight: 44 }, style]}>
      <RNSwitch
        accessibilityRole="switch"
        accessibilityLabel={label}
        value={checked}
        disabled={disabled}
        onValueChange={onCheckedChange}
        trackColor={{ false: tokens.muted, true: c.base }}
        thumbColor={checked ? c.fg : tokens.mutedFg}
      />
      {label && !hideLabel ? <RNText style={{ color: tokens.fg, fontFamily: tokens.fontFamily, fontSize: 14, opacity: disabled ? tokens.disabledOpacity : 1 }}>{label}</RNText> : null}
    </View>
  );
}

export interface RadioGroupProps extends ViewProps {
  orientation?: "vertical" | "horizontal";
}

/** Layout and radiogroup role for a set of `Radio`s. Own the selection state and pass `checked` to each. */
export function RadioGroup({ orientation = "vertical", style, ...props }: RadioGroupProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={[{ flexDirection: orientation === "vertical" ? "column" : "row", flexWrap: "wrap", gap: orientation === "vertical" ? 0 : 16 }, style]}
      {...props}
    />
  );
}
