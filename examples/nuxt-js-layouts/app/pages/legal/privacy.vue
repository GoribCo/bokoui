<script setup lang="ts">
import { privacyContent } from '~/data/legal'

definePageMeta({ layout: 'public' })
useHead({ title: privacyContent.title })
</script>

<template>
  <LegalDocument :content="privacyContent" />
</template>
