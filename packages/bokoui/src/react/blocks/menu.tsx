"use client";

import {
  cloneElement,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import {
  getNextIndex,
  isTypeaheadKey,
  menuItemClass,
  menuLabelClass,
  menuSeparatorClass,
  popoverPanelClass,
  resolveTone,
  typeaheadIndex,
  type Placement,
} from "@/core";
import { useFloating, useTopLayer } from "../internal/floating";

interface MenuContextValue {
  close: (returnFocus?: boolean) => void;
}
const MenuContext = createContext<MenuContextValue | null>(null);

const ITEMS = '[role="menuitem"]:not([aria-disabled="true"])';

interface TriggerProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

export interface MenuProps {
  /** The element that opens the menu (usually a Button). It must accept a ref and DOM event props. */
  trigger: ReactElement<TriggerProps>;
  /** `MenuItem`, `MenuSeparator` and `MenuLabel` children. */
  children: ReactNode;
  placement?: Placement;
  /** Accessible name for the menu. Defaults to the trigger's own label. */
  "aria-label"?: string;
  className?: string;
}

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}

/**
 * Dropdown menu. Arrow keys, Home/End and typeahead move between items; Enter/Space select;
 * Escape closes and returns focus to the trigger. Follows the WAI-ARIA menu button pattern.
 */
export function Menu({ trigger, children, placement = "bottom-start", className, "aria-label": ariaLabel }: MenuProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const initialFocus = useRef<"first" | "last">("first");
  const query = useRef({ text: "", timer: undefined as ReturnType<typeof setTimeout> | undefined });
  // Top layer first: a hidden popover has no size, so it must be shown before it is measured.
  useTopLayer(panel, open);
  const pos = useFloating(anchor, panel, open, placement, 4);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) anchor.current?.focus();
  }, []);

  const items = () => Array.from(panel.current?.querySelectorAll<HTMLElement>(ITEMS) ?? []);
  const focusItem = (index: number) => items()[index]?.focus();

  // Move focus into the menu once it is rendered.
  useEffect(() => {
    if (!open || !pos.ready) return;
    const list = items();
    (initialFocus.current === "last" ? list[list.length - 1] : list[0])?.focus();
  }, [open, pos.ready]);

  // Light dismiss: pointer down outside both the trigger and the panel.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !anchor.current?.contains(target)) close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLElement>) {
    trigger.props.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      initialFocus.current = event.key === "ArrowUp" ? "last" : "first";
      setOpen(true);
    }
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const list = items();
    const current = list.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      close(false);
      return;
    }
    const next = getNextIndex(current, list.length, event.key, { orientation: "vertical" });
    if (next !== undefined) {
      event.preventDefault();
      focusItem(next);
      return;
    }
    if (isTypeaheadKey(event)) {
      const q = query.current;
      clearTimeout(q.timer);
      q.text += event.key;
      q.timer = setTimeout(() => (q.text = ""), 500);
      const match = typeaheadIndex(list.map((el) => el.textContent ?? ""), q.text, current);
      if (match >= 0) focusItem(match);
    }
  }

  return (
    <MenuContext.Provider value={{ close }}>
      {cloneElement(trigger, {
        ref: mergeRefs(anchor, trigger.props.ref),
        "aria-haspopup": "menu",
        "aria-expanded": open,
        "aria-controls": open ? id : undefined,
        onKeyDown: onTriggerKeyDown,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (event.defaultPrevented) return;
          initialFocus.current = "first";
          setOpen((v) => !v);
        },
      } as Partial<TriggerProps>)}
      {open && (
        <div
          ref={panel}
          id={id}
          role="menu"
          aria-label={ariaLabel}
          aria-orientation="vertical"
          popover="manual"
          className={popoverPanelClass(className)}
          style={{ inset: "auto", top: pos.top, left: pos.left, opacity: pos.ready ? 1 : 0 }}
          onKeyDown={onPanelKeyDown}
        >
          {children}
        </div>
      )}
    </MenuContext.Provider>
  );
}

export interface MenuItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Called on click, Enter or Space. The menu closes afterwards unless you call `event.preventDefault()`. */
  onSelect?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Destructive styling (danger tone). */
  danger?: boolean;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(function MenuItem(
  { className, onSelect, danger, disabled, onClick, onMouseEnter, ...props },
  ref,
) {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error("<MenuItem> must be used inside <Menu>");
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-tone={resolveTone("primary", danger ? "danger" : undefined)}
      className={menuItemClass(danger, className)}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        if (!disabled) event.currentTarget.focus();
      }}
      onClick={(event) => {
        onClick?.(event);
        if (disabled) return;
        onSelect?.(event);
        if (!event.defaultPrevented) menu.close();
      }}
      {...props}
    />
  );
});

export const MenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function MenuSeparator(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="separator" className={[menuSeparatorClass, className].filter(Boolean).join(" ")} {...props} />;
});

export const MenuLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function MenuLabel(
  { className, ...props },
  ref,
) {
  return <div ref={ref} role="presentation" className={[menuLabelClass, className].filter(Boolean).join(" ")} {...props} />;
});
