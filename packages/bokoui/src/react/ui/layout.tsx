import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import {
  containerClass,
  gridClass,
  inlineClass,
  stackClass,
  type ContainerStyleProps,
  type GridStyleProps,
  type InlineStyleProps,
  type StackStyleProps,
} from "@/core";

type LayoutBase = HTMLAttributes<HTMLElement> & {
  /** Rendered element. Use `ul`/`ol` (with `li` children), `section`, `nav`, etc. Default `div`. */
  as?: ElementType;
};

export type StackProps = LayoutBase & StackStyleProps;
/** Children in a column with a gap. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack({ as: Tag = "div", gap, align, className, ...props }, ref) {
  return <Tag ref={ref} className={stackClass({ gap, align }, className)} {...props} />;
});

export type InlineProps = LayoutBase & InlineStyleProps;
/** Children in a wrapping row with a gap: button rows, tag lists, toolbars. */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
  { as: Tag = "div", gap, align, justify, className, ...props },
  ref,
) {
  return <Tag ref={ref} className={inlineClass({ gap, align, justify }, className)} {...props} />;
});

export type ContainerProps = LayoutBase & ContainerStyleProps;
/** Centers content with a max width and responsive side padding. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container({ as: Tag = "div", size, className, ...props }, ref) {
  return <Tag ref={ref} className={containerClass({ size }, className)} {...props} />;
});

export type GridProps = LayoutBase & GridStyleProps;
/** Responsive columns. For anything more specific, use Tailwind grid classes on a plain element. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid({ as: Tag = "div", gap, cols, className, ...props }, ref) {
  return <Tag ref={ref} className={gridClass({ gap, cols }, className)} {...props} />;
});
