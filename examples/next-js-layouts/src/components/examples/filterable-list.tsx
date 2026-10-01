"use client";

import { Badge, Input, Pagination } from "bokoui/react";
import { Tab, TabList, TabPanel, Tabs } from "bokoui/react/client";
import { useListParams } from "@/hooks/use-list-params";
import { listTabs, type ListTab } from "@/lib/query/search-params";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useRecords } from "@/hooks/use-records";

const PAGE_SIZE = 8;
const tabLabels: Record<ListTab, string> = { all: "All", active: "Active", archived: "Archived" };

/** Tab, filter text and page live in the URL (nuqs), so the view can be shared and survives reload. */
export function FilterableList() {
  const { tab, q, page, setTab, setQuery, setPage } = useListParams();

  // Filtering and paging happen on the server (`GET /records`); the URL state is the query.
  const search = useDebouncedValue(q.trim());
  const records = useRecords({ status: tab, q: search, page, pageSize: PAGE_SIZE });
  const rows = records.data?.items ?? [];
  const pageCount = records.data?.meta.totalPages ?? 1;
  const current = records.data?.meta.page ?? page;

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        value={q}
        placeholder="Filter by name"
        aria-label="Filter by name"
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-sm"
      />
      <Tabs value={tab} onValueChange={(value) => setTab(value as ListTab)}>
        <TabList aria-label="Status" className="[&_button]:pointer-coarse:min-w-11">
          {listTabs.map((value) => (
            <Tab key={value} value={value}>
              {tabLabels[value]}
            </Tab>
          ))}
        </TabList>
        {listTabs.map((value) => (
          <TabPanel key={value} value={value}>
            {value === tab ? (
              <ul className="mt-3 flex flex-col divide-y divide-border rounded-card border border-border">
                {records.isPending ? <li className="p-4 text-muted-foreground">Loading…</li> : null}
                {records.isSuccess && rows.length === 0 ? <li className="p-4 text-muted-foreground">No matches</li> : null}
                {rows.map((record) => (
                  <li key={record.id} className="flex items-center justify-between gap-3 p-3">
                    <span className="min-w-0 truncate">{record.name}</span>
                    <Badge color="neutral">{record.department}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </TabPanel>
        ))}
      </Tabs>
      <Pagination page={current} pageCount={pageCount} onPageChange={setPage} aria-label="Pages" />
    </div>
  );
}
