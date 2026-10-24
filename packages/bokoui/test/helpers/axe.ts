import axe from "axe-core";
import { expect } from "vitest";

/**
 * Runs axe on `container` and fails with a readable list of violations. jsdom has no layout, so
 * rules that need real rendering are off here and covered by the browser sweep instead:
 * color-contrast, and region (whole-page landmark rule).
 */
export async function expectNoA11yViolations(container: Element) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false }, "scrollable-region-focusable": { enabled: false } },
  });
  const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`);
  expect(summary, summary.join("\n")).toEqual([]);
}
