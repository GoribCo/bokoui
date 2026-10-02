import { Container, type ContainerProps } from "bokoui/expo";
import type { ReactNode } from "react";

export interface PageContainerProps {
  size?: ContainerProps["size"];
  children: ReactNode;
}

/** Centers a screen's content with a max width, side padding and a gap between its blocks. */
export function PageContainer({ size = "lg", children }: PageContainerProps) {
  return (
    <Container size={size} style={{ paddingVertical: 20, gap: 20 }}>
      {children}
    </Container>
  );
}
