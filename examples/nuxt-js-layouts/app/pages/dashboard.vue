<script setup lang="ts">
import { Card, Heading, Text } from 'bokoui/vue'

const t = useT()
const format = useFormat()
const { org, profile } = await useShell()
const stats = [{ label: 'Open tasks', value: 128 }, { label: 'Completed this week', value: 1342 }, { label: 'Pending reviews', value: 17 }]
</script>

<template>
  <div>
    <PageTitle :title="t('dashboard.title')" :lead="t('dashboard.lead', '', { name: profile?.name ?? '', org: org?.name ?? '', roles: org?.roles.join(', ') ?? '' })" />
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ActiveOrganizationCard />
      <Card v-for="s in stats" :key="s.label"><Text muted>{{ s.label }}</Text><Heading as="h2" size="xl">{{ format.number(s.value) }}</Heading></Card>
    </div>
  </div>
</template>
