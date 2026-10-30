<script setup lang="ts">
// Jump to the same page in the React, Vue and Expo demos (fixed ports, see run.sh).
const { public: urls } = useRuntimeConfig()
const route = useRoute()

const CURRENT = 'vue'
const layoutsUrl = urls.urlLayouts as string
const platforms = computed(() => [
  { id: 'react', label: 'React', url: urls.urlReact as string, paths: 'all' as const },
  { id: 'vue', label: 'Vue', url: urls.urlVue as string, paths: 'all' as const },
  { id: 'expo', label: 'Expo', url: urls.urlExpo as string, paths: ['/', '/setup'] },
])

/** The same page on another platform, or that demo's home when it has no matching page. */
function target(p: { url: string; paths: 'all' | string[] }) {
  return p.paths === 'all' || p.paths.includes(route.path) ? `${p.url}${route.path}` : p.url
}
const hasPage = (p: { paths: 'all' | string[] }) => p.paths === 'all' || p.paths.includes(route.path)
</script>

<template>
  <div class="flex items-center gap-2">
  <nav aria-label="Platform" data-tone="primary" class="inline-flex items-center gap-1 rounded-control border border-border p-0.5">
    <a
      v-for="p in platforms"
      :key="p.id"
      :href="p.id === CURRENT ? undefined : target(p)"
      :aria-current="p.id === CURRENT ? 'true' : undefined"
      :title="p.id === CURRENT ? `You are in the ${p.label} demo` : hasPage(p) ? `Open this page in ${p.label}` : `${p.label} demo home (no matching page)`"
      class="focus-ring rounded-[calc(var(--bokoui-radius-control)-2px)] px-2.5 py-1 text-sm text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground aria-[current=true]:bg-(--tone) aria-[current=true]:text-(--tone-fg) aria-[current=true]:hover:bg-(--tone)"
    >
      {{ p.label }}
    </a>
  </nav>
  <a :href="layoutsUrl" title="Open the application shell example (sidebar, header, organizations, roles)" class="focus-ring rounded-control px-2 py-1 text-sm text-muted-foreground hover:text-foreground">Layouts</a>
  </div>
</template>
