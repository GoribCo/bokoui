import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import {
  icons,
  tableCaptionClass,
  tableClass,
  tableHeadClass,
  tableHeaderCellClass,
  tableNumericClass,
  tableSortButtonClass,
  tableWrapperClass,
  cn,
  type TableStyleProps,
} from "@/core";
import { Icon } from "../internal/icon";

export interface TableProps extends HTMLAttributes<HTMLTableElement>, TableStyleProps {
  /** Class for the scroll wrapper around the table. */
  wrapperClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, wrapperClassName, striped, hoverable, density, "aria-label": label, ...props },
  ref,
) {
  // The label names the scroll region; the table itself is named by its <caption>.
  return (
    <div className={tableWrapperClass(wrapperClassName)} tabIndex={0} role="region" aria-label={label}>
      <table ref={ref} data-tone="primary" className={tableClass({ striped, hoverable, density }, className)} {...props} />
    </div>
  );
});

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption(
  { className, ...props },
  ref,
) {
  return <caption ref={ref} className={tableCaptionClass(className)} {...props} />;
});

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableHeader(
  { className, ...props },
  ref,
) {
  return <thead ref={ref} className={tableHeadClass(className)} {...props} />;
});

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(function TableBody(props, ref) {
  return <tbody ref={ref} {...props} />;
});

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow(props, ref) {
  return <tr ref={ref} {...props} />;
});

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
  /** Current sort of this column. Adds `aria-sort` and, with `onSort`, a sort button. */
  sort?: "ascending" | "descending" | "none";
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, numeric, sort, onSort, children, ...props },
  ref,
) {
  return (
    <th
      ref={ref}
      scope="col"
      aria-sort={sort}
      className={cn(tableHeaderCellClass(className), numeric && tableNumericClass)}
      {...props}
    >
      {onSort ? (
        <button type="button" onClick={onSort} className={tableSortButtonClass}>
          {children}
          <Icon node={sort === "ascending" ? icons.sortAsc : sort === "descending" ? icons.sortDesc : icons.sortNone} />
        </button>
      ) : (
        children
      )}
    </th>
  );
});

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, numeric, ...props },
  ref,
) {
  return <td ref={ref} className={cn(numeric && tableNumericClass, className)} {...props} />;
});
