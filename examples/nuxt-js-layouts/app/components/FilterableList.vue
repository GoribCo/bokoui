<script setup lang="ts">
import { Badge, Input, Pagination, Tab, TabList, TabPanel, Tabs } from 'bokoui/vue'
import { services } from '~/services'

const tabs = ['all', 'active', 'archived'] as const
type Tab = (typeof tabs)[number]
const labels: Record<Tab, string> = { all: 'All', active: 'Active', archived: 'Archived' }
const PAGE_SIZE = 8

// Tab, filter text and page are URL state: copy the address to share the view.
const route = useRoute()
const router = useRouter()
const tab = computed(() => (tabs.find((x) => x === route.query.tab) ?? 'all') as Tab)
const q = computed(() => String(route.query.q ?? ''))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const setQuery = (patch: Record<string, string | number | undefined>) =>
  router.replace({ query: Object.fromEntries(Object.entries({ ...route.query, ...patch }).filter(([, v]) => v !== undefined && v !== '' && v !== 'all' && v !== 1)) })

const { data } = await useAsyncData('records', () => services.records({ status: tab.value, q: q.value, page: page.value, pageSize: PAGE_SIZE }), {
  watch: [tab, q, page],
})
const rows = computed(() => data.value?.items ?? [])
</script>

<template>
  <div class="flex flex-col gap-4">
    <Input type="search" :model-value="q" placeholder="Filter by name" aria-label="Filter by name" class="max-w-sm" @update:model-value="setQuery({ q: String($event), page: undefined })" />
    <Tabs :model-value="tab" @update:model-value="setQuery({ tab: $event, page: undefined })">
      <TabList aria-label="Status"><Tab v-for="x in tabs" :key="x" :value="x">{{ labels[x] }}</Tab></TabList>
      <TabPanel v-for="x in tabs" :key="x" :value="x">
        <ul v-if="x === tab" class="mt-3 flex flex-col divide-y divide-border rounded-card border border-border">
          <li v-if="!rows.length" class="p-4 text-muted-foreground">No matches</li>
          <li v-for="r in rows" :key="r.id" class="flex items-center justify-between gap-3 p-3">
            <span class="min-w-0 truncate">{{ r.name }}</span><Badge color="neutral">{{ r.department }}</Badge>
          </li>
        </ul>
      </TabPanel>
    </Tabs>
    <Pagination :page="data?.page ?? page" :page-count="data?.totalPages ?? 1" label="Pages" @update:page="setQuery({ page: $event })" />
  </div>
</template>
