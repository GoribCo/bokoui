import { Badge, Pagination, Select, Switch, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Text } from 'bokoui/expo';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { Row, Screen, Section } from '@/components/screen';

type Status = 'active' | 'invited' | 'suspended';
interface Person {
  id: number;
  name: string;
  role: string;
  status: Status;
  age: number;
}

const roles = ['Engineer', 'Designer', 'Manager', 'Analyst'];
const names = ['Ada', 'Grace', 'Alan', 'Katherine', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Tim', 'Radia', 'Ken', 'Frances'];
const people: Person[] = Array.from({ length: 27 }, (_, i) => ({
  id: i + 1,
  name: `${names[i % names.length]} ${String.fromCharCode(65 + (i % 26))}.`,
  role: roles[i % roles.length],
  status: (['active', 'invited', 'suspended'] as const)[i % 3],
  age: 24 + ((i * 7) % 31),
}));

const statusAction = { active: 'success', invited: 'info', suspended: 'danger' } as const;
type SortKey = 'name' | 'role' | 'age';

const plans = [
  { name: 'Free', price: 0, seats: 1 },
  { name: 'Pro', price: 12, seats: 5 },
  { name: 'Team', price: 39, seats: 25 },
];

export default function TableScreen() {
  const [sort, setSort] = useState<{ key: SortKey; dir: 'ascending' | 'descending' }>({ key: 'name', dir: 'ascending' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('5');
  const [striped, setStriped] = useState(true);
  const [hoverable, setHoverable] = useState(true);
  const [compact, setCompact] = useState(false);

  const sorted = useMemo(() => {
    const dir = sort.dir === 'ascending' ? 1 : -1;
    return [...people].sort((a, b) => {
      const x = a[sort.key];
      const y = b[sort.key];
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * dir;
    });
  }, [sort]);

  const size = Number(pageSize);
  const pageCount = Math.ceil(sorted.length / size);
  const current = Math.min(page, pageCount);
  const rows = sorted.slice((current - 1) * size, current * size);

  const toggle = (key: SortKey) => {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'ascending' ? 'descending' : 'ascending' }));
    setPage(1);
  };
  const sortOf = (key: SortKey) => (sort.key === key ? sort.dir : 'none');

  return (
    <Screen title="Table">
      <Section title="Static table">
        <Table hoverable>
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
                <TableCell>{p.name}</TableCell>
                <TableCell numeric>${p.price}</TableCell>
                <TableCell numeric>{p.seats}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Sorting, paging and density" hint="Press a header to sort. Toggle the switches to change the look.">
        <Row>
          <Switch label="Striped" checked={striped} onCheckedChange={setStriped} />
          <Switch label="Hover highlight" checked={hoverable} onCheckedChange={setHoverable} />
          <Switch label="Compact" checked={compact} onCheckedChange={setCompact} />
        </Row>
        <View style={{ maxWidth: 200 }}>
          <Select
            accessibilityLabel="Rows per page"
            size="sm"
            value={pageSize}
            onValueChange={(v) => {
              setPageSize(v);
              setPage(1);
            }}
            options={[
              { value: '5', label: '5 per page' },
              { value: '10', label: '10 per page' },
              { value: '25', label: '25 per page' },
            ]}
          />
        </View>

        <Table striped={striped} hoverable={hoverable} density={compact ? 'compact' : 'comfortable'}>
          <TableCaption>
            {sorted.length} people, sorted by {sort.key} ({sort.dir}).
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead sort={sortOf('name')} onSort={() => toggle('name')}>
                Name
              </TableHead>
              <TableHead sort={sortOf('role')} onSort={() => toggle('role')}>
                Role
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead numeric sort={sortOf('age')} onSort={() => toggle('age')}>
                Age
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.role}</TableCell>
                <TableCell>
                  <Badge action={statusAction[p.status]} size="sm">
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell numeric>{p.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Text variant="small" muted>
          Showing {(current - 1) * size + 1} to {Math.min(current * size, sorted.length)} of {sorted.length}
        </Text>
        <Pagination page={current} pageCount={pageCount} onPageChange={setPage} size="sm" />
      </Section>
    </Screen>
  );
}
