import { cloneElement, type ReactElement } from "react";
import { Text as RNText, View, type StyleProp, type TextProps as RNTextProps, type ViewStyle } from "react-native";
import { useTheme } from "../theme";
import { tone } from "../internal/shared";

export interface LabelProps extends RNTextProps {
  required?: boolean;
  disabled?: boolean;
}

export function Label({ required, disabled, children, style, ...props }: LabelProps) {
  const { tokens } = useTheme();
  return (
    <RNText
      style={[{ color: tokens.fg, fontSize: 14, fontWeight: "500", opacity: disabled ? tokens.disabledOpacity : 1 }, style]}
      {...props}
    >
      {children}
      {required && <RNText style={{ color: tone(tokens, "danger").ink }}> *</RNText>}
    </RNText>
  );
}

/** Props FormField passes to its control (Input accepts them). */
export interface FormFieldControlProps {
  invalid?: boolean;
  editable?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface FormFieldProps {
  label?: string;
  hint?: string;
  /** Error message. Presence marks the control invalid. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  children: ReactElement<FormFieldControlProps>;
  style?: StyleProp<ViewStyle>;
}

export function FormField({ label, hint, error, required, disabled, children, style }: FormFieldProps) {
  const { tokens } = useTheme();
  const invalid = Boolean(error);
  return (
    <View style={[{ alignSelf: "stretch", gap: 6 }, style]}>
      {label ? (
        <Label required={required} disabled={disabled}>
          {label}
        </Label>
      ) : null}
      {cloneElement(children, {
        invalid: invalid || children.props.invalid,
        editable: disabled ? false : children.props.editable,
        accessibilityLabel: children.props.accessibilityLabel ?? label,
        accessibilityHint: error ?? hint ?? children.props.accessibilityHint,
      })}
      {hint ? <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{hint}</RNText> : null}
      {invalid ? (
        <RNText accessibilityRole="alert" style={{ color: tone(tokens, "danger").ink, fontSize: 14 }}>
          {error}
        </RNText>
      ) : null}
    </View>
  );
}
