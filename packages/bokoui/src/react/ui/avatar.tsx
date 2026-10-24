import { forwardRef, type HTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import {
  avatarClass,
  avatarImageClass,
  avatarStatusClass,
  getInitials,
  resolveTone,
  type Action,
  type AvatarStyleProps,
  type Color,
} from "@/core";

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement>, AvatarStyleProps {
  /** Image URL. The fallback shows behind it until it loads, or if it fails. */
  src?: string;
  /** Person's name: alt text for the image and source of the initials. */
  name?: string;
  /** Replaces the initials fallback (e.g. an icon). */
  fallback?: ReactNode;
  /** Brand palette slot for the fallback and status dot. Default `neutral`. */
  color?: Color;
  action?: Action;
  /** Small status dot in the corner. Colored by `statusAction`. */
  status?: boolean;
  statusAction?: Action;
  /** Extra props for the `<img>`, e.g. `onError` to hide a broken image, `loading="lazy"`. */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, size, shape, src, name, fallback, color = "neutral", action, status, statusAction = "success", imgProps, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={src ? undefined : name ? "img" : undefined}
      aria-label={src ? undefined : name}
      data-tone={resolveTone(color, action)}
      className={avatarClass({ size, shape }, className)}
      {...props}
    >
      {fallback ?? (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
      {src && <img src={src} alt={name ?? ""} {...imgProps} className={avatarImageClass} />}
      {status && <span data-tone={statusAction} className={avatarStatusClass} />}
    </span>
  );
});
