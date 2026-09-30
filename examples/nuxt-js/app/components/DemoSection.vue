<script setup lang="ts">
import { Heading, Text } from 'bokoui/vue'

defineProps<{ title: string; note?: string }>()
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-col gap-1">
      <Heading as="h2" size="lg">{{ title }}</Heading>
      <Text v-if="note" variant="small" muted>{{ note }}</Text>
    </div>
    <slot />
  </section>
</template>
