import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";
import {
  accordionClass,
  accordionContentBodyClass,
  accordionContentClass,
  accordionContentInnerClass,
  accordionItemClass,
  accordionTriggerClass,
  getNextIndex,
  icons,
  resolveTone,
  type Action,
  type Color,
} from "@/core";
import { Icon } from "../ui/icon";

interface AccordionContextValue {
  base: string;
  regions: boolean;
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}
const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<{ value: string; disabled: boolean } | null>(null);

const slug = (value: string) => value.replace(/\s+/g, "-");

interface BaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  color?: Color;
  action?: Action;
  /**
   * Give each open panel `role="region"` (a landmark named by its heading). Off by default: with
   * more than about six panels the landmarks become noise for screen-reader users.
   */
  regions?: boolean;
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

/**
 * `<Accordion><AccordionItem value="a"><AccordionTrigger>Q</AccordionTrigger><AccordionContent>A</AccordionContent></AccordionItem></Accordion>`.
 * Up/Down, Home and End move between triggers; Enter and Space toggle.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const { type = "single", color = "primary", action, regions = false, className, onKeyDown, ...rest } = props;
  // Strip the control props so they do not reach the DOM.
  const { value, defaultValue, onValueChange, collapsible = true, ...dom } = rest as typeof rest & {
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (v: never) => void;
    collapsible?: boolean;
  };
  const base = useId();
  const toList = (v: string | string[] | undefined) => (v === undefined ? undefined : Array.isArray(v) ? v : v ? [v] : []);
  const [inner, setInner] = useState<string[]>(toList(defaultValue) ?? []);
  const open = toList(value) ?? inner;

  const toggle = useCallback(
    (item: string) => {
      const isOpen = open.includes(item);
      let next: string[];
      if (type === "multiple") next = isOpen ? open.filter((v) => v !== item) : [...open, item];
      else next = isOpen ? (collapsible ? [] : open) : [item];
      if (value === undefined) setInner(next);
      (onValueChange as ((v: string | string[]) => void) | undefined)?.(type === "multiple" ? next : (next[0] ?? ""));
    },
    [open, type, collapsible, value, onValueChange],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const triggers = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-accordion-trigger]:not(:disabled)"));
    const next = getNextIndex(triggers.indexOf(document.activeElement as HTMLButtonElement), triggers.length, event.key, {
      orientation: "vertical",
    });
    if (next === undefined) return;
    event.preventDefault();
    triggers[next]?.focus();
  }

  return (
    <AccordionContext.Provider value={{ base, regions, isOpen: (v) => open.includes(v), toggle }}>
      <div
        ref={ref}
        data-tone={resolveTone(color, action)}
        className={accordionClass(className)}
        onKeyDown={handleKeyDown}
        {...(dom as HTMLAttributes<HTMLDivElement>)}
      />
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled = false, className, ...props },
  ref,
) {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("<AccordionItem> must be used inside <Accordion>");
  return (
    <ItemContext.Provider value={{ value, disabled }}>
      <div ref={ref} data-state={ctx.isOpen(value) ? "open" : "closed"} className={accordionItemClass(className)} {...props} />
    </ItemContext.Provider>
  );
});

function useItem(part: string) {
  const accordion = useContext(AccordionContext);
  const item = useContext(ItemContext);
  if (!accordion || !item) throw new Error(`<${part}> must be used inside <AccordionItem>`);
  return { ...accordion, ...item, open: accordion.isOpen(item.value) };
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function AccordionTrigger(
  { className, children, onClick, ...props },
  ref,
) {
  const { base, value, disabled, open, toggle } = useItem("AccordionTrigger");
  return (
    // The heading gives screen-reader users an outline; level 3 suits most pages.
    <h3 className="m-0">
      <button
        ref={ref}
        type="button"
        id={`${base}-trigger-${slug(value)}`}
        data-accordion-trigger=""
        aria-expanded={open}
        aria-controls={`${base}-content-${slug(value)}`}
        disabled={disabled}
        className={accordionTriggerClass(className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggle(value);
        }}
        {...props}
      >
        {children}
        <Icon node={icons.chevronDown} />
      </button>
    </h3>
  );
});

export const AccordionContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function AccordionContent(
  { className, children, ...props },
  ref,
) {
  const { base, value, open, regions } = useItem("AccordionContent");
  return (
    <div
      ref={ref}
      role={regions ? "region" : undefined}
      id={`${base}-content-${slug(value)}`}
      aria-labelledby={regions ? `${base}-trigger-${slug(value)}` : undefined}
      // Closed content stays mounted for the height animation; inert removes it from focus and AT.
      inert={!open}
      className={accordionContentClass(open)}
      {...props}
    >
      <div className={accordionContentInnerClass}>
        <div className={[accordionContentBodyClass, className].filter(Boolean).join(" ")}>{children}</div>
      </div>
    </div>
  );
});
