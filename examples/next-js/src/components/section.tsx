import type { ReactNode } from "react";
import { Heading, Text } from "bokoui/react";

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="flex flex-col gap-2">
      <Heading as="h1">{title}</Heading>
      <Text variant="lead" muted>
        {description}
      </Text>
    </header>
  );
}

export function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Heading as="h2" size="lg">
          {title}
        </Heading>
        {note && (
          <Text variant="small" muted>
            {note}
          </Text>
        )}
      </div>
      {children}
    </section>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">{children}</main>;
}
