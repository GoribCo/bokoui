import { forwardRef, type HTMLAttributes } from "react";
import { headingClass, type HeadingLevel, type HeadingSize } from "@/core";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Rendered element. Default `h2`. Keep the document outline in order. */
  as?: HeadingLevel;
  /** Visual size, independent of the element. Defaults from `as`. */
  size?: HeadingSize;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as: Tag = "h2", size, className, ...props },
  ref,
) {
  return <Tag ref={ref} className={headingClass(Tag, size, className)} {...props} />;
});
