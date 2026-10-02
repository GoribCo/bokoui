import { createContext, useContext, type ReactNode } from "react";
import { Pressable, Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { resolveTone, type Action, type Color } from "@/core";
import { useTheme } from "../theme";
import { tone, type Tone } from "../internal/shared";
import { useControllable } from "../internal/use-controllable";

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  tone: Tone;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<{ value: string; disabled: boolean } | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion parts must be used inside <Accordion>");
  return ctx;
}
function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("AccordionTrigger and AccordionContent must be used inside <AccordionItem>");
  return ctx;
}

interface BaseProps {
  color?: Color;
  action?: Action;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export type AccordionProps = BaseProps &
  (
    | {
        /** One item open at a time. */
        type?: "single";
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        /** Allow closing the open item, leaving none open. Default true. */
        collapsible?: boolean;
      }
    | {
        /** Any number of items open. */
        type: "multiple";
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
        collapsible?: never;
      }
  );

/** `<Accordion><AccordionItem value="a"><AccordionTrigger>Q</AccordionTrigger><AccordionContent>A</AccordionContent></AccordionItem></Accordion>` */
export function Accordion(props: AccordionProps) {
  const { tokens } = useTheme();
  const { color = "primary", action, children, style } = props;
  const multiple = props.type === "multiple";
  const collapsible = props.type === "multiple" ? true : (props.collapsible ?? true);
  // Both modes keep an array internally; `single` converts at the edges.
  const [open, setOpen] = useControllable<string[]>(
    props.value === undefined ? undefined : Array.isArray(props.value) ? props.value : props.value ? [props.value] : [],
    props.defaultValue === undefined ? [] : Array.isArray(props.defaultValue) ? props.defaultValue : props.defaultValue ? [props.defaultValue] : [],
    (next) => {
      if (props.type === "multiple") props.onValueChange?.(next);
      else props.onValueChange?.(next[0] ?? "");
    },
  );
  const toggle = (value: string) => {
    if (open.includes(value)) {
      if (multiple) setOpen(open.filter((v) => v !== value));
      else if (collapsible) setOpen([]);
    } else setOpen(multiple ? [...open, value] : [value]);
  };
  const c = tone(tokens, resolveTone(color, action));
  return (
    <AccordionContext.Provider value={{ isOpen: (v) => open.includes(v), toggle, tone: c }}>
      <View style={[{ alignSelf: "stretch" }, style]}>{children}</View>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AccordionItem({ value, disabled = false, children, style }: AccordionItemProps) {
  const { tokens } = useTheme();
  return (
    <ItemContext.Provider value={{ value, disabled }}>
      <View style={[{ borderBottomWidth: tokens.borderWidth, borderColor: tokens.border }, style]}>{children}</View>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({ children }: { children?: ReactNode }) {
  const { tokens } = useTheme();
  const { isOpen, toggle } = useAccordion();
  const { value, disabled } = useItem();
  const open = isOpen(value);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open, disabled }}
      disabled={disabled}
      onPress={() => toggle(value)}
      style={({ pressed }) => ({
        minHeight: 48,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        paddingVertical: 12,
        opacity: disabled ? tokens.disabledOpacity : pressed ? 0.7 : 1,
      })}
    >
      {typeof children === "string" ? <RNText style={{ flex: 1, color: tokens.fg, fontSize: 16, fontWeight: "500" }}>{children}</RNText> : children}
      <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{open ? "▲" : "▼"}</RNText>
    </Pressable>
  );
}

export function AccordionContent({ children }: { children?: ReactNode }) {
  const { tokens } = useTheme();
  const { isOpen } = useAccordion();
  const { value } = useItem();
  if (!isOpen(value)) return null;
  return (
    <View style={{ paddingBottom: 16 }}>
      {typeof children === "string" ? <RNText style={{ color: tokens.mutedFg, fontSize: 14 }}>{children}</RNText> : children}
    </View>
  );
}
