import type { ReactNode } from "react";
import { Heading, Text } from "bokoui/react";

export interface StatusViewProps {
  title: string;
  description: string;
  /** Short code shown above the title, e.g. "404". */
  code?: string;
  /** Buttons or links under the text. */
  actions?: ReactNode;
}

/** Centered message for not-found, error and not-authorized states. */
export function StatusView({ title, description, code, actions }: StatusViewProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      {code ? <Text muted className="text-caption tracking-widest">{code}</Text> : null}
      <Heading as="h1" className="text-title">
        {title}
      </Heading>
      <Text muted className="max-w-prose">
        {description}
      </Text>
      {actions ? <div className="mt-2 flex flex-wrap justify-center gap-2">{actions}</div> : null}
    </div>
  );
}
