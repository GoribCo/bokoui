import type { Metadata } from "next";
import { Alert, Button, Spinner, actions, colors, sizes } from "bokoui/react";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { DismissibleAlert } from "./alerts-demo";
import { ProgressDemo, SkeletonDemo, StaticAlert, ToastDemo } from "./feedback-demo";

export const metadata: Metadata = { title: "Feedback · UI Framework" };

export default function FeedbackPage() {
  return (
    <Page>
      <PageHeader title="Feedback" description="Alert, Spinner, Progress, Skeleton and Toast tell people what is happening." />

      <Section title="Alert: action x variant" note="Danger and warning use role=alert (announced immediately); the rest use role=status.">
        {(["soft", "outline", "solid"] as const).map((variant) => (
          <div key={variant} className="flex flex-col gap-3">
            {actions.map((action) => (
              <Alert key={action} variant={variant} action={action} title={`${action[0].toUpperCase()}${action.slice(1)} (${variant})`}>
                Something you should know about this action.
              </Alert>
            ))}
          </div>
        ))}
      </Section>

      <Section title="Alert: neutral, colors and options">
        <Alert>Neutral alert with only a description.</Alert>
        {colors.map((color) => (
          <Alert key={color} color={color} title={color}>
            Brand color {color}.
          </Alert>
        ))}
        <Alert action="success" icon={false} title="No icon">
          The icon can be hidden.
        </Alert>
        <Alert action="warning" title="With actions">
          <div className="mt-2 flex gap-2">
            <Button size="sm" action="warning">
              Fix it
            </Button>
            <Button size="sm" variant="ghost" color="neutral">
              Later
            </Button>
          </div>
        </Alert>
        <DismissibleAlert />
      </Section>

      <Section title="Spinner">
        <div className="flex flex-wrap items-center gap-6">
          {sizes.map((size) => (
            <Spinner key={size} size={size} />
          ))}
          {colors.map((color) => (
            <Spinner key={color} color={color} />
          ))}
          {actions.map((action) => (
            <Spinner key={action} action={action} label={`${action} loading`} />
          ))}
        </div>
      </Section>

      <Section title="Progress" note="Determinate bars expose aria-valuenow; without a value it is indeterminate.">
        <ProgressDemo />
      </Section>

      <Section title="Skeleton" note="Decorative placeholders. Mark the region aria-busy while loading.">
        <SkeletonDemo />
      </Section>

      <Section title="Toast" note="Stacks bottom-right, stays above open dialogs, pauses on hover and focus.">
        <StaticAlert />
        <ToastDemo />
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Alert", "Spinner", "Progress", "Skeleton", "SkeletonText", "ToastProvider"]} />
      </Section>
    </Page>
  );
}
