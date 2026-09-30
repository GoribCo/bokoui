import { getLocale } from "next-intl/server";
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "bokoui/react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { formatDate } from "@/lib/format";
import { sampleRecords } from "@/lib/sample-data";
import { buildMetadata } from "@/lib/seo";
import type { LocaleCode } from "@/types";

export const metadata = buildMetadata({
  title: "Table",
  description: "A wide data table inside the shell.",
  path: "/examples/table",
});

export default async function TablePage() {
  const locale = (await getLocale()) as LocaleCode;
  return (
    <PageContainer size="full">
      <PageHeader title="Table" description="The table scrolls sideways inside its wrapper; the page never does." />
      <Table striped hoverable aria-label="Records">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.department}</TableCell>
              <TableCell>
                <Badge action={record.status === "active" ? "success" : undefined} color="neutral">
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(record.updated, locale)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  );
}
