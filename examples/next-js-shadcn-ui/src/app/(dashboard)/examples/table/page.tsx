import { getLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { formatDate } from "@/lib/i18n/format";
import { sampleRecords } from "@/lib/sample-data";
import { buildMetadata } from "@/lib/seo";
import type { LocaleCode } from "@/lib/types";

export const metadata = buildMetadata({
  title: "Table",
  description: "A wide data table inside the shell.",
  path: "/examples/table",
});

export default async function TablePage() {
  const locale = (await getLocale()) as LocaleCode;
  return (
    <PageContainer>
      <PageHeader title="Table" description="The table scrolls sideways inside its wrapper; the page never does." />
      <Table aria-label="Records">
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
                <Badge variant={record.status === "active" ? "default" : "secondary"}>
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
