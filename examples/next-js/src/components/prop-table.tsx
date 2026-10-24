import propsData from "bokoui/props.json";
import { CodeBlock } from "./section";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Text } from "bokoui/react";

interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
}
interface ComponentDoc {
  entry: string;
  description: string;
  props: PropDoc[];
}

const docs = propsData as unknown as Record<string, ComponentDoc>;

/** Prop tables for the given components, generated from the package's real types (`bokoui/props.json`). */
export function PropTables({ names }: { names: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      {names.map((name) => {
        const doc = docs[name];
        if (!doc) return null;
        return (
          <details key={name} className="group rounded-card border border-border bg-surface">
            <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-card px-4 py-3 marker:hidden">
              <span className="flex items-baseline gap-3">
                <code className="text-sm font-semibold">{`<${name} />`}</code>
                <span className="text-xs text-muted-foreground">
                  {doc.props.length} {doc.props.length === 1 ? "prop" : "props"}
                </span>
              </span>
              <code className="hidden text-xs text-muted-foreground sm:inline">{doc.entry}</code>
            </summary>
            <div className="flex flex-col gap-3 border-t border-border p-4">
              {doc.description && (
                <Text variant="small" muted>
                  {doc.description}
                </Text>
              )}
              <CodeBlock label={`${name} import`}>{`import { ${name} } from "${doc.entry}";`}</CodeBlock>
              {doc.props.length === 0 ? (
                <Text variant="small" muted>
                  No props of its own: it accepts the standard HTML attributes.
                </Text>
              ) : (
                <Table aria-label={`${name} props`} density="compact" striped>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prop</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doc.props.map((p) => (
                      <TableRow key={p.name}>
                        <TableCell className="align-top font-mono text-xs whitespace-nowrap">
                          {p.name}
                          {p.required && (
                            <span title="required" className="ms-0.5 text-danger">
                              *
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-64 align-top font-mono text-xs break-words text-muted-foreground">{p.type.replace(/ \| undefined$/, "")}</TableCell>
                        <TableCell className="align-top font-mono text-xs whitespace-nowrap">{p.default ?? "—"}</TableCell>
                        <TableCell className="align-top text-xs">{p.description || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
