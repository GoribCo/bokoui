<script setup lang="ts">
import { Combobox, EmptyState, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'bokoui/vue'

const all = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Record ${i + 1}`, status: ['active', 'paused', 'archived'][i % 3]! }))
const status = ref('')
const page = ref(1)
const size = 8
const filtered = computed(() => all.filter((r) => !status.value || r.status === status.value))
const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / size)))
const rows = computed(() => filtered.value.slice((page.value - 1) * size, page.value * size))
watch(status, () => (page.value = 1))
const options = ['active', 'paused', 'archived'].map((s) => ({ value: s, label: s }))
</script>

<template>
  <div>
    <PageTitle title="Table" lead="Filter with a Combobox, page with Pagination." />
    <div class="mb-4 max-w-xs"><Combobox v-model="status" :options="options" placeholder="All statuses" aria-label="Status" /></div>
    <Table v-if="rows.length" aria-label="Records" striped>
      <TableHeader><TableRow><TableHead numeric>#</TableHead><TableHead>Name</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
      <TableBody><TableRow v-for="r in rows" :key="r.id"><TableCell numeric>{{ r.id }}</TableCell><TableCell>{{ r.name }}</TableCell><TableCell>{{ r.status }}</TableCell></TableRow></TableBody>
    </Table>
    <EmptyState v-else title="No records" description="Nothing matches this filter." />
    <Pagination v-model:page="page" :page-count="pageCount" class="mt-4" />
  </div>
</template>
