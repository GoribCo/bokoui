import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import {
  getPageRange,
  icons,
  pageButtonClass,
  pageEllipsisClass,
  paginationClass,
  paginationListClass,
  resolveTone,
  type Action,
  type Color,
  type PaginationStyleProps,
} from "@/core";
import { Icon } from "../icon";

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, "onChange">, PaginationStyleProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  /** Called with the new page. Pages render as buttons. Omit when using `getHref`. */
  onPageChange?: (page: number) => void;
  /** Renders pages as links (server-friendly). Combine with `linkAs` for a router link. */
  getHref?: (page: number) => string;
  /** Link component used with `getHref`, e.g. `next/link`. Default `a`. */
  linkAs?: ElementType;
  /** Pages shown either side of the current one. Default 1. */
  siblings?: number;
  color?: Color;
  action?: Action;
  /** Hide the previous/next buttons. */
  hideEdges?: boolean;
  "aria-label"?: string;
}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    page,
    pageCount,
    onPageChange,
    getHref,
    linkAs,
    siblings = 1,
    size,
    color = "primary",
    action,
    hideEdges = false,
    className,
    "aria-label": label = "Pagination",
    ...props
  },
  ref,
) {
  const Link: ElementType = linkAs ?? "a";
  const items = getPageRange(page, pageCount, siblings);

  function control(target: number, content: React.ReactNode, name: string, disabled: boolean, current = false) {
    const cls = pageButtonClass({ size });
    if (getHref) {
      return (
        <Link
          href={disabled ? undefined : getHref(target)}
          aria-label={name}
          aria-current={current ? "page" : undefined}
          aria-disabled={disabled || undefined}
          className={cls}
        >
          {content}
        </Link>
      );
    }
    return (
      <button
        type="button"
        aria-label={name}
        aria-current={current ? "page" : undefined}
        disabled={disabled}
        onClick={() => onPageChange?.(target)}
        className={cls}
      >
        {content}
      </button>
    );
  }

  return (
    <nav ref={ref} aria-label={label} data-tone={resolveTone(color, action)} className={paginationClass(className)} {...props}>
      <ul className={paginationListClass}>
        {!hideEdges && (
          <li>{control(page - 1, <Icon node={icons.chevronLeft} className="rtl:rotate-180" />, "Previous page", page <= 1)}</li>
        )}
        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>{control(item, item, `Page ${item}`, false, item === page)}</li>
          ) : (
            <li key={item} aria-hidden="true" className={pageEllipsisClass}>
              <Icon node={icons.ellipsis} />
            </li>
          ),
        )}
        {!hideEdges && (
          <li>{control(page + 1, <Icon node={icons.chevronRight} className="rtl:rotate-180" />, "Next page", page >= pageCount)}</li>
        )}
      </ul>
    </nav>
  );
});
