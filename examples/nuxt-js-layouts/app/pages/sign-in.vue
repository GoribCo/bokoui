<script setup lang="ts">
definePageMeta({ layout: 'auth' })
const t = useT()
useHead({ title: computed(() => t('auth.title')), meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <SignInForm />
</template>
