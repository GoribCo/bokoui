import { defineComponent, h, ref, useId, type PropType, type VNodeChild } from "vue";
import { dropzoneClass, fileItemClass, fileListClass, fileNameClass, fileSizeClass, formatBytes, icons, isAccepted, resolveTone, type Action, type Color } from "../core";
import { Icon } from "./icon";

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
}

const messages = {
  type: (f: File) => `${f.name}: this file type is not allowed`,
  size: (f: File, max: number) => `${f.name}: larger than ${formatBytes(max)}`,
  count: (f: File, max: number) => `${f.name}: only ${max} file${max === 1 ? "" : "s"} allowed`,
};

/**
 * Drop zone plus file list. It wraps a real file input, so click, keyboard, and form submission
 * work. Invalid files are rejected with a message (and a `reject` event). Events: `filesChange`, `reject`.
 * Slots: `label`, `hint`. `class` styles the drop zone; other attrs go to the input.
 */
export const FileUpload = defineComponent({
  name: "BokoFileUpload",
  inheritAttrs: false,
  props: {
    /** Largest allowed file, in bytes. */
    maxSize: Number,
    /** Most files allowed when `multiple`. */
    maxFiles: Number,
    label: { type: String as PropType<string>, default: "Drop files here or click to browse" },
    hint: String,
    accept: String,
    multiple: { type: Boolean, default: false },
    color: { type: String as PropType<Color>, default: "primary" },
    action: String as PropType<Action>,
    invalid: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    removeLabel: { type: String, default: "Remove" },
  },
  emits: ["filesChange", "reject"],
  setup(props, { attrs, slots, emit }) {
    const generated = useId();
    const input = ref<HTMLInputElement | null>(null);
    const files = ref<File[]>([]);
    const errors = ref<string[]>([]);
    const dragging = ref(false);

    // Mirror the accepted files into the real input so a surrounding <form> submits them.
    function commit(next: File[]) {
      files.value = next;
      emit("filesChange", next);
      if (input.value && typeof DataTransfer !== "undefined") {
        const dt = new DataTransfer();
        next.forEach((f) => dt.items.add(f));
        input.value.files = dt.files;
      }
    }

    function add(incoming: File[]) {
      const accepted: File[] = [];
      const rejected: FileRejection[] = [];
      const base = props.multiple ? files.value : [];
      for (const file of incoming) {
        if (!isAccepted(file, props.accept)) rejected.push({ file, reason: "type" });
        else if (props.maxSize !== undefined && file.size > props.maxSize) rejected.push({ file, reason: "size" });
        else if (props.multiple && props.maxFiles !== undefined && base.length + accepted.length >= props.maxFiles) rejected.push({ file, reason: "count" });
        else accepted.push(file);
      }
      errors.value = rejected.map((r) => (r.reason === "size" ? messages.size(r.file, props.maxSize!) : r.reason === "count" ? messages.count(r.file, props.maxFiles!) : messages.type(r.file)));
      if (rejected.length) emit("reject", rejected);
      if (accepted.length) commit(props.multiple ? [...base, ...accepted] : [accepted[0]]);
    }

    return () => {
      const { class: cls, id, ...rest } = attrs;
      const inputId = (id as string | undefined) ?? generated;
      const errorsId = `${inputId}-errors`;
      const tone = props.invalid || errors.value.length ? "danger" : resolveTone(props.color, props.action);
      const hint = slots.hint?.() ?? props.hint;
      return h("div", { class: "flex w-full flex-col gap-3", "data-tone": tone }, [
        h(
          "label",
          {
            for: inputId,
            "data-dragging": dragging.value ? "" : undefined,
            "aria-invalid": props.invalid || errors.value.length > 0 || undefined,
            class: dropzoneClass(cls as string),
            onDragenter: (e: DragEvent) => (e.preventDefault(), !props.disabled && (dragging.value = true)),
            onDragover: (e: DragEvent) => e.preventDefault(),
            onDragleave: (e: DragEvent) => !(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node) && (dragging.value = false),
            onDrop: (e: DragEvent) => {
              e.preventDefault();
              dragging.value = false;
              if (!props.disabled) add(Array.from(e.dataTransfer?.files ?? []));
            },
          },
          [
            h(Icon, { node: icons.upload }),
            h("span", { class: "text-sm font-medium" }, slots.label?.() ?? props.label),
            hint && h("span", { class: "text-xs text-muted-foreground" }, hint),
            h("input", {
              ...rest,
              ref: input,
              id: inputId,
              type: "file",
              class: "sr-only",
              accept: props.accept,
              multiple: props.multiple,
              disabled: props.disabled,
              "aria-describedby": errors.value.length ? errorsId : (rest["aria-describedby"] as string | undefined),
              onChange: (event: Event) => add(Array.from((event.target as HTMLInputElement).files ?? [])),
            }),
          ] as VNodeChild[],
        ),
        errors.value.length > 0 &&
          h("ul", { id: errorsId, role: "alert", "data-tone": "danger", class: "flex flex-col gap-1 text-sm text-(--tone-ink)" }, errors.value.map((message) => h("li", { key: message }, message))),
        files.value.length > 0 &&
          h(
            "ul",
            { class: fileListClass, "aria-label": "Selected files" },
            files.value.map((file) =>
              h("li", { key: `${file.name}-${file.size}-${file.lastModified}`, class: fileItemClass }, [
                h(Icon, { node: icons.file }),
                h("span", { class: fileNameClass }, file.name),
                h("span", { class: fileSizeClass }, formatBytes(file.size)),
                h(
                  "button",
                  {
                    type: "button",
                    "aria-label": `${props.removeLabel} ${file.name}`,
                    disabled: props.disabled,
                    onClick: () => commit(files.value.filter((f) => f !== file)),
                    class: "inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-ring pointer-coarse:size-9",
                  },
                  [h(Icon, { node: icons.close })],
                ),
              ]),
            ),
          ),
      ]);
    };
  },
});
