<script setup lang="ts">
import { footerLinks } from '~/data/organizations'

const t = useT()
</script>

<template>
  <footer class="border-t border-border px-4 py-6 text-sm text-muted-foreground sm:px-6">
    <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <p>© {{ new Date().getFullYear() }} Bokoui Layout. {{ t('footer.rights') }}</p>
      <nav :aria-label="t('shell.common')">
        <ul class="flex flex-wrap gap-4">
          <li v-for="l in footerLinks" :key="l.id"><NuxtLink :to="l.href" class="focus-ring rounded-sm hover:text-foreground">{{ t(l.labelKey, l.label) }}</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>
