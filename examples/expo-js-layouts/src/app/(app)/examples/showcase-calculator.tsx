import { Button, Card, Text } from "bokoui/expo/ui";
import { Divide, Minus, Plus, X } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { PageContainer } from "@/components/layout/page-container";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useTheme } from "bokoui/expo";

type Operator = "+" | "-" | "*" | "/";

interface CalcState {
  display: string;
  previous: number | null;
  operator: Operator | null;
  /** The next digit starts a new number. */
  fresh: boolean;
}

const initial: CalcState = { display: "0", previous: null, operator: null, fresh: true };

const apply = (a: number, b: number, op: Operator) => (op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : b === 0 ? NaN : a / b);
const show = (n: number) => (Number.isFinite(n) ? String(Math.round(n * 1e9) / 1e9) : "Error");

function press(state: CalcState, key: string): CalcState {
  if (/^\d$/.test(key)) return { ...state, display: state.fresh || state.display === "0" ? key : state.display + key, fresh: false };
  if (key === ".") return state.display.includes(".") && !state.fresh ? state : { ...state, display: state.fresh ? "0." : state.display + ".", fresh: false };
  if (key === "C") return initial;
  if (key === "±") return { ...state, display: state.display.startsWith("-") ? state.display.slice(1) : state.display === "0" ? "0" : `-${state.display}` };
  if (key === "%") return { ...state, display: show(Number(state.display) / 100), fresh: true };
  const current = Number(state.display);
  const result = state.operator && state.previous !== null && !state.fresh ? apply(state.previous, current, state.operator) : current;
  if (key === "=") return { display: show(result), previous: null, operator: null, fresh: true };
  return { display: show(result), previous: result, operator: key as Operator, fresh: true };
}

const rows: { key: string; label?: ReactNode; wide?: boolean; operator?: boolean }[][] = [
  [{ key: "C" }, { key: "±", label: "+/−" }, { key: "%" }, { key: "/", operator: true }],
  [{ key: "7" }, { key: "8" }, { key: "9" }, { key: "*", operator: true }],
  [{ key: "4" }, { key: "5" }, { key: "6" }, { key: "-", operator: true }],
  [{ key: "1" }, { key: "2" }, { key: "3" }, { key: "+", operator: true }],
  [{ key: "0", wide: true }, { key: "." }, { key: "=", operator: true }],
];

/** Sample screen: a working calculator. A big display and a keypad of raised keys show how a style paints many buttons at once. */
export default function ShowcaseCalculatorScreen() {
  const { t } = useTranslation();
  const { tokens } = useTheme();
  const [state, setState] = useState(initial);
  useScreenTitle(t("showcase.calculatorTitle"));
  const glyph = (key: string, color: string) => {
    const props = { size: 22, color };
    return key === "/" ? <Divide {...props} /> : key === "*" ? <X {...props} /> : key === "-" ? <Minus {...props} /> : key === "+" ? <Plus {...props} /> : null;
  };

  return (
    <PageContainer size="sm">
      <Card style={{ alignItems: "flex-end", paddingVertical: 20 }}>
        <Text variant="caption" muted>
          {state.previous !== null && state.operator ? `${show(state.previous)} ${state.operator === "*" ? "×" : state.operator === "/" ? "÷" : state.operator}` : " "}
        </Text>
        <Text accessibilityLiveRegion="polite" numberOfLines={1} adjustsFontSizeToFit style={{ fontSize: 44, lineHeight: 52, fontWeight: "600" }}>
          {state.display}
        </Text>
      </Card>
      <View style={{ gap: 12 }}>
        {rows.map((row, index) => (
          <View key={index} style={{ flexDirection: "row", gap: 12 }}>
            {row.map((cell) => {
              const operator = Boolean(cell.operator);
              const label = cell.label ?? cell.key;
              return (
                <View key={cell.key} style={{ flex: cell.wide ? 2.15 : 1 }}>
                  <Button
                    variant={operator ? "solid" : "soft"}
                    color={operator ? "primary" : "neutral"}
                    accessibilityLabel={cell.key === "/" ? "divide" : cell.key === "*" ? "multiply" : cell.key === "-" ? "minus" : cell.key === "+" ? "plus" : cell.key}
                    onPress={() => setState((current) => press(current, cell.key))}
                    style={{ alignSelf: "stretch", minHeight: 60 }}
                  >
                    {operator && cell.key !== "=" ? glyph(cell.key, tokens.primaryFg) : label}
                  </Button>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </PageContainer>
  );
}
