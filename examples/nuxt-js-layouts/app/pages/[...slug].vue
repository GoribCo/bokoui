<script setup lang="ts">
import { EmptyState } from 'bokoui/vue'
import { findActiveTrail } from '~/utils/active'

// Menu entries without a dedicated screen land here, so every link in the shell works.
const t = useT()
const route = useRoute()
const { groups } = await useShell()
const trail = computed(() => findActiveTrail(groups.value, route.path))
const item = computed(() => trail.value?.items.at(-1))
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
</script>

<template>
  <div>
    <PageTitle :title="t(item?.labelKey, item?.label)" :lead="`Placeholder screen for ${route.path}.`" />
    <EmptyState title="Sample page" description="This menu entry has no screen of its own in the demo." />
  </div>
</template>
