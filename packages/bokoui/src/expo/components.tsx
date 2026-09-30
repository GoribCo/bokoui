import { cloneElement, useState, type ReactElement, type ReactNode } from "react";
import {
  ActivityIndicator,
  Image as RNImage,
  Modal as RNModal,
  type ImageProps as RNImageProps,
  type ImageStyle,
  StyleSheet,
  Switch as RNSwitch,
  Linking,
  Pressable,
  Text as RNText,
  TextInput,
  View,
  useWindowDimensions,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type TextInputProps,
  type TextProps as RNTextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import type { Action, Color, Size, Variant } from "@/core";
import { resolveTone } from "@/core";
import type { HeadingLevel, HeadingSize, TextVariant } from "@/core";
import type { ModalSize } from "@/core";
import type { AlertVariant, ImageAspect, ImageFit, AvatarShape, CardPadding, CardVariant, BadgeVariant, DividerOrientation, InputVariant } from "@/core";
import { getInitials } from "@/core";
import { useTheme } from "./theme";
import { applyMix, mix, withAlpha, type ResolvedTokens } from "./tokens";

/** Palette for one tone: everything a component paints itself with. */
function tone(t: ResolvedTokens, name: Color | Action) {
  const base = t[name];
  return {
    base,
    fg: t[`${name}Fg`],
    soft: withAlpha(base, 0.16),
    softHover: withAlpha(base, 0.26),
    ink: mix(base, t.fg, name === "warning" ? t.inkToneWarning : t.inkTone),
    border: mix(t.fg, base, t.borderStrength),
  };
}

const sizes: Record<Size, { height: number; padX: number; font: number }> = {
  sm: { height: 32, padX: 12, font: 14 },
  md: { height: 40, padX: 16, font: 14 },
  lg: { height: 48, padX: 24, font: 16 },
};

// --- Button ---

export interface ButtonProps extends Omit<PressableProps, "children" | "style"> {
  variant?: Variant;
  color?: Color;
  action?: Action;
  size?: Size;
  iconOnly?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  variant = "solid",
  color = "primary",
  action,
  size = "md",
  iconOnly = false,
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const s = sizes[size];
  const off = disabled || loading;

  // Foreground color per variant, and background for rest / pressed.
  const solid = variant === "solid";
  const fg = solid ? c.fg : c.ink;
  const bg = (pressed: boolean) => {
    if (solid) return applyMix(c.base, pressed ? tokens.activeMix : "black 0%");
    if (variant === "outline" || variant === "link") return pressed && variant !== "link" ? c.soft : "transparent";
    if (variant === "soft") return pressed ? c.softHover : c.soft;
    return pressed ? c.soft : "transparent"; // ghost
  };
  const borderColor = solid ? c.border : variant === "outline" ? c.ink : "transparent";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: off, busy: loading }}
      disabled={off}
      {...props}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minHeight: variant === "link" ? undefined : Math.max(s.height, 44),
          minWidth: iconOnly ? 44 : undefined,
          paddingHorizontal: variant === "link" ? 0 : iconOnly ? 0 : s.padX,
          borderRadius: variant === "link" ? 0 : tokens.radiusButton,
          borderWidth: tokens.borderWidth,
          borderColor,
          backgroundColor: bg(pressed),
          opacity: off ? tokens.disabledOpacity : 1,
          alignSelf: fullWidth ? "stretch" : "flex-start",
        },
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={fg} /> : leftIcon}
      {children != null && (
        <RNText
          style={{
            color: fg,
            fontSize: s.font,
            fontWeight: tokens.btnWeight,
            textTransform: tokens.btnTransform,
            letterSpacing: tokens.btnTracking * s.font,
            textDecorationLine: variant === "link" ? "underline" : "none",
          }}
        >
          {children}
        </RNText>
      )}
      {!loading && rightIcon}
    </Pressable>
  );
}

// --- Image ---

export interface ImageProps extends Omit<RNImageProps, "style" | "accessibilityLabel"> {
  /** Alternative text for screen readers. Pass `""` for a decorative image. */
  alt: string;
  aspect?: ImageAspect;
  fit?: ImageFit;
  rounded?: boolean;
  style?: StyleProp<ImageStyle>;
}

const aspectRatio: Record<ImageAspect, number | undefined> = { auto: undefined, square: 1, video: 16 / 9, portrait: 3 / 4 };

export function Image({ alt, aspect = "auto", fit = "cover", rounded = false, style, ...props }: ImageProps) {
  const { tokens } = useTheme();
  return (
    <RNImage
      accessible={alt !== ""}
      accessibilityLabel={alt || undefined}
      resizeMode={fit}
      style={[
        {
          backgroundColor: tokens.muted,
          aspectRatio: aspectRatio[aspect],
          alignSelf: aspect === "auto" ? undefined : "stretch",
          borderRadius: rounded ? tokens.radiusCard : 0,
        },
        style,
      ]}
      {...props}
    />
  );
}

// --- Checkbox, Radio, Switch ---

export interface ToggleProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Text next to the control; the whole row is pressable. */
  label?: string;
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

export function Switch({ checked, onCheckedChange, label, color = "primary", action, invalid, disabled, style }: ToggleProps) {
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
      {label ? <RNText style={{ color: tokens.fg, fontSize: 14, opacity: disabled ? tokens.disabledOpacity : 1 }}>{label}</RNText> : null}
    </View>
  );
}

// --- Spinner ---

export interface SpinnerProps {
  size?: Size;
  color?: Color;
  action?: Action;
  label?: string;
}

export function Spinner({ size = "md", color = "primary", action, label = "Loading" }: SpinnerProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size={size === "sm" ? "small" : "large"} color={c.ink} />
    </View>
  );
}

// --- Alert ---

export interface AlertProps {
  variant?: AlertVariant;
  color?: Color;
  action?: Action;
  title?: string;
  /** Description; a string, or your own content. */
  children?: ReactNode;
  icon?: ReactNode;
  /** Shows a close button that calls this. */
  onClose?: () => void;
  closeLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function Alert({ variant = "soft", color = "neutral", action, title, children, icon, onClose, closeLabel = "Dismiss", style }: AlertProps) {
  const { tokens } = useTheme();
  const name = resolveTone(color, action);
  const c = tone(tokens, name);
  const solid = variant === "solid";
  const text = solid ? c.fg : tokens.fg;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion={name === "danger" || name === "warning" ? "assertive" : "polite"}
      style={[
        {
          alignSelf: "stretch",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 12,
          padding: 16,
          borderRadius: tokens.radiusCard,
          borderWidth: tokens.borderWidth,
          borderColor: solid ? c.border : variant === "outline" ? c.ink : "transparent",
          backgroundColor: solid ? c.base : variant === "soft" ? c.soft : "transparent",
        },
        style,
      ]}
    >
      {icon}
      <View style={{ flex: 1, gap: 4 }}>
        {title ? <RNText style={{ color: text, fontSize: 14, fontWeight: "600" }}>{title}</RNText> : null}
        {typeof children === "string" ? <RNText style={{ color: text, fontSize: 14 }}>{children}</RNText> : children}
      </View>
      {onClose ? (
        <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={onClose} hitSlop={12}>
          <RNText style={{ color: text, fontSize: 18, lineHeight: 20 }}>×</RNText>
        </Pressable>
      ) : null}
    </View>
  );
}

// --- Modal ---

export interface ModalProps {
  open: boolean;
  /** Called when the user dismisses it (backdrop press, Android back, close button). Set `open` to false in it. */
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: ReactNode;
  children?: ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  closeLabel?: string;
}

const modalMaxWidth: Record<ModalSize, number | "100%"> = { sm: 384, md: 512, lg: 768, full: "100%" };

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = "md",
  closeOnBackdrop = true,
  showClose = true,
  closeLabel = "Close",
}: ModalProps) {
  const { tokens } = useTheme();
  return (
    <RNModal transparent animationType="fade" visible={open} onRequestClose={() => onOpenChange(false)} statusBarTranslucent>
      <Pressable
        accessible={false}
        onPress={() => closeOnBackdrop && onOpenChange(false)}
        style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16, backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        {/* Swallow presses so taps inside the card do not reach the backdrop. */}
        <Pressable
          accessibilityViewIsModal
          accessibilityLabel={title}
          onPress={() => {}}
          style={{
            width: "100%",
            maxWidth: modalMaxWidth[size],
            maxHeight: "90%",
            borderRadius: tokens.radiusCard,
            borderWidth: tokens.borderWidth,
            borderColor: tokens.border,
            backgroundColor: tokens.surface,
            overflow: "hidden",
          }}
        >
          {title || showClose ? (
            <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: 20, paddingBottom: 8 }}>
              <View style={{ flex: 1, gap: 4 }}>
                {title ? (
                  <RNText accessibilityRole="header" style={{ color: tokens.fg, fontSize: 18, fontWeight: tokens.headingWeight }}>
                    {title}
                  </RNText>
                ) : null}
                {description ? <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{description}</RNText> : null}
              </View>
              {showClose ? (
                <Pressable accessibilityRole="button" accessibilityLabel={closeLabel} onPress={() => onOpenChange(false)} hitSlop={12}>
                  <RNText style={{ color: tokens.mutedFg, fontSize: 22, lineHeight: 24 }}>×</RNText>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          <View style={{ padding: 20, paddingTop: 8 }}>{children}</View>
          {footer ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: 20, paddingTop: 0 }}>
              {footer}
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

// --- Card ---

export interface CardProps extends Omit<ViewProps, "style"> {
  variant?: CardVariant;
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
}

const cardPad: Record<CardPadding, { pad: number; gap: number }> = {
  none: { pad: 0, gap: 0 },
  sm: { pad: 12, gap: 12 },
  md: { pad: 16, gap: 16 },
  lg: { pad: 24, gap: 24 },
};

export function Card({ variant = "outline", padding = "md", style, ...props }: CardProps) {
  const { tokens } = useTheme();
  const { pad, gap } = cardPad[padding];
  return (
    <View
      style={[
        {
          alignSelf: "stretch",
          padding: pad,
          gap,
          borderRadius: tokens.radiusCard,
          borderWidth: tokens.borderWidth,
          borderColor: variant === "filled" ? "transparent" : tokens.border,
          backgroundColor: variant === "filled" ? tokens.muted : tokens.surface,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function CardHeader({ style, ...props }: ViewProps) {
  return <View style={[{ gap: 4 }, style]} {...props} />;
}

export function CardFooter({ style, ...props }: ViewProps) {
  return <View style={[{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }, style]} {...props} />;
}

// --- Avatar ---

export interface AvatarProps {
  size?: Size;
  shape?: AvatarShape;
  /** Image URL; the initials show behind it until it loads. */
  src?: string;
  name?: string;
  color?: Color;
  action?: Action;
  status?: boolean;
  statusAction?: Action;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const avatarPx: Record<Size, { box: number; font: number }> = {
  sm: { box: 32, font: 12 },
  md: { box: 40, font: 14 },
  lg: { box: 48, font: 16 },
};

export function Avatar({
  size = "md",
  shape = "circle",
  src,
  name,
  color = "neutral",
  action,
  status,
  statusAction = "success",
  children,
  style,
}: AvatarProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const { box, font } = avatarPx[size];
  const radius = shape === "circle" ? box / 2 : tokens.radiusControl;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={name}
      style={[{ width: box, height: box }, style]}
    >
      <View
        style={{
          width: box,
          height: box,
          borderRadius: radius,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.soft,
        }}
      >
        {children ?? <RNText style={{ color: c.ink, fontSize: font, fontWeight: "500" }}>{getInitials(name).toUpperCase()}</RNText>}
        {src ? <RNImage source={{ uri: src }} accessibilityIgnoresInvertColors style={StyleSheet.absoluteFill} /> : null}
      </View>
      {status ? (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: tone(tokens, statusAction).base,
            borderWidth: 2,
            borderColor: tokens.bg,
          }}
        />
      ) : null}
    </View>
  );
}

// --- Divider ---

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ orientation = "horizontal", label, style }: DividerProps) {
  const { tokens } = useTheme();
  const line = { backgroundColor: tokens.border };
  if (orientation === "vertical") {
    return <View style={[{ alignSelf: "stretch", width: tokens.borderWidth, minHeight: 16 }, line, style]} />;
  }
  const rule = { height: tokens.borderWidth, ...line };
  if (!label) return <View style={[{ alignSelf: "stretch" }, rule, style]} />;
  return (
    <View style={[{ alignSelf: "stretch", flexDirection: "row", alignItems: "center", gap: 12 }, style]}>
      <View style={[{ flex: 1 }, rule]} />
      <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{label}</RNText>
      <View style={[{ flex: 1 }, rule]} />
    </View>
  );
}

// --- Badge ---

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: Size;
  color?: Color;
  action?: Action;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const badgeSizes: Record<Size, { height: number; padX: number; font: number }> = {
  sm: { height: 20, padX: 6, font: 12 },
  md: { height: 24, padX: 8, font: 12 },
  lg: { height: 28, padX: 10, font: 14 },
};

export function Badge({ variant = "soft", size = "md", color = "primary", action, children, style }: BadgeProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  const s = badgeSizes[size];
  const solid = variant === "solid";
  const fg = solid ? c.fg : c.ink;
  return (
    <View
      style={[
        {
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          height: s.height,
          paddingHorizontal: s.padX,
          borderRadius: tokens.radiusButton,
          borderWidth: tokens.borderWidth,
          borderColor: solid ? c.border : variant === "outline" ? c.ink : "transparent",
          backgroundColor: solid ? c.base : variant === "soft" ? c.soft : "transparent",
        },
        style,
      ]}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <RNText style={{ color: fg, fontSize: s.font, fontWeight: String(tokens.btnWeight) as TextStyle["fontWeight"] }}>
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
}

// --- Input ---

export interface InputProps extends Omit<TextInputProps, "style"> {
  variant?: InputVariant;
  size?: Size;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  variant = "outline",
  size = "md",
  color = "primary",
  action,
  invalid = false,
  startAdornment,
  endAdornment,
  editable = true,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const { tokens } = useTheme();
  const [focused, setFocused] = useState(false);
  const c = tone(tokens, invalid ? "danger" : resolveTone(color, action));
  const s = sizes[size];
  const flushed = variant === "flushed";
  const border = invalid ? c.base : focused ? c.ink : variant === "filled" ? "transparent" : tokens.fieldBorder;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "stretch",
          minHeight: Math.max(s.height, 44),
          paddingHorizontal: flushed ? 0 : s.padX - 2,
          gap: 8,
          borderRadius: flushed ? 0 : tokens.radiusControl,
          borderWidth: flushed ? 0 : tokens.borderWidth,
          borderBottomWidth: tokens.borderWidth,
          borderColor: border,
          backgroundColor: flushed ? "transparent" : variant === "filled" && !focused ? tokens.muted : tokens.field,
          opacity: editable ? 1 : tokens.disabledOpacity,
        },
        containerStyle,
      ]}
    >
      {startAdornment}
      <TextInput
        accessibilityState={{ disabled: !editable }}
        editable={editable}
        placeholderTextColor={tokens.mutedFg}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[{ flex: 1, color: tokens.fg, fontSize: s.font, paddingVertical: 0 }, style]}
      />
      {endAdornment}
    </View>
  );
}

// --- Textarea ---

export interface TextareaProps extends Omit<InputProps, "startAdornment" | "endAdornment" | "multiline"> {
  /** Visible lines. Default 3. */
  rows?: number;
}

export function Textarea({ rows = 3, size = "md", style, containerStyle, ...props }: TextareaProps) {
  const font = sizes[size].font;
  const lineHeight = font * 1.4;
  return (
    <Input
      multiline
      textAlignVertical="top"
      size={size}
      containerStyle={[{ alignItems: "flex-start", paddingVertical: 8 }, containerStyle]}
      style={[{ minHeight: rows * lineHeight, lineHeight }, style]}
      {...props}
    />
  );
}

// --- Label and FormField ---

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

// --- Typography ---

const headingPx: Record<HeadingSize, [number, number]> = {
  // [base, from 768px wide]
  sm: [16, 16],
  md: [18, 18],
  lg: [20, 20],
  xl: [24, 24],
  "2xl": [24, 30],
  "3xl": [30, 36],
  "4xl": [36, 48],
};
const defaultHeadingSize: Record<HeadingLevel, HeadingSize> = {
  h1: "4xl",
  h2: "3xl",
  h3: "2xl",
  h4: "xl",
  h5: "lg",
  h6: "md",
};

export interface HeadingProps extends RNTextProps {
  /** Semantic level (sets the default size and accessibility heading role). Default `h2`. */
  as?: HeadingLevel;
  size?: HeadingSize;
}

export function Heading({ as = "h2", size, style, ...props }: HeadingProps) {
  const { tokens } = useTheme();
  const { width } = useWindowDimensions();
  const [base, wide] = headingPx[size ?? defaultHeadingSize[as]];
  const px = width >= 768 ? wide : base;
  return (
    <RNText
      accessibilityRole="header"
      style={[
        {
          color: tokens.fg,
          fontSize: px,
          lineHeight: px * 1.2,
          fontWeight: tokens.headingWeight,
          letterSpacing: tokens.headingTracking * px,
          textTransform: tokens.headingTransform,
        },
        style,
      ]}
      {...props}
    />
  );
}

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  muted?: boolean;
}

const textPx: Record<TextVariant, number> = { body: 16, lead: 20, small: 14, caption: 12, code: 14 };

export function Text({ variant = "body", muted = false, style, ...props }: TextProps) {
  const { tokens } = useTheme();
  const px = textPx[variant];
  return (
    <RNText
      style={[
        {
          color: muted ? tokens.mutedFg : tokens.fg,
          fontSize: px,
          lineHeight: px * tokens.textLeading,
        },
        variant === "code" && { fontFamily: "Courier", backgroundColor: tokens.muted, borderRadius: tokens.radiusControl },
        style,
      ]}
      {...props}
    />
  );
}

export interface LinkProps extends RNTextProps {
  /** Opened with `Linking.openURL` on press. */
  href?: string;
  color?: Color;
  action?: Action;
  underline?: "always" | "hover" | "none";
}

export function Link({ href, color = "primary", action, underline = "hover", style, onPress, ...props }: LinkProps) {
  const { tokens } = useTheme();
  const c = tone(tokens, resolveTone(color, action));
  return (
    <RNText
      accessibilityRole="link"
      onPress={(e) => {
        onPress?.(e);
        if (href) void Linking.openURL(href);
      }}
      style={[{ color: c.ink, textDecorationLine: underline === "none" ? "none" : "underline" }, style]}
      {...props}
    />
  );
}
