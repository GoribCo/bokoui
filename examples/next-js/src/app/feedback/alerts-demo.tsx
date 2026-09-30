"use client";

import { useState } from "react";
import { Alert, Button } from "bokoui/react";

export function DismissibleAlert() {
  const [open, setOpen] = useState(true);
  return open ? (
    <Alert action="info" title="Dismissible" onClose={() => setOpen(false)}>
      Click the × to dismiss this alert.
    </Alert>
  ) : (
    <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
      Bring the alert back
    </Button>
  );
}
