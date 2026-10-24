// Extracts each React component's own props (name, type, required, description, default) into
// dist/props.json, published as `bokoui/props.json`. The docs site renders prop tables from it,
// so the tables are generated from the real types and cannot drift from the code.
//
// "Own" means declared in this package's src/ (including shared style props in src/core), not the
// hundreds of inherited HTML attributes.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = path.resolve(import.meta.dirname, "..");
const entries = ["src/react/ui/index.ts", "src/react/blocks/index.ts"].map((p) => path.join(root, p));

const configPath = path.join(root, "tsconfig.json");
const config = ts.getParsedCommandLineOfConfigFile(configPath, {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} });
const program = ts.createProgram({ rootNames: entries, options: config.options });
const checker = program.getTypeChecker();

const isOwn = (decl) => {
  const file = decl.getSourceFile().fileName;
  return file.startsWith(path.join(root, "src") + path.sep) && !file.endsWith(".test.ts") && !file.endsWith(".test.tsx");
};

const clean = (text) => text.replace(/\s+/g, " ").trim();
const MAX_TYPE = 90;

function describe(symbol) {
  return clean(ts.displayPartsToString(symbol.getDocumentationComment(checker)));
}

// Only a literal counts as a default: `code`, a number, true/false or a quoted string. Prose such as
// "Default auto-dismiss delay" is not a value.
function defaultOf(description) {
  const m = /\bDefaults?(?: to)?:?\s+(`[^`]+`|"[^"]+"|\d+(?:\.\d+)?|true|false)(?=[\s.,;]|$)/i.exec(description);
  return m ? m[1].replace(/^[`"]|[`"]$/g, "") : undefined;
}

// Components that share a props type under a different name.
const propsAlias = { Checkbox: "ToggleProps", Radio: "ToggleProps", Switch: "ToggleProps" };

// Standard wording for props that recur across components, used when a prop has no JSDoc of its own.
const common = {
  color: "Brand palette slot: primary, secondary, accent or neutral.",
  action: "Semantic intent (success, warning, danger, info). Overrides `color`.",
  size: "Size: sm, md or lg.",
  variant: "Visual variant.",
  invalid: "Error state: danger tone and `aria-invalid`.",
  disabled: "Disables the control.",
  className: "Extra classes, merged last so they win.",
  placeholder: "Hint text shown while empty.",
  name: "Field name, for form submission.",
  required: "Marks the field as required.",
  label: "Visible label text.",
  hint: "Helper text under the control.",
  error: "Error message. Its presence marks the control invalid.",
  title: "Heading text.",
  description: "Supporting text.",
  footer: "Content for the bottom action row.",
  placement: "Where it appears relative to its anchor or edge.",
  orientation: "Layout direction.",
  gap: "Space between children, on Tailwind's spacing scale.",
  as: "Element or component to render.",
  closeLabel: "Accessible name of the close button.",
  removeLabel: "Accessible name of the remove button.",
  locale: "BCP 47 locale for names and formats.",
  min: "Smallest allowed value.",
  max: "Largest allowed value.",
  value: "Current value (controlled).",
  defaultValue: "Initial value (uncontrolled).",
  checked: "Checked state (controlled).",
  open: "Open state (controlled).",
  onValueChange: "Called with the new value.",
  onOpenChange: "Called with the new open state.",
  "aria-label": "Accessible name.",
  children: "Content.",
  options: "The choices: `{ value, label, disabled? }` objects.",
  padding: "Inner spacing: none, sm, md or lg.",
  shape: "Shape of the frame.",
  align: "Cross-axis alignment of children.",
  justify: "Main-axis distribution of children.",
  aspect: "Aspect ratio that reserves space (prevents layout shift).",
  fit: "How the content fills its frame: cover or contain.",
  rounded: "Round the corners using the style's card radius.",
  numeric: "Right-align with tabular figures, for numbers.",
  striped: "Alternate row backgrounds.",
  hoverable: "Highlight the row under the pointer.",
  density: "Row spacing: comfortable or compact.",
  leftIcon: "Icon shown before the label.",
  rightIcon: "Icon shown after the label.",
  icon: "Icon shown next to the content.",
  steps: "The steps: `{ label, description? }` objects.",
  pageCount: "Total number of pages.",
  lines: "Number of placeholder lines.",
  pressed: "Pressed state, for toggle behavior (`aria-pressed`).",
  resize: "Which directions the user can resize.",
  underline: "When the link is underlined: always, hover or none.",
  onSort: "Called when the sort button is pressed.",
  menuLabel: "Accessible name of the menu button.",
  statusAction: "Tone of the status dot.",
};

function shorten(type) {
  const text = clean(type);
  return text.length > MAX_TYPE ? `${text.slice(0, MAX_TYPE - 1)}…` : text;
}

const out = {};
for (const entry of entries) {
  const sourceFile = program.getSourceFile(entry);
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  const exports = checker.getExportsOfModule(moduleSymbol);
  const byName = new Map(exports.map((s) => [s.getName(), s]));

  for (const symbol of exports) {
    const name = symbol.getName();
    const propsSymbol = byName.get(propsAlias[name] ?? `${name}Props`);
    if (!propsSymbol || !/^[A-Z]/.test(name)) continue;

    const propsType = checker.getDeclaredTypeOfSymbol(propsSymbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(propsSymbol) : propsSymbol);
    const props = [];
    for (const prop of checker.getPropertiesOfType(propsType)) {
      const decl = prop.declarations?.[0];
      if (!decl || !isOwn(decl)) continue;
      const description = describe(prop) || common[prop.getName()] || "";
      const type = checker.getTypeOfSymbolAtLocation(prop, decl);
      props.push({
        name: prop.getName(),
        type: shorten(checker.typeToString(type, decl, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope)),
        required: !(prop.flags & ts.SymbolFlags.Optional),
        description,
        default: defaultOf(description),
      });
    }
    props.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name));
    const component = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    out[name] = { entry: entry.includes("/client/") ? "bokoui/react/client" : "bokoui/react", description: describe(component), props };
  }
}

const dist = path.join(root, "dist");
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "props.json"), `${JSON.stringify(out, null, 2)}\n`);
const count = Object.values(out).reduce((n, c) => n + c.props.length, 0);
console.log(`wrote dist/props.json: ${Object.keys(out).length} components, ${count} props`);
