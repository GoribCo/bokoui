<script setup lang="ts">
// Target of the generated departments tree: any depth resolves to this placeholder.
const path = computed(() => [useRoute().params.path].flat() as string[])
const humanize = (s: string) => s.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
</script>

<template>
  <StaticPage :title="humanize(path.at(-1) ?? '')" :description="path.map(humanize).join(' / ')">
    Placeholder for a department resource, {{ path.length }} levels deep.
  </StaticPage>
</template>
