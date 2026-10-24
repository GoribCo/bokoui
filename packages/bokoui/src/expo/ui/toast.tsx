import { useState, useRef, useMemo, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { Alert, type AlertProps } from "./alert";
import { View, type ViewStyle } from "react-native";
import type { Action, ToastPlacement } from "@/core";
import { useTheme } from "../theme";

export interface ToastOptions {
  title?: string;
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
  /** Distance from the screen edge in px. Add your safe-area inset. Default 16. */
  offset?: number;
}

const edge = (placement: ToastPlacement, offset: number): ViewStyle => ({
  position: "absolute",
  left: offset,
  right: offset,
  gap: 8,
  ...(placement.startsWith("top") ? { top: offset } : { bottom: offset, flexDirection: "column-reverse" }),
  alignItems: placement.endsWith("left") ? "flex-start" : placement.endsWith("right") ? "flex-end" : "center",
});

/** Wrap the app once. Toasts overlay the screen; errors and warnings announce assertively. */
export function ToastProvider({ children, placement = "bottom-right", duration = 5000, max = 5, closeLabel = "Dismiss", offset = 16 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(1);
  const { tokens } = useTheme();

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
      {/* Fills the screen so the overlay below has a frame to position against. */}
      <View style={{ flex: 1 }}>
        {children}
        {toasts.length > 0 && (
          <View pointerEvents="box-none" style={edge(placement, offset)}>
            {toasts.map((t) => (
              <ToastItem key={t.id} entry={t} duration={t.duration ?? duration} closeLabel={closeLabel} onDismiss={() => dismiss(t.id)} surface={tokens.surface} radius={tokens.radiusCard} />
            ))}
          </View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ entry, duration, closeLabel, onDismiss, surface, radius }: { entry: ToastEntry; duration: number; closeLabel: string; onDismiss: () => void; surface: string; radius: number }) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => dismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [duration]);
  // The solid surface sits under the translucent alert tint, as on the web.
  return (
    <View style={{ alignSelf: "stretch", maxWidth: 420, backgroundColor: surface, borderRadius: radius }}>
      <Alert action={entry.action} variant={entry.variant ?? "soft"} title={entry.title} onClose={onDismiss} closeLabel={closeLabel}>
        {entry.description}
      </Alert>
    </View>
  );
}
