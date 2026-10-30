<script setup lang="ts">
import { ref } from 'vue'
import {
  Badge, Button, EmptyState, Rating, Stepper, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Tag,
} from 'bokoui/vue'

useHead({ title: 'Data · UI Framework (Nuxt)' })

const rows = ref([
  { name: 'Ada Lovelace', role: 'Engineer', score: 98 },
  { name: 'Grace Hopper', role: 'Admiral', score: 95 },
  { name: 'Alan Turing', role: 'Researcher', score: 99 },
])
const sort = ref<'ascending' | 'descending'>('ascending')
function toggleSort() {
  sort.value = sort.value === 'ascending' ? 'descending' : 'ascending'
  const dir = sort.value === 'ascending' ? 1 : -1
  rows.value = [...rows.value].sort((a, b) => dir * a.name.localeCompare(b.name))
}

const tags = ref(['Vue', 'Nuxt', 'Tailwind'])
const pressed = ref(false)
const rating = ref(3)
const step = ref(1)
const steps = [{ label: 'Account', description: 'Your details' }, { label: 'Plan' }, { label: 'Confirm' }]
</script>

<template>
  <main class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10">
    <PageHeader title="Data" description="Table, Tag, Rating, Stepper and EmptyState." />

    <DemoSection title="Table" note="Sortable header uses aria-sort. The wrapper scrolls on narrow screens.">
      <Table striped hoverable aria-label="People">
        <TableCaption>Top scores</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead :sort="sort" @sort="toggleSort">Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead numeric>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="r in rows" :key="r.name">
            <TableCell>{{ r.name }}</TableCell>
            <TableCell><Badge>{{ r.role }}</Badge></TableCell>
            <TableCell numeric>{{ r.score }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DemoSection>

    <DemoSection title="Tag">
      <div class="flex flex-wrap items-center gap-2">
        <Tag v-for="t in tags" :key="t" @remove="tags = tags.filter((x) => x !== t)">{{ t }}</Tag>
        <Tag variant="outline" :pressed="pressed" @click="pressed = !pressed">Filter chip</Tag>
        <Tag variant="solid" action="success">Static</Tag>
      </div>
    </DemoSection>

    <DemoSection title="Rating">
      <div class="flex flex-wrap items-center gap-6">
        <Rating v-model="rating" label="Rate this" />
        <Rating :model-value="4" read-only size="sm" />
        <span class="text-sm text-muted-foreground">{{ rating }} / 5</span>
      </div>
    </DemoSection>

    <DemoSection title="Stepper">
      <Stepper :steps="steps" :current="step" />
      <Stepper :steps="steps" :current="step" orientation="vertical" />
      <div class="flex gap-2">
        <Button variant="outline" :disabled="step === 0" @click="step--">Back</Button>
        <Button :disabled="step === steps.length" @click="step++">Next</Button>
      </div>
    </DemoSection>

    <DemoSection title="EmptyState">
      <EmptyState title="No projects yet" description="Create a project to get started.">
        <template #actions><Button>Create project</Button></template>
      </EmptyState>
    </DemoSection>
  </main>
</template>
