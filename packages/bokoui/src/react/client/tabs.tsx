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
  getNextIndex,
  resolveTone,
  tabClass,
  tabListClass,
  tabPanelClass,
  tabsRootClass,
  type Action,
  type Color,
  type TabsStyleProps,
} from "@/core";

interface TabsContextValue extends TabsStyleProps {
  value: string | undefined;
  select: (value: string) => void;
  base: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(part: string) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error(`<${part}> must be used inside <Tabs>`);
  return ctx;
}

const slug = (value: string) => value.replace(/\s+/g, "-");

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">, TabsStyleProps {
  /** Selected tab (controlled). */
  value?: string;
  /** Initially selected tab (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  color?: Color;
  action?: Action;
}

/** Compound component: `<Tabs><TabList><Tab value="a"/></TabList><TabPanel value="a"/></Tabs>`. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { value, defaultValue, onValueChange, variant, orientation = "horizontal", color = "primary", action, className, ...props },
  ref,
) {
  const base = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const select = useCallback(
    (next: string) => {
      if (value === undefined) setInner(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value: current, select, base, variant, orientation }}>
      <div ref={ref} data-tone={resolveTone(color, action)} className={tabsRootClass(orientation, className)} {...props} />
    </TabsContext.Provider>
  );
});

export const TabList = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function TabList(
  { className, onKeyDown, ...props },
  ref,
) {
  const { variant, orientation } = useTabs("TabList");

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const next = getNextIndex(tabs.indexOf(document.activeElement as HTMLButtonElement), tabs.length, event.key, {
      orientation,
      rtl,
    });
    if (next === undefined) return;
    event.preventDefault();
    // Automatic activation: focusing a tab selects it.
    tabs[next]?.focus();
    tabs[next]?.click();
  }

  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation={orientation}
      className={tabListClass({ variant, orientation }, className)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab({ value, className, onClick, ...props }, ref) {
  const { value: selected, select, base, variant, orientation } = useTabs("Tab");
  const active = selected === value;
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${base}-tab-${slug(value)}`}
      aria-selected={active}
      aria-controls={`${base}-panel-${slug(value)}`}
      // Roving tabindex: only the active tab is in the tab order; arrows move between tabs.
      tabIndex={active ? 0 : -1}
      className={tabClass({ variant, orientation }, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
      {...props}
    />
  );
});

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel({ value, className, ...props }, ref) {
  const { value: selected, base } = useTabs("TabPanel");
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${base}-panel-${slug(value)}`}
      aria-labelledby={`${base}-tab-${slug(value)}`}
      hidden={selected !== value}
      tabIndex={0}
      className={tabPanelClass(className)}
      {...props}
    />
  );
});
