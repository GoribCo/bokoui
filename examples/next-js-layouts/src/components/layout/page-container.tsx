import type { ReactNode } from "react";
import { Container } from "bokoui/react";

export interface PageContainerProps {
  /** Max content width: `full` for tables and dashboards, `md` for reading and forms. */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  children: ReactNode;
}

/** Centers page content with a max width and vertical rhythm. */
export function PageContainer({ size = "xl", className, children }: PageContainerProps) {
  return (
    <Container size={size} className={["flex flex-col gap-6 py-6 md:py-8", className].filter(Boolean).join(" ")}>
      {children}
    </Container>
  );
}
