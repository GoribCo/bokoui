<script setup lang="ts">
import { Heading, Text } from 'bokoui/vue'
import type { LegalDocumentContent } from '~/data/legal'

defineProps<{ content: LegalDocumentContent }>()
</script>

<template>
  <article>
    <PageTitle :title="content.title" :lead="content.description" />
    <Text muted class="mb-6">Last updated {{ content.updated }}</Text>
    <nav aria-label="Contents" class="mb-8 rounded-card border border-border p-4">
      <ol class="list-decimal ps-5">
        <li v-for="s in content.sections" :key="s.id"><a :href="`#${s.id}`" class="focus-ring rounded-sm">{{ s.title }}</a></li>
      </ol>
    </nav>
    <section v-for="s in content.sections" :id="s.id" :key="s.id" class="mb-8 scroll-mt-20 flex flex-col gap-2">
      <Heading as="h2" size="lg">{{ s.title }}</Heading>
      <Text v-for="(p, i) in s.paragraphs" :key="i">{{ p }}</Text>
      <ul v-if="s.items" class="list-disc ps-6"><li v-for="(item, i) in s.items" :key="i">{{ item }}</li></ul>
    </section>
  </article>
</template>
