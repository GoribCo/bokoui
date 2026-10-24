"use client";

import { useEffect, useState } from "react";
import { Alert, Button, Progress, Skeleton, SkeletonText, Text, actions } from "bokoui/react";
import { useToast } from "bokoui/react/client";

export function ProgressDemo() {
  const [value, setValue] = useState(35);
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Progress label="Uploading photos" value={value} showValue />
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 15))}>
          -15
        </Button>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.min(100, v + 15))}>
          +15
        </Button>
      </div>
      <Progress label="Indeterminate" />
      <div className="grid gap-4 sm:grid-cols-2">
        {(["sm", "md", "lg"] as const).map((size) => (
          <Progress key={size} size={size} value={60} aria-label={`Size ${size}`} />
        ))}
        {actions.map((action) => (
          <Progress key={action} action={action} value={70} aria-label={action} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, [loading]);
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <div className="flex items-start gap-4 rounded-card border border-border p-4" aria-busy={loading}>
        {loading ? (
          <>
            <Skeleton shape="circle" className="size-12" />
            <div className="flex flex-1 flex-col gap-3">
              <Skeleton className="h-5 w-40" />
              <SkeletonText lines={3} />
            </div>
          </>
        ) : (
          <>
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--tone-soft) text-(--tone-ink)" data-tone="primary">
              AL
            </div>
            <div className="flex flex-col gap-1">
              <Text className="font-medium">Ada Lovelace</Text>
              <Text variant="small" muted>
                The content arrived, and the skeleton was replaced without moving anything.
              </Text>
            </div>
          </>
        )}
      </div>
      <div>
        <Button size="sm" variant="outline" onClick={() => setLoading(true)} disabled={loading}>
          Reload
        </Button>
      </div>
      <Skeleton shape="rect" className="h-24 w-full" />
    </div>
  );
}

export function ToastDemo() {
  const { toast, dismiss } = useToast();
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => toast({ title: "Saved", description: "Your changes are live.", action: "success" })}>Success</Button>
      <Button variant="outline" action="info" onClick={() => toast({ title: "New version", description: "Reload to update.", action: "info" })}>
        Info
      </Button>
      <Button variant="outline" action="warning" onClick={() => toast({ title: "Storage almost full", action: "warning", duration: 8000 })}>
        Warning (8s)
      </Button>
      <Button variant="outline" action="danger" onClick={() => toast({ title: "Upload failed", description: "Stays until dismissed.", action: "danger", duration: 0 })}>
        Error (sticky)
      </Button>
      <Button variant="ghost" color="neutral" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

export function StaticAlert() {
  return <Alert action="info">Toasts pause while hovered or focused, and announce politely (errors and warnings assertively).</Alert>;
}
