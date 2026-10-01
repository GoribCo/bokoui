"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useListParams } from "@/hooks/use-list-params";
import { listTabs, type ListTab } from "@/lib/query/search-params";
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
        <TabsList aria-label="Status">
          {listTabs.map((value) => (
            <TabsTrigger key={value} value={value}>
              {tabLabels[value]}
            </TabsTrigger>
          ))}
        </TabsList>
        {listTabs.map((value) => (
          <TabsContent key={value} value={value}>
            {value === tab ? (
              <ul className="mt-3 flex flex-col divide-y divide-border rounded-xl border border-border">
                {rows.length === 0 ? <li className="p-4 text-muted-foreground">No matches</li> : null}
                {rows.map((record) => (
                  <li key={record.id} className="flex items-center justify-between gap-3 p-3">
                    <span className="min-w-0 truncate">{record.name}</span>
                    <Badge variant="secondary">{record.department}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
      <Pagination aria-label="Pages">
        <PaginationContent>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <PaginationItem key={number}>
              <Button
                size="icon"
                variant={number === current ? "outline" : "ghost"}
                aria-current={number === current ? "page" : undefined}
                aria-label={`Page ${number}`}
                onClick={() => setPage(number)}
              >
                {number}
              </Button>
            </PaginationItem>
          ))}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
