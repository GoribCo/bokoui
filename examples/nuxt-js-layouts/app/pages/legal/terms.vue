<script setup lang="ts">
import { termsContent } from '~/data/legal'

definePageMeta({ layout: 'public' })
useHead({ title: termsContent.title })
</script>

<template>
  <LegalDocument :content="termsContent" />
</template>
