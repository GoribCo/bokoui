<script setup lang="ts">
import { Badge, Card, CardHeader, Heading, Progress, Text } from 'bokoui/vue'

const t = useT()
const { org, profile } = await useShell()
const stats = [
  { label: 'Open tasks', value: 24, of: 40 },
  { label: 'Capacity', value: 72, of: 100 },
  { label: 'Satisfaction', value: 91, of: 100 },
]
</script>

<template>
  <div>
    <PageTitle
      :title="t('dashboard.title')"
      :lead="t('dashboard.lead', '', { name: profile?.name ?? '', org: org?.name ?? '', roles: org?.roles.join(', ') ?? '' })"
    />
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card v-for="s in stats" :key="s.label">
        <CardHeader><Heading as="h2" size="sm">{{ s.label }}</Heading></CardHeader>
        <Progress :value="s.value" :max="s.of" :label="`${s.value} / ${s.of}`" />
      </Card>
    </div>
    <div class="mt-6 flex flex-wrap items-center gap-2">
      <Text muted>Roles in this organization:</Text>
      <Badge v-for="r in org?.roles" :key="r">{{ r }}</Badge>
    </div>
  </div>
</template>
