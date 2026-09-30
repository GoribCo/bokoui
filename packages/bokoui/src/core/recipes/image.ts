import { cva } from "class-variance-authority";
import { cn, type ClassValue } from "../cn";

export type ImageAspect = "auto" | "square" | "video" | "portrait";
export type ImageFit = "cover" | "contain";

/** Frame styling for images. Aspect ratio reserves space, which prevents layout shift. */
export const imageVariants = cva("block max-w-full bg-muted", {
  variants: {
    aspect: {
      auto: "h-auto",
      square: "aspect-square w-full",
      video: "aspect-video w-full",
      portrait: "aspect-[3/4] w-full",
    },
    fit: { cover: "object-cover", contain: "object-contain" },
    rounded: { true: "rounded-card", false: "" },
  },
  defaultVariants: { aspect: "auto", fit: "cover", rounded: false },
});

export interface ImageStyleProps {
  aspect?: ImageAspect;
  fit?: ImageFit;
  rounded?: boolean;
}

export function imageClass({ aspect, fit, rounded }: ImageStyleProps, className?: ClassValue) {
  return cn(imageVariants({ aspect, fit, rounded }), className);
}
