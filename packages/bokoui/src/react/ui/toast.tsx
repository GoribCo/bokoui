"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toastItemClass, toastViewportClass, type Action, type ToastPlacement } from "@/core";
import { Alert, type AlertProps } from "./alert";
import { useTopLayer } from "../internal/floating";

export interface ToastOptions {
  title?: ReactNode;
  description?: ReactNode;
  action?: Action;
  variant?: AlertProps["variant"];
  /** Milliseconds before it dismisses itself. `0` keeps it until closed. Default from the provider. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  /** Shows a toast; returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id?: number) => void;
}
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export interface ToastProviderProps {
  children: ReactNode;
  placement?: ToastPlacement;
  /** Default auto-dismiss delay, ms. Default 5000. */
  duration?: number;
  /** Most toasts shown at once; the oldest is dropped. Default 5. */
  max?: number;
  closeLabel?: string;
}

/** Wrap the app once. Toasts announce politely (errors and warnings assertively) and pause while hovered or focused. */
export function ToastProvider({ children, placement = "bottom-right", duration = 5000, max = 5, closeLabel = "Dismiss" }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);
  const viewport = useRef<HTMLDivElement>(null);
  useTopLayer(viewport, toasts.length > 0);

  const dismiss = useCallback((id?: number) => setToasts((all) => (id === undefined ? [] : all.filter((t) => t.id !== id))), []);
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((all) => [...all, { ...options, id }].slice(-max));
      return id;
    },
    [max],
  );
  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 && (
        <div ref={viewport} popover="manual" role="region" aria-label="Notifications" className={toastViewportClass(placement)}>
          {toasts.map((t) => (
            <ToastItem key={t.id} entry={t} duration={t.duration ?? duration} closeLabel={closeLabel} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

function ToastItem({ entry, duration, closeLabel, onDismiss }: { entry: ToastEntry; duration: number; closeLabel: string; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false);
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (duration <= 0 || paused) return;
    const timer = setTimeout(() => dismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration, paused]);

  return (
    <div
      className={toastItemClass}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Alert action={entry.action} variant={entry.variant ?? "soft"} title={entry.title} onClose={onDismiss} closeLabel={closeLabel}>
        {entry.description}
      </Alert>
    </div>
  );
}
