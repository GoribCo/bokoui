<script setup lang="ts">
import { footerLinks } from '~/data/organizations'

const t = useT()
const { public: urls } = useRuntimeConfig()
const otherLayouts = [
  { id: 'react', label: 'React layouts', href: urls.urlNextLayouts as string },
  { id: 'expo', label: 'Expo layouts', href: urls.urlExpoLayouts as string },
]
</script>

<template>
  <footer class="border-t border-border px-4 py-6 text-sm text-muted-foreground sm:px-6">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <p>© {{ new Date().getFullYear() }} Bokoui Layout (NuxtJs) {{ t('footer.rights') }}</p>
      <nav :aria-label="t('shell.common')">
        <ul class="flex flex-wrap gap-4">
          <li v-for="l in footerLinks" :key="l.id"><NuxtLink :to="l.href" class="focus-ring rounded-sm hover:text-foreground">{{ t(l.labelKey, l.label) }}</NuxtLink></li>
          <li v-for="l in otherLayouts" :key="l.id"><a :href="l.href" class="focus-ring rounded-sm hover:text-foreground">{{ l.label }}</a></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>
