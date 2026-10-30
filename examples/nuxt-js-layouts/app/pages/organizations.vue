<script setup lang="ts">
import { Badge, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'bokoui/vue'

const { organizations, org, switchOrg } = await useShell()
</script>

<template>
  <div>
    <PageTitle title="Organizations" lead="Switch organization to change the roles, and with them the menu and the pages you may open." />
    <Table aria-label="Organizations" hoverable>
      <TableHeader>
        <TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Roles</TableHead><TableHead><span class="sr-only">Action</span></TableHead></TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="o in organizations" :key="o.id">
          <TableCell class="max-w-xs truncate">{{ o.name }}</TableCell>
          <TableCell>{{ o.type }}</TableCell>
          <TableCell><span class="flex flex-wrap gap-1"><Badge v-for="r in o.roles" :key="r">{{ r }}</Badge></span></TableCell>
          <TableCell>
            <Badge v-if="o.id === org?.id" action="success">Active</Badge>
            <Button v-else size="sm" variant="outline" @click="switchOrg(o.id)">Switch</Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
