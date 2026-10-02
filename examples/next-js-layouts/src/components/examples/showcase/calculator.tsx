"use client";

import { Divide, Minus, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { Button, Card } from "bokoui/react";
import { PageContainer } from "@/components/layout/page-container";

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

interface Key {
  key: string;
  label?: string;
  name?: string;
  wide?: boolean;
  operator?: boolean;
}

const rows: Key[][] = [
  [{ key: "C" }, { key: "±", label: "+/−", name: "plus minus" }, { key: "%" }, { key: "/", operator: true, name: "divide" }],
  [{ key: "7" }, { key: "8" }, { key: "9" }, { key: "*", operator: true, name: "multiply" }],
  [{ key: "4" }, { key: "5" }, { key: "6" }, { key: "-", operator: true, name: "minus" }],
  [{ key: "1" }, { key: "2" }, { key: "3" }, { key: "+", operator: true, name: "plus" }],
  [{ key: "0", wide: true }, { key: "." }, { key: "=", operator: true, name: "equals" }],
];

const glyph: Record<string, ReactNode> = {
  "/": <Divide aria-hidden="true" />,
  "*": <X aria-hidden="true" />,
  "-": <Minus aria-hidden="true" />,
  "+": <Plus aria-hidden="true" />,
};

/** Sample screen: a working calculator. A big display and a keypad of raised keys show how a style paints many buttons at once. */
export function Calculator() {
  const t = useTranslations("showcase");
  const [state, setState] = useState(initial);

  return (
    <PageContainer size="sm">
      <h1 className="sr-only">{t("calculatorTitle")}</h1>
      <Card className="items-end py-5">
        <p className="text-caption text-muted-foreground">
          {state.previous !== null && state.operator ? `${show(state.previous)} ${state.operator === "*" ? "×" : state.operator === "/" ? "÷" : state.operator}` : " "}
        </p>
        <p role="status" aria-live="polite" className="max-w-full truncate text-5xl font-semibold tabular-nums">
          {state.display}
        </p>
      </Card>
      <div className="grid grid-cols-4 gap-3">
        {rows.flat().map((cell) => (
          <Button
            key={cell.key}
            variant={cell.operator ? "solid" : "soft"}
            color={cell.operator ? "primary" : "neutral"}
            aria-label={cell.name ?? cell.key}
            className={`h-15 text-lg [&_svg]:size-5.5 ${cell.wide ? "col-span-2" : ""}`}
            onClick={() => setState((current) => press(current, cell.key))}
          >
            {cell.operator && cell.key !== "=" ? glyph[cell.key] : (cell.label ?? cell.key)}
          </Button>
        ))}
      </div>
    </PageContainer>
  );
}
