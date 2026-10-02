import { forwardRef, type HTMLAttributes } from "react";
import { cardClass, cardFooterClass, cardHeaderClass, type CardStyleProps } from "@/core";

export interface CardProps extends HTMLAttributes<HTMLDivElement>, CardStyleProps {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, interactive, ...props },
  ref,
) {
  return <div ref={ref} className={cardClass({ variant, padding, interactive }, className)} {...props} />;
});

/** Title and description stack at the top of a card. Put a `Heading` and `Text` inside. */
export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cardHeaderClass(className)} {...props} />;
});

/** Row of actions at the bottom of a card. */
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cardFooterClass(className)} {...props} />;
});
