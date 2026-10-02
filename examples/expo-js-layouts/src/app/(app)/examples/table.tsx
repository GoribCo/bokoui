import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "bokoui/expo";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { useScreenTitle } from "@/components/layout/screen-title";
import { useLocale } from "@/hooks/use-locale";
import { sampleRecords, type SampleRecord } from "@/lib/content/sample-records";
import { formatDate } from "@/lib/i18n/format";

type SortKey = "name" | "department" | "updated";
type SortDirection = "ascending" | "descending";

export default function TableScreen() {
  const { t } = useTranslation();
  const locale = useLocale();
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({ key: "updated", direction: "descending" });
  useScreenTitle(t("examples.tableTitle"));

  const rows = useMemo(() => {
    const sorted = [...sampleRecords].sort((a: SampleRecord, b: SampleRecord) => a[sort.key].localeCompare(b[sort.key]));
    return sort.direction === "ascending" ? sorted : sorted.reverse();
  }, [sort]);

  const header = (key: SortKey, label: string) => (
    <TableHead
      sort={sort.key === key ? sort.direction : "none"}
      onSort={() => setSort((current) => ({ key, direction: current.key === key && current.direction === "ascending" ? "descending" : "ascending" }))}
    >
      {label}
    </TableHead>
  );

  return (
    <PageContainer>
      <PageHeader title={t("examples.tableTitle")} description={t("examples.tableDescription")} />
      <Table striped columnWidth={150}>
        <TableHeader>
          <TableRow>
            {header("name", t("examples.colName"))}
            {header("department", t("examples.colDepartment"))}
            <TableHead>{t("examples.colStatus")}</TableHead>
            {header("updated", t("examples.colUpdated"))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>
                <Badge color="neutral" action={row.status === "active" ? "success" : undefined}>{t(row.status === "active" ? "examples.statusActive" : "examples.statusArchived")}</Badge>
              </TableCell>
              <TableCell>{formatDate(row.updated, locale)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </PageContainer>
  );
}
