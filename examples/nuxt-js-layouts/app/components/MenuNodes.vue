<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'
import { Badge, SidebarItem } from 'bokoui/vue'
import { iconFor } from '~/utils/icons'
import { isPathActive } from '~/utils/active'
import type { MenuItem } from '~/utils/types'

const props = defineProps<{ items: MenuItem[]; depth?: number; open: Set<string>; collapsed?: boolean }>()
const emit = defineEmits<{ toggle: [id: string] }>()
const t = useT()
const route = useRoute()
// Resolved in script (not in the template) so Nuxt registers the component.
const NuxtLink = resolveComponent('NuxtLink')

const label = (item: MenuItem) => t(item.labelKey, item.label)
// Children render only while open: the departments tree has hundreds of nodes.
const indent = (depth = 0) => ({ paddingInlineStart: `${0.75 + depth * 0.875}rem` })
</script>

<template>
  <ul class="flex flex-col gap-0.5">
    <li v-for="item in props.items" :key="item.id">
      <SidebarItem
        v-if="item.children"
        as="button"
        type="button"
        :active="!open.has(item.id) && item.children.some((c) => c.href && isPathActive(c.href, route.path))"
        :aria-expanded="open.has(item.id)"
        :aria-label="t(open.has(item.id) ? 'shell.collapseGroup' : 'shell.expandGroup', '', { label: label(item) })"
        :style="indent(depth)"
        class="w-full text-start"
        @click="emit('toggle', item.id)"
      >
        <template #icon><component :is="iconFor(item.icon)" aria-hidden="true" /></template>
        {{ label(item) }}
        <template #end><ChevronDown aria-hidden="true" class="size-4 transition-transform" :class="open.has(item.id) && 'rotate-180'" /></template>
      </SidebarItem>
      <SidebarItem
        v-else
        :as="NuxtLink"
        :to="item.href"
        :active="Boolean(item.href && isPathActive(item.href, route.path))"
        :style="indent(depth)"
      >
        <template #icon><component :is="iconFor(item.icon)" aria-hidden="true" /></template>
        {{ label(item) }}
        <template v-if="item.badge !== undefined" #end><Badge size="sm">{{ item.badge }}</Badge></template>
      </SidebarItem>
      <MenuNodes
        v-if="item.children && open.has(item.id)"
        :items="item.children"
        :depth="(depth ?? 0) + 1"
        :open="open"
        :collapsed="collapsed"
        @toggle="emit('toggle', $event)"
      />
    </li>
  </ul>
</template>
