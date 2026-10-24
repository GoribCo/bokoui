"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type DialogHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  icons,
  modalBodyClass,
  modalClass,
  modalCloseClass,
  modalDescriptionClass,
  modalFooterClass,
  modalHeaderClass,
  modalTitleClass,
  type ModalStyleProps,
} from "@/core";
import { Icon } from "../internal/icon";

export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, "title" | "open" | "onClose">, ModalStyleProps {
  /** Controlled open state. */
  open: boolean;
  /** Called when the user dismisses the modal (Escape, backdrop click, close button). Set `open` to false in it. */
  onOpenChange: (open: boolean) => void;
  /** Heading; also the dialog's accessible name. Without it, pass `aria-label`. */
  title?: ReactNode;
  description?: ReactNode;
  /** Actions row at the bottom. */
  footer?: ReactNode;
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdrop?: boolean;
  /** Show the × button in the header. Default true. */
  showClose?: boolean;
  closeLabel?: string;
}

export const Modal = forwardRef<HTMLDialogElement, ModalProps>(function Modal(
  {
    open,
    onOpenChange,
    title,
    description,
    footer,
    size,
    placement,
    closeOnBackdrop = true,
    showClose = true,
    closeLabel = "Close",
    className,
    children,
    onClick,
    onCancel,
    ...props
  },
  ref,
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);
  const titleId = useId();
  const descriptionId = useId();

  // Mirror `open` onto the native dialog. showModal() gives the top layer and focus trap;
  // close() returns focus to the element that opened it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Native dialogs do not lock page scroll.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    onClick?.(event);
    // A click on the dialog element itself (not its content) is a click on the backdrop.
    if (closeOnBackdrop && event.target === event.currentTarget) onOpenChange(false);
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      className={modalClass({ size, placement }, className)}
      onClick={handleClick}
      onCancel={(event) => {
        onCancel?.(event);
        // Let React own the state: stop the browser closing it, then report the request.
        event.preventDefault();
        onOpenChange(false);
      }}
      onClose={() => {
        if (open) onOpenChange(false);
      }}
      {...props}
    >
      {(title || showClose) && (
        <div className={modalHeaderClass}>
          <div className="min-w-0">
            {title && (
              <h2 id={titleId} className={modalTitleClass}>
                {title}
              </h2>
            )}
            {description && (
              <p id={descriptionId} className={modalDescriptionClass}>
                {description}
              </p>
            )}
          </div>
          {showClose && (
            <button type="button" aria-label={closeLabel} onClick={() => onOpenChange(false)} className={modalCloseClass}>
              <Icon node={icons.close} />
            </button>
          )}
        </div>
      )}
      <div className={modalBodyClass}>{children}</div>
      {footer && <div className={modalFooterClass}>{footer}</div>}
    </dialog>
  );
});

export type DrawerProps = Omit<ModalProps, "placement"> & {
  /** Edge the drawer slides from. Default `right`. */
  side?: Exclude<ModalProps["placement"], "center">;
};

/** A `Modal` anchored to an edge (a side sheet, or a bottom sheet on phones). Same behavior and props. */
export const Drawer = forwardRef<HTMLDialogElement, DrawerProps>(function Drawer({ side = "right", ...props }, ref) {
  return <Modal ref={ref} placement={side} {...props} />;
});
