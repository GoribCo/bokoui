<script setup lang="ts">
import { Search } from '@lucide/vue'
import { Button, CommandPalette } from 'bokoui/vue'
import { services } from '~/services'
import type { MenuGroup, MenuItem } from '~/utils/types'

const props = defineProps<{ groups: MenuGroup[] }>()
const t = useT()
const open = ref(false)
const { data: people } = await useAsyncData('people', () => services.people(), { default: () => [] })

// The departments tree has hundreds of entries; the palette lists the first 150 pages and filters among them.
const pages = computed(() => {
  const out: MenuItem[] = []
  const walk = (items: MenuItem[]) => items.forEach((i) => (i.href && out.push(i), i.children && walk(i.children)))
  props.groups.forEach((g) => walk(g.items))
  return out.slice(0, 150)
})
const palette = computed(() => [
  { heading: t('search.scope.menu'), commands: pages.value.map((i) => ({ id: i.id, label: t(i.labelKey, i.label), onSelect: () => void navigateTo(i.href) })) },
  { heading: t('search.scope.people'), commands: people.value.map((p) => ({ id: p.id, label: p.name, keywords: `${p.role} ${p.organization}`, hint: p.role, onSelect: () => void navigateTo('/profile') })) },
])
</script>

<template>
  <Button icon-only variant="ghost" color="neutral" :aria-label="t('shell.search')" @click="open = true"><Search aria-hidden="true" /></Button>
  <CommandPalette v-model="open" :groups="palette" hotkey="k" :label="t('shell.search')" :placeholder="t('shell.searchPlaceholder')" :empty-text="t('search.noResults')" />
</template>
