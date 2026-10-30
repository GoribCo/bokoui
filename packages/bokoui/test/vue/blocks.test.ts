import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { createSSRApp, defineComponent, h, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import * as boko from "@/vue";

const mounted: VueWrapper[] = [];
const attach = (component: Parameters<typeof mount>[0], options: Record<string, unknown> = {}) => {
  const w = mount(component as never, { attachTo: document.body, ...options }) as VueWrapper;
  mounted.push(w);
  return w;
};
afterEach(() => {
  mounted.splice(0).forEach((w) => w.unmount());
  document.body.innerHTML = "";
});
const ssr = (vnode: () => ReturnType<typeof h>) => renderToString(createSSRApp({ render: vnode }));

describe("Vue blocks render on the server", () => {
  const cases: Record<string, () => ReturnType<typeof h>> = {
    Progress: () => h(boko.Progress, { value: 40, label: "Upload", showValue: true }),
    Rating: () => h(boko.Rating, { modelValue: 3, readOnly: true }),
    Skeleton: () => h(boko.SkeletonText, { lines: 2 }),
    Slider: () => h(boko.Slider, { modelValue: 5, "aria-label": "Volume" }),
    Tag: () => h(boko.Tag, { onRemove: () => {} }, () => "Vue"),
    Stack: () => h(boko.Stack, { gap: 4 }, () => "x"),
    Accordion: () => h(boko.Accordion, null, () => h(boko.AccordionItem, { value: "a" }, () => [h(boko.AccordionTrigger, null, () => "Q"), h(boko.AccordionContent, null, () => "A")])),
    Breadcrumb: () => h(boko.Breadcrumb, null, () => [h(boko.BreadcrumbItem, { href: "/" }, () => "Home"), h(boko.BreadcrumbItem, { current: true }, () => "Now")]),
    EmptyState: () => h(boko.EmptyState, { title: "Nothing" }),
    FloatingNav: () => h(boko.FloatingNav, null, () => h(boko.FloatingNavItem, { active: true, href: "/" }, () => "H")),
    Navbar: () => h(boko.Navbar, null, { brand: () => "B", default: () => h(boko.NavbarLink, { href: "/" }, () => "L") }),
    Stepper: () => h(boko.Stepper, { steps: [{ label: "A" }, { label: "B" }], current: 1 }),
    Table: () => h(boko.Table, null, () => h(boko.TableBody, null, () => h(boko.TableRow, null, () => h(boko.TableCell, null, () => "c")))),
    Pagination: () => h(boko.Pagination, { page: 2, pageCount: 9, getHref: (p: number) => `?p=${p}` }),
    Sidebar: () => h(boko.Sidebar, null, () => h(boko.SidebarItem, { href: "/" }, { default: () => "Home" })),
    Popover: () => h(boko.Popover, null, { trigger: () => h("button", "Open"), default: () => "Body" }),
    Calendar: () => h(boko.Calendar, { defaultMonth: new Date(2024, 0, 1) }),
    DatePicker: () => h(boko.DatePicker, { defaultValue: new Date(2024, 0, 5) }),
    Combobox: () => h(boko.Combobox, { options: [{ value: "a", label: "Alpha" }], defaultValue: "a" }),
    CommandPalette: () => h(boko.CommandPalette, { modelValue: false, groups: [] }),
    FileUpload: () => h(boko.FileUpload),
    ToastProvider: () => h(boko.ToastProvider, null, () => "app"),
  };
  for (const [name, render] of Object.entries(cases)) {
    it(name, async () => expect(await ssr(render)).not.toBe(""));
  }
});

describe("Vue blocks interaction", () => {
  it("Accordion toggles on click", async () => {
    const w = attach(() => h(boko.Accordion, null, () => h(boko.AccordionItem, { value: "a" }, () => [h(boko.AccordionTrigger, null, () => "Q"), h(boko.AccordionContent, null, () => "A")])));
    const trigger = w.get("[data-accordion-trigger]");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    await trigger.trigger("click");
    expect(trigger.attributes("aria-expanded")).toBe("true");
  });

  it("Calendar selects a day and emits the date", async () => {
    const w = attach(boko.Calendar, { props: { defaultMonth: new Date(2024, 0, 1) } });
    await nextTick();
    await w.findAll("tbody button").find((b) => b.text() === "15" && !b.attributes("data-outside"))!.trigger("click");
    const emitted = w.emitted("update:modelValue")![0][0] as Date;
    expect([emitted.getMonth(), emitted.getDate()]).toEqual([0, 15]);
  });

  it("Combobox filters and chooses", async () => {
    const w = attach(boko.Combobox, { props: { options: [{ value: "a", label: "Alpha" }, { value: "b", label: "Beta" }] } });
    const input = w.get("input");
    await input.setValue("be");
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(1);
    await input.trigger("keydown", { key: "Enter" });
    expect(w.emitted("update:modelValue")![0]).toEqual(["b"]);
  });

  it("Pagination emits the clicked page", async () => {
    const w = attach(boko.Pagination, { props: { page: 1, pageCount: 3 } });
    await w.get('[aria-label="Page 2"]').trigger("click");
    expect(w.emitted("update:page")![0]).toEqual([2]);
  });

  it("Toast shows through useToast", async () => {
    const Child = defineComponent({ setup() { const { toast } = boko.useToast(); return () => h("button", { onClick: () => toast({ title: "Saved", duration: 0 }) }, "go"); } });
    const w = attach(() => h(boko.ToastProvider, null, () => h(Child)));
    await w.get("button").trigger("click");
    await nextTick();
    expect(document.body.textContent).toContain("Saved");
  });
});

describe("Drawer", () => {
  it("renders a left drawer dialog", async () => {
    expect(await ssr(() => h(boko.Drawer, { modelValue: false, side: "left", title: "Menu" }, () => "x"))).toContain("<dialog");
  });
});
