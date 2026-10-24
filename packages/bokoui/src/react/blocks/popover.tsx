"use client";

import { cloneElement, useCallback, useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode, type Ref } from "react";
import { popoverPanelClass, type Placement } from "@/core";
import { useFloating, useTopLayer } from "../internal/floating";

interface TriggerProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

export interface PopoverProps {
  /** The element that toggles the popover. It must accept a ref and DOM event props. */
  trigger: ReactElement<TriggerProps>;
  /** Panel content: text, a form, links. Unlike a Menu, it can hold anything. */
  children: ReactNode;
  placement?: Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Accessible name of the panel. */
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

const FOCUSABLE = 'a[href],button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"])';

/**
 * A non-modal panel anchored to its trigger. Focus moves into the panel on open (first
 * focusable, else the panel); Escape closes it and returns focus; so does clicking outside or
 * tabbing out. For a list of actions use `Menu`; for a blocking task use `Modal`.
 */
export function Popover({ trigger, children, placement = "bottom", open, defaultOpen = false, onOpenChange, className, "aria-label": label }: PopoverProps) {
  const id = useId();
  const [inner, setInner] = useState(defaultOpen);
  const isOpen = open ?? inner;
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  // Top layer first: a hidden popover has no size, so it must be shown before it is measured.
  useTopLayer(panel, isOpen);
  const pos = useFloating(anchor, panel, isOpen, placement, 8);

  const setOpen = useCallback(
    (next: boolean, returnFocus = false) => {
      if (open === undefined) setInner(next);
      onOpenChange?.(next);
      if (!next && returnFocus) anchor.current?.focus();
    },
    [open, onOpenChange],
  );

  useEffect(() => {
    if (!isOpen || !pos.ready) return;
    const el = panel.current;
    // Content may have focused something itself (e.g. a Calendar's selected day); keep that.
    if (el?.contains(document.activeElement)) return;
    (el?.querySelector<HTMLElement>(FOCUSABLE) ?? el)?.focus();
  }, [isOpen, pos.ready]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !anchor.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [isOpen, setOpen]);

  function onPanelKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false, true);
    }
  }

  return (
    <>
      {cloneElement(trigger, {
        ref: mergeRefs(anchor, trigger.props.ref),
        "aria-haspopup": "dialog",
        "aria-expanded": isOpen,
        "aria-controls": isOpen ? id : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) setOpen(!isOpen);
        },
      } as Partial<TriggerProps>)}
      {isOpen && (
        <div
          ref={panel}
          id={id}
          role="dialog"
          aria-label={label}
          tabIndex={-1}
          popover="manual"
          className={popoverPanelClass(["p-4 max-w-sm", className])}
          style={{ inset: "auto", top: pos.top, left: pos.left, opacity: pos.ready ? 1 : 0 }}
          onKeyDown={onPanelKeyDown}
          onBlur={(event) => {
            // Tabbing out of a non-modal panel closes it (focus moving to the trigger is fine).
            const next = event.relatedTarget as Node | null;
            if (next && !panel.current?.contains(next) && !anchor.current?.contains(next)) setOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </>
  );
}
