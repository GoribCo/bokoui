<script setup lang="ts">
import { Heading, Text } from 'bokoui/vue'

const props = defineProps<{ title: string; lead?: string }>()
useHead({ title: computed(() => `${props.title} · Bokoui Layout (Nuxt)`) })
</script>

<template>
  <header class="mb-6 flex flex-col gap-1">
    <Heading as="h1">{{ title }}</Heading>
    <Text v-if="lead" variant="lead" muted>{{ lead }}</Text>
  </header>
</template>
