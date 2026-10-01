"use client";

import { Button } from "bokoui/react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  /** Accessible name of the group. */
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** A row of equal-width buttons where exactly one is pressed (theme mode, text size). */
export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="grid grid-cols-3 gap-2">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          color={value === option.value ? "primary" : "neutral"}
          variant={value === option.value ? "solid" : "outline"}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
