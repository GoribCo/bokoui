import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/vue/menu";
import { Modal } from "@/vue/modal";
import { Select } from "@/vue/select";
import { Tab, TabList, TabPanel, Tabs } from "@/vue/tabs";
import { Tooltip } from "@/vue/tooltip";

const mounted: VueWrapper[] = [];
function mountAttached(component: Parameters<typeof mount>[0], options: Record<string, unknown> = {}) {
  const wrapper = mount(component as never, { attachTo: document.body, ...options }) as VueWrapper;
  mounted.push(wrapper);
  return wrapper;
}
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});
const key = (wrapper: { trigger: (e: string, o?: object) => Promise<void> }, k: string) => wrapper.trigger("keydown", { key: k });
const flush = async () => {
  await nextTick();
  await nextTick();
};

describe("Tabs (Vue)", () => {
  const Example = defineComponent({
    props: { orientation: String },
    setup(props) {
      const value = ref("a");
      return () =>
        h(Tabs, { modelValue: value.value, "onUpdate:modelValue": (v: string) => (value.value = v), orientation: props.orientation as "vertical" | undefined }, () => [
          h(TabList, { "aria-label": "Sections" }, () => [
            h(Tab, { value: "a" }, () => "One"),
            h(Tab, { value: "b" }, () => "Two"),
            h(Tab, { value: "c", disabled: true }, () => "Three"),
            h(Tab, { value: "d" }, () => "Four"),
          ]),
          h(TabPanel, { value: "a" }, () => "Panel A"),
          h(TabPanel, { value: "b" }, () => "Panel B"),
          h(TabPanel, { value: "d" }, () => "Panel D"),
        ]);
    },
  });

  it("shows the selected panel, links aria, and uses a roving tabindex", () => {
    const w = mountAttached(Example);
    const tabs = w.findAll('[role="tab"]');
    expect(tabs[0].attributes("aria-selected")).toBe("true");
    expect(tabs[0].attributes("tabindex")).toBe("0");
    expect(tabs[1].attributes("tabindex")).toBe("-1");
    const panels = w.findAll('[role="tabpanel"]');
    expect(panels[0].isVisible()).toBe(true);
    expect(panels[1].isVisible()).toBe(false);
    expect(tabs[0].attributes("aria-controls")).toBe(panels[0].attributes("id"));
    expect(panels[0].attributes("aria-labelledby")).toBe(tabs[0].attributes("id"));
  });

  it("switches on click and via arrow keys, skipping disabled tabs", async () => {
    const w = mountAttached(Example);
    const list = w.find('[role="tablist"]');
    (w.findAll('[role="tab"]')[0].element as HTMLElement).focus();
    await key(list, "ArrowRight");
    expect(document.activeElement?.textContent).toBe("Two");
    await key(list, "ArrowRight");
    expect(document.activeElement?.textContent).toBe("Four");
    expect(w.findAll('[role="tabpanel"]')[2].isVisible()).toBe(true);
    await key(list, "ArrowRight");
    expect(document.activeElement?.textContent).toBe("One");
    await w.findAll('[role="tab"]')[1].trigger("click");
    expect(w.findAll('[role="tabpanel"]')[1].isVisible()).toBe(true);
  });

  it("uses up/down when vertical", async () => {
    const w = mountAttached(Example, { props: { orientation: "vertical" } });
    (w.findAll('[role="tab"]')[0].element as HTMLElement).focus();
    await key(w.find('[role="tablist"]'), "ArrowRight");
    expect(document.activeElement?.textContent).toBe("One");
    await key(w.find('[role="tablist"]'), "ArrowDown");
    expect(document.activeElement?.textContent).toBe("Two");
  });
});

describe("Modal (Vue)", () => {
  function make(open = true) {
    const isOpen = ref(open);
    const Host = defineComponent({
      setup: () => () =>
        h(Modal, { modelValue: isOpen.value, "onUpdate:modelValue": (v: boolean) => (isOpen.value = v), title: "Hello", description: "Desc" }, {
          default: () => h("p", { id: "inside" }, "Body"),
          footer: () => h("button", "OK"),
        }),
    });
    return { isOpen, wrapper: mountAttached(Host) };
  }

  it("opens and closes the native dialog with v-model, locking scroll while open", async () => {
    const { isOpen, wrapper } = make(false);
    const dialog = wrapper.find("dialog").element as HTMLDialogElement;
    expect(dialog.hasAttribute("open")).toBe(false);
    isOpen.value = true;
    await flush();
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    isOpen.value = false;
    await flush();
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(document.body.style.overflow).toBe("");
  });

  it("is labelled by title and described by description", () => {
    const { wrapper } = make();
    const dialog = wrapper.find("dialog");
    expect(wrapper.find(`#${CSS.escape(dialog.attributes("aria-labelledby")!)}`).text()).toBe("Hello");
    expect(wrapper.find(`#${CSS.escape(dialog.attributes("aria-describedby")!)}`).text()).toBe("Desc");
  });

  it("closes from the × button, the backdrop, and Escape (cancel), but not from content clicks", async () => {
    const { isOpen, wrapper } = make();
    await wrapper.find("#inside").trigger("click");
    expect(isOpen.value).toBe(true);
    await wrapper.find("dialog").trigger("click");
    expect(isOpen.value).toBe(false);
    isOpen.value = true;
    await flush();
    await wrapper.find('button[aria-label="Close"]').trigger("click");
    expect(isOpen.value).toBe(false);
    isOpen.value = true;
    await flush();
    await wrapper.find("dialog").trigger("cancel");
    expect(isOpen.value).toBe(false);
  });

  it("renders the footer slot and only sets display:flex when open", () => {
    const { wrapper } = make();
    expect(wrapper.text()).toContain("OK");
    const classes = wrapper.find("dialog").classes();
    expect(classes).toContain("open:flex");
    expect(classes).not.toContain("flex");
  });
});

describe("Tooltip (Vue)", () => {
  const Example = () => h(Tooltip, { content: "Save file", delay: 0 }, () => h("button", "Save"));

  it("shows on focus, describes the trigger, and hides on blur and Escape", async () => {
    const w = mountAttached(Example);
    expect(w.find('[role="tooltip"]').exists()).toBe(false);
    await w.find("button").trigger("focus");
    await flush();
    const tip = w.find('[role="tooltip"]');
    expect(tip.text()).toBe("Save file");
    expect(w.find("button").attributes("aria-describedby")).toBe(tip.attributes("id"));
    await w.find("button").trigger("blur");
    expect(w.find('[role="tooltip"]').exists()).toBe(false);
    await w.find("button").trigger("focus");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flush();
    expect(w.find('[role="tooltip"]').exists()).toBe(false);
  });

  it("shows on hover after the delay and not when disabled", async () => {
    const w = mountAttached(() => h(Tooltip, { content: "Tip", delay: 0, disabled: true }, () => h("button", "x")));
    await w.find("button").trigger("mouseenter");
    await flush();
    expect(w.find('[role="tooltip"]').exists()).toBe(false);
  });
});

describe("Menu (Vue)", () => {
  const picked: string[] = [];
  const Example = () =>
    h(Menu, null, {
      trigger: () => h("button", "Options"),
      default: () => [
        h(MenuLabel, null, () => "Actions"),
        h(MenuItem, { onSelect: () => picked.push("Edit") }, () => "Edit"),
        h(MenuItem, { disabled: true }, () => "Copy"),
        h(MenuSeparator),
        h(MenuItem, { danger: true, onSelect: () => picked.push("Delete") }, () => "Delete"),
        h(MenuItem, { onSelect: (e: Event) => (e.preventDefault(), picked.push("Stay")) }, () => "Stay"),
      ],
    });

  it("advertises the popup and opens on click with the first item focused", async () => {
    const w = mountAttached(Example);
    const trigger = w.find("button");
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    await trigger.trigger("click");
    await flush();
    await flush();
    expect(w.find('[role="menu"]').exists()).toBe(true);
    expect(trigger.attributes("aria-expanded")).toBe("true");
    expect(document.activeElement?.textContent).toBe("Edit");
  });

  it("moves with arrows (skipping disabled), selects with click, closes and returns focus", async () => {
    picked.length = 0;
    const w = mountAttached(Example);
    await w.find("button").trigger("click");
    await flush();
    await flush();
    const menu = w.find('[role="menu"]');
    await key(menu, "ArrowDown");
    expect(document.activeElement?.textContent).toBe("Delete");
    await w.findAll('[role="menuitem"]')[2].trigger("click");
    expect(picked).toEqual(["Delete"]);
    expect(w.find('[role="menu"]').exists()).toBe(false);
    expect(document.activeElement).toBe(w.find("button").element);
  });

  it("closes on Escape, ignores disabled items, and stays open when select is prevented", async () => {
    picked.length = 0;
    const w = mountAttached(Example);
    await w.find("button").trigger("click");
    await flush();
    await w.findAll('[role="menuitem"]')[1].trigger("click");
    expect(w.find('[role="menu"]').exists()).toBe(true);
    await w.findAll('[role="menuitem"]')[3].trigger("click");
    expect(picked).toEqual(["Stay"]);
    expect(w.find('[role="menu"]').exists()).toBe(true);
    await key(w.find('[role="menu"]'), "Escape");
    expect(w.find('[role="menu"]').exists()).toBe(false);
  });
});

describe("Select (Vue)", () => {
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "avocado", label: "Avocado", disabled: true },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
  ];
  function make(extra: Record<string, unknown> = {}) {
    const value = ref<string | undefined>(undefined);
    const Host = defineComponent({
      setup: () => () => h(Select, { options: fruits, "aria-label": "Fruit", modelValue: value.value, "onUpdate:modelValue": (v: string) => (value.value = v), ...extra }),
    });
    return { value, wrapper: mountAttached(Host) };
  }

  it("shows the placeholder, opens with the keyboard, skips disabled, and commits with Enter", async () => {
    const { value, wrapper } = make();
    const combo = wrapper.find('[role="combobox"]');
    expect(combo.text()).toContain("Select…");
    expect(combo.attributes("aria-haspopup")).toBe("listbox");
    await key(combo, "ArrowDown");
    expect(wrapper.findAll('[role="option"]')).toHaveLength(4);
    expect(combo.attributes("aria-expanded")).toBe("true");
    await key(combo, "ArrowDown");
    await key(combo, "Enter");
    expect(value.value).toBe("banana");
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    expect(wrapper.find('[role="combobox"]').text()).toContain("Banana");
  });

  it("chooses by click, but not disabled options", async () => {
    const { value, wrapper } = make();
    await wrapper.find('[role="combobox"]').trigger("click");
    await wrapper.findAll('[role="option"]')[1].trigger("click");
    expect(value.value).toBeUndefined();
    await wrapper.findAll('[role="option"]')[3].trigger("click");
    expect(value.value).toBe("blueberry");
  });

  it("changes value by typeahead while closed", async () => {
    const { value, wrapper } = make();
    await key(wrapper.find('[role="combobox"]'), "b");
    expect(value.value).toBe("banana");
  });

  it("marks invalid, submits through a hidden input, and can be disabled", async () => {
    const { wrapper } = make({ invalid: true, name: "fruit", disabled: true });
    const combo = wrapper.find('[role="combobox"]');
    expect(combo.attributes("aria-invalid")).toBe("true");
    expect(combo.attributes("disabled")).toBeDefined();
    expect(wrapper.find('input[type="hidden"]').attributes("name")).toBe("fruit");
    await key(combo, "ArrowDown");
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });
});
