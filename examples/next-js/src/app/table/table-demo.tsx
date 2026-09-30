"use client";

import { useMemo, useState } from "react";
import { Badge, Pagination, Switch, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Text } from "bokoui/react";
import { Select } from "bokoui/react/client";

type Status = "active" | "invited" | "suspended";
interface Person {
  id: number;
  name: string;
  role: string;
  status: Status;
  age: number;
}

const roles = ["Engineer", "Designer", "Manager", "Analyst"];
const names = ["Ada", "Grace", "Alan", "Katherine", "Linus", "Margaret", "Dennis", "Barbara", "Tim", "Radia", "Ken", "Frances"];
const people: Person[] = Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`,
  role: roles[i % roles.length],
  status: (["active", "invited", "suspended"] as const)[i % 3],
  age: 24 + ((i * 7) % 31),
}));

const statusAction = { active: "success", invited: "info", suspended: "danger" } as const;
type SortKey = "name" | "role" | "age";

export function TableDemo() {
  const [sort, setSort] = useState<{ key: SortKey; dir: "ascending" | "descending" }>({ key: "name", dir: "ascending" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("5");
  const [striped, setStriped] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [compact, setCompact] = useState(false);

  const sorted = useMemo(() => {
    const dir = sort.dir === "ascending" ? 1 : -1;
    return [...people].sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * dir;
    });
  }, [sort]);

  const size = Number(pageSize);
  const pageCount = Math.ceil(sorted.length / size);
  const current = Math.min(page, pageCount);
  const rows = sorted.slice((current - 1) * size, current * size);

  const toggle = (key: SortKey) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === "ascending" ? "descending" : "ascending" }));
    setPage(1);
  };
  const sortOf = (key: SortKey) => (sort.key === key ? sort.dir : "none");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <Switch label="Striped" checked={striped} onChange={(e) => setStriped(e.target.checked)} />
        <Switch label="Hover highlight" checked={hoverable} onChange={(e) => setHoverable(e.target.checked)} />
        <Switch label="Compact" checked={compact} onChange={(e) => setCompact(e.target.checked)} />
        <div className="ms-auto w-36">
          <Select
            aria-label="Rows per page"
            size="sm"
            value={pageSize}
            onValueChange={(v) => (setPageSize(v), setPage(1))}
            options={[
              { value: "5", label: "5 per page" },
              { value: "10", label: "10 per page" },
              { value: "25", label: "25 per page" },
            ]}
          />
        </div>
      </div>

      <Table striped={striped} hoverable={hoverable} density={compact ? "compact" : "comfortable"} aria-label="People table">
        <TableCaption>
          {sorted.length} people, sorted by {sort.key} ({sort.dir}).
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead sort={sortOf("name")} onSort={() => toggle("name")}>Name</TableHead>
            <TableHead sort={sortOf("role")} onSort={() => toggle("role")}>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead numeric sort={sortOf("age")} onSort={() => toggle("age")}>Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.role}</TableCell>
              <TableCell>
                <Badge action={statusAction[p.status]} size="sm">{p.status}</Badge>
              </TableCell>
              <TableCell numeric>{p.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text variant="small" muted>
          Showing {(current - 1) * size + 1} to {Math.min(current * size, sorted.length)} of {sorted.length}
        </Text>
        <Pagination page={current} pageCount={pageCount} onPageChange={setPage} size="sm" />
      </div>
    </div>
  );
}
