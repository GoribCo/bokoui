<script setup lang="ts">
import { Ellipsis } from '@lucide/vue'
import { Drawer, FloatingNav, FloatingNavItem } from 'bokoui/vue'
import { isPathActive } from '~/utils/active'
import { iconFor } from '~/utils/icons'
import type { MenuGroup, MenuItem } from '~/utils/types'

const props = defineProps<{ groups: MenuGroup[]; common: MenuItem[] }>()
const t = useT()
const route = useRoute()
// Resolved in script (not in the template) so Nuxt registers the component.
const NuxtLink = resolveComponent('NuxtLink')
const { drawerOpen } = useShellState()

// The first linked entries become bottom tabs; everything else is behind "More".
const tabs = computed(() => props.groups.flatMap((g) => g.items).filter((i) => i.href).slice(0, 4))
watch(() => route.path, () => (drawerOpen.value = false))
</script>

<template>
  <FloatingNav class="md:hidden" :label="t('shell.mobile')">
    <FloatingNavItem v-for="i in tabs" :key="i.id" :as="NuxtLink" :to="i.href" :active="isPathActive(i.href!, route.path)" :aria-label="t(i.labelKey, i.label)">
      <component :is="iconFor(i.icon)" aria-hidden="true" />
    </FloatingNavItem>
    <FloatingNavItem as="button" type="button" :aria-label="t('shell.more')" @click="drawerOpen = true"><Ellipsis aria-hidden="true" /></FloatingNavItem>
  </FloatingNav>

  <Drawer v-model="drawerOpen" side="left" size="sm" :close-label="t('shell.closeMenu')" :title="t('shell.mobile')" class="md:hidden">
    <SidebarContent :groups="groups" :common="common" />
  </Drawer>
</template>
