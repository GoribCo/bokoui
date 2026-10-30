<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from 'bokoui/vue'
import { findActiveTrail } from '~/utils/active'
import type { MenuGroup } from '~/utils/types'

const props = defineProps<{ groups: MenuGroup[] }>()
const t = useT()
const route = useRoute()
// Resolved in script (not in the template) so Nuxt registers the component.
const NuxtLink = resolveComponent('NuxtLink')
const trail = computed(() => findActiveTrail(props.groups, route.path))
</script>

<template>
  <Breadcrumb v-if="trail" :label="t('shell.breadcrumb')" class="mb-4">
    <BreadcrumbItem :as="NuxtLink" to="/dashboard">{{ t('menu.dashboard') }}</BreadcrumbItem>
    <BreadcrumbItem
      v-for="(item, i) in trail.items"
      :key="item.id"
      :current="i === trail.items.length - 1"
      :as="item.href && i < trail.items.length - 1 ? NuxtLink : undefined"
      :to="item.href"
    >
      {{ t(item.labelKey, item.label) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>
