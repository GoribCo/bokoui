<script setup lang="ts">
import { Sidebar, SidebarSection } from 'bokoui/vue'
import { findActiveTrail } from '~/utils/active'
import type { MenuGroup, MenuItem } from '~/utils/types'

const props = defineProps<{ groups: MenuGroup[]; common: MenuItem[]; collapsed?: boolean }>()
const t = useT()
const route = useRoute()

// Groups open on the way to the current page; the rest stay closed.
const open = reactive(new Set<string>())
watchEffect(() => findActiveTrail(props.groups, route.path)?.items.slice(0, -1).forEach((i) => open.add(i.id)))
const toggle = (id: string) => (open.has(id) ? open.delete(id) : open.add(id))
</script>

<template>
  <Sidebar :collapsed="collapsed" :label="t('shell.main')" class="h-full w-full overflow-y-auto border-0">
    <SidebarSection v-for="group in groups" :key="group.id" :title="collapsed ? undefined : t(group.labelKey, group.label)">
      <MenuNodes :items="group.items" :open="open" :collapsed="collapsed" @toggle="toggle" />
    </SidebarSection>
    <SidebarSection class="mt-auto" :aria-label="t('shell.common')">
      <MenuNodes :items="common" :open="open" :collapsed="collapsed" @toggle="toggle" />
    </SidebarSection>
  </Sidebar>
</template>
