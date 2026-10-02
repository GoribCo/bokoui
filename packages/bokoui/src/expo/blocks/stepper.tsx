import { Text as RNText, View, type StyleProp, type ViewStyle } from "react-native";
import { type Action, type Color, type StepStatus } from "@/core";
import { useTheme } from "../theme";
import { useTone } from "../internal/shared";

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: readonly Step[];
  /** Zero-based index of the current step. */
  current: number;
  orientation?: "horizontal" | "vertical";
  color?: Color;
  action?: Action;
  style?: StyleProp<ViewStyle>;
}

/** A progress trail for multi-step flows. Presentational: you own the step state and the buttons. */
export function Stepper({ steps, current, orientation = "horizontal", color = "primary", action, style }: StepperProps) {
  const { tokens } = useTheme();
  const c = useTone(color, action);
  const horizontal = orientation === "horizontal";
  return (
    <View accessibilityRole="list" style={[{ alignSelf: "stretch", flexDirection: horizontal ? "row" : "column", alignItems: "flex-start" }, style]}>
      {steps.map((step, index) => {
        const status: StepStatus = index < current ? "complete" : index === current ? "current" : "upcoming";
        const last = index === steps.length - 1;
        const indicator =
          status === "complete"
            ? { borderColor: c.border, backgroundColor: c.base, color: c.fg }
            : status === "current"
              ? { borderColor: c.ink, backgroundColor: c.soft, color: c.ink }
              : { borderColor: tokens.border, backgroundColor: tokens.surface, color: tokens.mutedFg };
        const connector = <View style={horizontal ? { position: "absolute", left: 40, right: 8, top: 15, height: 2, borderRadius: 1, backgroundColor: status === "complete" ? c.base : tokens.border } : { position: "absolute", left: 15, top: 36, bottom: 4, width: 2, borderRadius: 1, backgroundColor: status === "complete" ? c.base : tokens.border }} />;
        return (
          <View
            key={index}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${step.label}, ${status === "complete" ? "completed" : status === "current" ? "current step" : "upcoming"}`}
            style={horizontal ? { flex: last ? 0 : 1, gap: 12, paddingRight: last ? 0 : 16 } : { flexDirection: "row", gap: 12, paddingBottom: last ? 0 : 32 }}
          >
            {!last && connector}
            <View style={{ width: 32, height: 32, borderRadius: 16, borderWidth: tokens.borderWidth, alignItems: "center", justifyContent: "center", borderColor: indicator.borderColor, backgroundColor: indicator.backgroundColor }}>
              <RNText style={{ color: indicator.color, fontSize: 14, fontWeight: "500" }}>{status === "complete" ? "✓" : index + 1}</RNText>
            </View>
            <View style={{ gap: 2, paddingTop: horizontal ? 0 : 6, flexShrink: 1 }}>
              <RNText style={{ color: status === "upcoming" ? tokens.mutedFg : tokens.fg, fontSize: 14, fontWeight: "500" }}>{step.label}</RNText>
              {step.description ? <RNText style={{ color: tokens.mutedFg, fontSize: 12 }}>{step.description}</RNText> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
