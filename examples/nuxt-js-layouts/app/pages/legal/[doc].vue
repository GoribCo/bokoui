<script setup lang="ts">
import { Text } from 'bokoui/vue'

definePageMeta({ layout: 'public' })
const doc = useRoute().params.doc
if (doc !== 'terms' && doc !== 'privacy') throw createError({ statusCode: 404, statusMessage: 'Not found' })
</script>

<template>
  <div>
    <PageTitle :title="doc === 'terms' ? 'Terms of use' : 'Privacy policy'" />
    <Text>Sample legal text. Replace it with your own document.</Text>
  </div>
</template>
