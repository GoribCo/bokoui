"use client";

import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { tooltipClass, type Placement } from "@/core";
import { useFloating, useTopLayer } from "../internal/floating";

interface TriggerProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}

export interface TooltipProps {
  /** Tooltip text. Keep it short and non-interactive. */
  content: ReactNode;
  /** The element the tooltip describes. It must accept a ref and DOM event props. */
  children: ReactElement<TriggerProps>;
  placement?: Placement;
  /** Delay before showing on hover, ms. Focus shows immediately. Default 300. */
  delay?: number;
  disabled?: boolean;
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
 * Describes its trigger on hover and keyboard focus (`aria-describedby`), and closes on
 * Escape. It is a hint only: never put essential information or controls in it.
 */
export function Tooltip({ content, children, placement = "top", delay = 300, disabled, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLElement>(null);
  const floating = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const visible = open && !disabled;
  useTopLayer(floating, visible);
  const pos = useFloating(anchor, floating, visible, placement);

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  const show = (immediately: boolean) => {
    clearTimeout(timer.current);
    if (immediately || delay <= 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  const child = children.props;
  return (
    <>
      {cloneElement(children, {
        ref: mergeRefs(anchor, child.ref),
        "aria-describedby": visible ? [child["aria-describedby"], id].filter(Boolean).join(" ") : child["aria-describedby"],
        onMouseEnter: (event: MouseEvent<HTMLElement>) => (child.onMouseEnter?.(event), show(false)),
        onMouseLeave: (event: MouseEvent<HTMLElement>) => (child.onMouseLeave?.(event), hide()),
        onFocus: (event: FocusEvent<HTMLElement>) => (child.onFocus?.(event), show(true)),
        onBlur: (event: FocusEvent<HTMLElement>) => (child.onBlur?.(event), hide()),
      })}
      {visible && (
        <div
          ref={floating}
          id={id}
          role="tooltip"
          popover="manual"
          data-side={pos.side}
          className={tooltipClass(className)}
          // `inset: auto` first, so the UA popover `inset: 0` does not fight top/left.
          style={{ inset: "auto", top: pos.top, left: pos.left, opacity: pos.ready ? 1 : 0 }}
        >
          {content}
        </div>
      )}
    </>
  );
}
