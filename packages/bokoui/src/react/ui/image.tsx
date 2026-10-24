import { forwardRef, type ComponentType, type ImgHTMLAttributes } from "react";
import { imageClass, type ImageStyleProps } from "@/core";

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, ImageStyleProps {
  /** Alternative text. Required; pass `""` for a purely decorative image. */
  alt: string;
  /**
   * Component to render instead of `<img>`, e.g. `next/image`. It receives every prop
   * plus the computed `className`, so it must accept them.
   */
  as?: ComponentType<Record<string, unknown>>;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { className, aspect, fit, rounded, as, loading = "lazy", decoding = "async", ...props },
  ref,
) {
  const Tag = as ?? "img";
  return <Tag ref={ref} loading={loading} decoding={decoding} className={imageClass({ aspect, fit, rounded }, className)} {...props} />;
});
