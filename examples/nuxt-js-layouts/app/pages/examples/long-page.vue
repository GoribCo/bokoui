<script setup lang="ts">
import { Heading, Text } from 'bokoui/vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageTitle title="Long page" lead="Scroll: the header and sidebar stay in place, the footer arrives at the end." />
    <section v-for="n in 14" :key="n" class="flex flex-col gap-2">
      <Heading as="h2" size="lg">Section {{ n }}</Heading>
      <Text>Placeholder copy for section {{ n }}. It exists only to make the page tall enough that the content column scrolls while the navigation stays put. Replace it with real content; the shell only cares that it stays inside the content area.</Text>
      <Text muted>A second paragraph keeps the rhythm realistic and gives long lines a chance to wrap.</Text>
    </section>
  </div>
</template>
