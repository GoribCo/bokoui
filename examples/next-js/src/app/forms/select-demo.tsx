"use client";

import { useState } from "react";
import { FormField } from "bokoui/react";
import { Select } from "bokoui/react/client";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "avocado", label: "Avocado (unavailable)", disabled: true },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
];

export function SelectDemo() {
  const [value, setValue] = useState("banana");
  const [touched, setTouched] = useState("");
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField label="Controlled" hint={`Value: ${value}`}>
        <Select options={fruits} value={value} onValueChange={setValue} />
      </FormField>
      <FormField label="Placeholder">
        <Select options={fruits} placeholder="Pick a fruit" />
      </FormField>
      <FormField label="With error" error="Please choose a fruit" required>
        <Select
          options={fruits}
          placeholder="Pick a fruit"
          value={touched}
          onValueChange={setTouched}
        />
      </FormField>
      <FormField label="Disabled" disabled>
        <Select options={fruits} defaultValue="apple" />
      </FormField>
      <Select options={fruits} variant="filled" size="sm" aria-label="Filled small" defaultValue="cherry" />
      <Select options={fruits} variant="flushed" size="lg" aria-label="Flushed large" placeholder="Flushed, large" />
    </div>
  );
}
