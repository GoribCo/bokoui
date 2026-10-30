import { defineComponent, h, onBeforeUnmount, onMounted, ref, useId, watch, type PropType } from "vue";
import {
  icons,
  modalBodyClass,
  modalClass,
  modalCloseClass,
  modalDescriptionClass,
  modalFooterClass,
  modalHeaderClass,
  modalTitleClass,
  type ModalPlacement,
  type ModalSize,
} from "../core";
import { Icon } from "./icon";

/**
 * Native `<dialog>` opened with `showModal()`. Use `v-model` for the open state.
 * Slots: default (body), `footer`, `title`, `description`.
 */
export const Modal = defineComponent({
  name: "BokoModal",
  inheritAttrs: false,
  props: {
    modelValue: { type: Boolean, default: false },
    size: String as PropType<ModalSize>,
    /** Side placements make a drawer (see `Drawer`). */
    placement: String as PropType<ModalPlacement>,
    title: String,
    description: String,
    /** Close when the backdrop is clicked. */
    closeOnBackdrop: { type: Boolean, default: true },
    showClose: { type: Boolean, default: true },
    closeLabel: { type: String, default: "Close" },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, slots, emit }) {
    const dialog = ref<HTMLDialogElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();
    let previousOverflow = "";

    function sync(open: boolean) {
      const el = dialog.value;
      if (!el) return;
      if (open && !el.open) el.showModal();
      if (!open && el.open) el.close();
      // Native dialogs do not lock page scroll.
      if (open) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = previousOverflow;
      }
    }
    onMounted(() => props.modelValue && sync(true));
    watch(() => props.modelValue, sync, { flush: "post" });
    onBeforeUnmount(() => props.modelValue && (document.body.style.overflow = previousOverflow));

    const request = () => emit("update:modelValue", false);

    return () => {
      const title = slots.title?.() ?? props.title;
      const description = slots.description?.() ?? props.description;
      const footer = slots.footer?.();
      return h(
        "dialog",
        {
          ...attrs,
          ref: dialog,
          "aria-labelledby": title ? titleId : undefined,
          "aria-describedby": description ? descriptionId : undefined,
          class: modalClass({ size: props.size, placement: props.placement }, attrs.class as string),
          onClick: (event: MouseEvent) => {
            (attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(event);
            // A click on the dialog element itself (not its content) is a click on the backdrop.
            if (props.closeOnBackdrop && event.target === event.currentTarget) request();
          },
          onCancel: (event: Event) => {
            // Let the parent own the state: stop the browser closing it, then report the request.
            event.preventDefault();
            request();
          },
          onClose: () => props.modelValue && request(),
        },
        [
          (title || props.showClose) &&
            h("div", { class: modalHeaderClass }, [
              h("div", { class: "min-w-0" }, [
                title && h("h2", { id: titleId, class: modalTitleClass }, title),
                description && h("p", { id: descriptionId, class: modalDescriptionClass }, description),
              ]),
              props.showClose &&
                h("button", { type: "button", "aria-label": props.closeLabel, class: modalCloseClass, onClick: request }, [
                  h(Icon, { node: icons.close }),
                ]),
            ]),
          h("div", { class: modalBodyClass }, slots.default?.()),
          footer && h("div", { class: modalFooterClass }, footer),
        ],
      );
    };
  },
});

/** A `Modal` that slides in from a `side`. Same props, slots and `v-model`. */
export const Drawer = defineComponent({
  name: "BokoDrawer",
  inheritAttrs: false,
  props: { side: { type: String as PropType<Exclude<ModalPlacement, "center">>, default: "right" } },
  setup(props, { attrs, slots }) {
    return () => h(Modal, { ...attrs, placement: props.side }, slots);
  },
});
