import { useCallback, useState } from "react";

/** Controlled-or-uncontrolled state: `value` wins when given, otherwise the hook keeps it. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (next: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const set = useCallback(
    (next: T) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [value === undefined ? inner : value, set] as const;
}
