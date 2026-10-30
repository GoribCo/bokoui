<script setup lang="ts">
import { BarChart3, CalendarDays, CheckSquare, FileText, FolderOpen, MessageCircle, Plus, Users } from '@lucide/vue'
import { Button, Card, Heading, Text } from 'bokoui/vue'

const t = useT()
const stats = [{ icon: CheckSquare, value: '12', label: t('showcase.tasks') }, { icon: CalendarDays, value: '3', label: t('showcase.meetings') }, { icon: BarChart3, value: '78%', label: t('showcase.progress') }]
const upcoming = [
  { icon: CalendarDays, title: t('showcase.designReview'), sub: '10:00 – 11:00' },
  { icon: Users, title: t('showcase.teamSync'), sub: '14:00 – 14:30' },
  { icon: FileText, title: t('showcase.updateDocs'), sub: t('showcase.dueToday') },
]
const actions = [{ icon: Plus, label: t('showcase.newTask') }, { icon: MessageCircle, label: t('showcase.messages') }, { icon: CalendarDays, label: t('showcase.calendar') }, { icon: FolderOpen, label: t('showcase.files') }]
const projects = [
  { title: t('showcase.projectApp'), sub: t('showcase.updated2h'), color: '#8b7cf6' },
  { title: t('showcase.projectSite'), sub: t('showcase.updated1d'), color: '#8ab4f8' },
  { title: t('showcase.projectSystem'), sub: t('showcase.updated3d'), color: '#f4a3a3' },
]
</script>

<template>
  <div class="mx-auto flex max-w-xl flex-col gap-6">
    <header class="flex flex-col gap-1"><Heading as="h1">{{ t('showcase.homeTitle') }}</Heading><Text muted>{{ t('showcase.homeSubtitle') }}</Text></header>
    <div class="grid grid-cols-3 gap-3">
      <Card v-for="s in stats" :key="s.label" padding="sm" class="gap-2">
        <IconTile class="size-9"><component :is="s.icon" /></IconTile>
        <div><p class="text-2xl font-bold">{{ s.value }}</p><p class="text-sm text-muted-foreground">{{ s.label }}</p></div>
      </Card>
    </div>
    <section aria-labelledby="upcoming-title" class="flex flex-col gap-2">
      <Heading id="upcoming-title" as="h2" size="md">{{ t('showcase.upcoming') }}</Heading>
      <Card padding="none" class="divide-y divide-border overflow-hidden">
        <ListRow v-for="u in upcoming" :key="u.title" :title="u.title" :subtitle="u.sub" to="/examples/table"><template #icon><IconTile><component :is="u.icon" /></IconTile></template></ListRow>
      </Card>
    </section>
    <section aria-labelledby="actions-title" class="flex flex-col gap-2">
      <Heading id="actions-title" as="h2" size="md">{{ t('showcase.quickActions') }}</Heading>
      <div class="grid grid-cols-4 gap-3">
        <div v-for="a in actions" :key="a.label" class="flex flex-col items-center gap-1.5">
          <Button variant="soft" color="neutral" :aria-label="a.label" class="h-14 w-full [&_svg]:size-5 [&_svg]:text-primary"><component :is="a.icon" aria-hidden="true" /></Button>
          <span class="max-w-full truncate text-sm text-muted-foreground">{{ a.label }}</span>
        </div>
      </div>
    </section>
    <section aria-labelledby="projects-title" class="flex flex-col gap-2">
      <div class="flex items-baseline justify-between"><Heading id="projects-title" as="h2" size="md">{{ t('showcase.projects') }}</Heading><span data-tone="primary" class="text-sm font-semibold text-(--tone-ink)">{{ t('showcase.seeAll') }}</span></div>
      <Card padding="none" class="divide-y divide-border overflow-hidden">
        <ListRow v-for="p in projects" :key="p.title" :title="p.title" :subtitle="p.sub" to="/examples/filters"><template #icon><IconTile :color="p.color" /></template></ListRow>
      </Card>
    </section>
    <Button size="lg" full-width><template #leftIcon><Plus aria-hidden="true" /></template>{{ t('showcase.newTask') }}</Button>
  </div>
</template>
