"use client";

import { useMemo } from "react";
import { Badge, Input, Pagination } from "bokoui/react";
import { Tab, TabList, TabPanel, Tabs } from "bokoui/react/client";
import { useListParams } from "@/hooks/use-list-params";
import { listTabs, type ListTab } from "@/lib/search-params";
import { sampleRecords } from "@/lib/sample-data";

const PAGE_SIZE = 8;
const tabLabels: Record<ListTab, string> = { all: "All", active: "Active", archived: "Archived" };

/** Tab, filter text and page live in the URL (nuqs), so the view can be shared and survives reload. */
export function FilterableList() {
  const { tab, q, page, setTab, setQuery, setPage } = useListParams();

  const matches = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sampleRecords.filter(
      (record) => (tab === "all" || record.status === tab) && (!needle || record.name.toLowerCase().includes(needle)),
    );
  }, [tab, q]);

  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

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
        <TabList aria-label="Status">
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
                {rows.length === 0 ? <li className="p-4 text-muted-foreground">No matches</li> : null}
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
