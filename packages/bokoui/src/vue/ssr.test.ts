// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSSRApp, h } from "vue";
import { renderToString } from "vue/server-renderer";
import { Menu, MenuItem } from "./menu";
import { Modal } from "./modal";
import { Select } from "./select";
import { Tab, TabList, TabPanel, Tabs } from "./tabs";
import { Tooltip } from "./tooltip";

// Nuxt renders on the server, where there is no window or document. jsdom tests cannot catch that.
const render = (vnode: () => ReturnType<typeof h>) => renderToString(createSSRApp({ render: vnode }));

describe("server rendering (no window/document)", () => {
  it("renders Select", async () => {
    const html = await render(() => h(Select, { options: [{ value: "a", label: "A" }], modelValue: "a", name: "x" }));
    expect(html).toContain('role="combobox"');
    expect(html).toContain("A");
  });

  it("renders Tooltip, Menu and Modal closed", async () => {
    expect(await render(() => h(Tooltip, { content: "Tip" }, () => h("button", "x")))).toContain("<button");
    expect(await render(() => h(Menu, null, { trigger: () => h("button", "Open"), default: () => h(MenuItem, null, () => "Item") }))).toContain("aria-haspopup=\"menu\"");
    expect(await render(() => h(Modal, { modelValue: false, title: "T" }, () => "Body"))).toContain("<dialog");
  });

  it("renders Modal that is initially open without touching the DOM", async () => {
    expect(await render(() => h(Modal, { modelValue: true, title: "T" }, () => "Body"))).toContain("Body");
  });

  it("renders Tabs", async () => {
    const html = await render(() =>
      h(Tabs, { defaultValue: "a" }, () => [h(TabList, null, () => h(Tab, { value: "a" }, () => "A")), h(TabPanel, { value: "a" }, () => "Panel")]),
    );
    expect(html).toContain('role="tablist"');
    expect(html).toContain("Panel");
  });
});
