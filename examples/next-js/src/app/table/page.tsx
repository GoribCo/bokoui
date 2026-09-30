import type { Metadata } from "next";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "bokoui/react";
import { Page, PageHeader, Section } from "@/components/section";
import { PropTables } from "@/components/prop-table";
import { TableDemo } from "./table-demo";

export const metadata: Metadata = { title: "Table · UI Framework" };

const plans = [
  { name: "Free", price: 0, seats: 1 },
  { name: "Pro", price: 12, seats: 5 },
  { name: "Team", price: 39, seats: 25 },
];

export default function TablePage() {
  return (
    <Page>
      <PageHeader
        title="Table"
        description="Semantic table markup with a horizontally scrolling wrapper, sortable headers (aria-sort) and tabular figures."
      />
      <Section title="Static table" note="Renders on the server; no client code needed.">
        <Table aria-label="Plans" hoverable>
          <TableCaption>Plans and pricing.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead numeric>Price / month</TableHead>
              <TableHead numeric>Seats</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p.name}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell numeric>${p.price}</TableCell>
                <TableCell numeric>{p.seats}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
      <Section title="Sorting, paging and density" note="Click a header to sort. Toggle the switches to change the look.">
        <TableDemo />
      </Section>

      <Section title="API" note="Generated from the package's TypeScript types. Every component also accepts standard HTML attributes and className.">
        <PropTables names={["Table", "TableHead", "TableCell"]} />
      </Section>
    </Page>
  );
}
