import { forwardRef, useCallback, useId, useImperativeHandle, useRef, useState, type DragEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { dropzoneClass, fileItemClass, fileListClass, fileNameClass, fileSizeClass, formatBytes, icons, isAccepted, resolveTone, type Action, type Color } from "@/core";
import { Icon } from "../ui/icon";

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
}

export interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange" | "size"> {
  onFilesChange?: (files: File[]) => void;
  onReject?: (rejections: FileRejection[]) => void;
  /** Largest allowed file, in bytes. */
  maxSize?: number;
  /** Most files allowed when `multiple`. */
  maxFiles?: number;
  /** Prompt text. */
  label?: ReactNode;
  hint?: ReactNode;
  color?: Color;
  action?: Action;
  invalid?: boolean;
  removeLabel?: string;
}

const messages = {
  type: (f: File) => `${f.name}: this file type is not allowed`,
  size: (f: File, max: number) => `${f.name}: larger than ${formatBytes(max)}`,
  count: (f: File, max: number) => `${f.name}: only ${max} file${max === 1 ? "" : "s"} allowed`,
};

/**
 * Drop zone plus file list. It wraps a real file input, so click, keyboard, and form submission
 * work; dropped files are copied into the input. Invalid files are rejected with a message.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  { onFilesChange, onReject, maxSize, maxFiles, label = "Drop files here or click to browse", hint, accept, multiple = false, color = "primary", action, invalid = false, disabled, removeLabel = "Remove", id, className, ...props },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const errorsId = `${inputId}-errors`;
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  // Mirror the accepted files into the real input so a surrounding <form> submits them.
  const commit = useCallback(
    (next: File[]) => {
      setFiles(next);
      onFilesChange?.(next);
      if (input.current && typeof DataTransfer !== "undefined") {
        const dt = new DataTransfer();
        next.forEach((f) => dt.items.add(f));
        input.current.files = dt.files;
      }
    },
    [onFilesChange],
  );

  const add = useCallback(
    (incoming: File[]) => {
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];
      const base = multiple ? files : [];
      for (const file of incoming) {
        if (!isAccepted(file, accept)) rejected.push({ file, reason: "type" });
        else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: "size" });
        else if (multiple && maxFiles !== undefined && base.length + accepted.length >= maxFiles) rejected.push({ file, reason: "count" });
        else accepted.push(file);
      }
      setErrors(rejected.map((r) => (r.reason === "size" ? messages.size(r.file, maxSize!) : r.reason === "count" ? messages.count(r.file, maxFiles!) : messages.type(r.file))));
      if (rejected.length) onReject?.(rejected);
      if (accepted.length) commit(multiple ? [...base, ...accepted] : [accepted[0]]);
    },
    [accept, commit, files, maxFiles, maxSize, multiple, onReject],
  );

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    add(Array.from(event.dataTransfer.files));
  }

  const tone = invalid || errors.length ? "danger" : resolveTone(color, action);

  return (
    <div className="flex w-full flex-col gap-3" data-tone={tone}>
      <label
        htmlFor={inputId}
        data-dragging={dragging ? "" : undefined}
        aria-invalid={invalid || errors.length > 0 || undefined}
        className={dropzoneClass(className)}
        onDragEnter={(e) => (e.preventDefault(), !disabled && setDragging(true))}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setDragging(false)}
        onDrop={onDrop}
      >
        <Icon node={icons.upload} />
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        <input
          ref={input}
          id={inputId}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={errors.length ? errorsId : props["aria-describedby"]}
          onChange={(event) => add(Array.from(event.target.files ?? []))}
          {...props}
        />
      </label>
      {errors.length > 0 && (
        <ul id={errorsId} role="alert" data-tone="danger" className="flex flex-col gap-1 text-sm text-(--tone-ink)">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <ul className={fileListClass} aria-label="Selected files">
          {files.map((file) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`} className={fileItemClass}>
              <Icon node={icons.file} />
              <span className={fileNameClass}>{file.name}</span>
              <span className={fileSizeClass}>{formatBytes(file.size)}</span>
              <button
                type="button"
                aria-label={`${removeLabel} ${file.name}`}
                disabled={disabled}
                onClick={() => commit(files.filter((f) => f !== file))}
                className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-ring pointer-coarse:size-9"
              >
                <Icon node={icons.close} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
