<script setup lang="ts">
import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'bokoui/vue'
import { services } from '~/services'

const format = useFormat()
const { data } = await useAsyncData('records-all', () => services.records({ pageSize: 100 }))
</script>

<template>
  <div>
    <PageTitle title="Table" lead="The table scrolls sideways inside its wrapper; the page never does." />
    <Table striped hoverable aria-label="Records">
      <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Updated</TableHead></TableRow></TableHeader>
      <TableBody>
        <TableRow v-for="r in data?.items" :key="r.id">
          <TableCell>{{ r.id }}</TableCell><TableCell>{{ r.name }}</TableCell><TableCell>{{ r.department }}</TableCell>
          <TableCell><Badge :action="r.status === 'active' ? 'success' : undefined" color="neutral">{{ r.status }}</Badge></TableCell>
          <TableCell>{{ format.date(r.updated) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
