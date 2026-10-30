<script setup lang="ts">
import { Button, EmptyState } from 'bokoui/vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const t = useT()
const forbidden = computed(() => props.error.statusCode === 403)
useHead({ title: computed(() => (forbidden.value ? t('errors.forbidden') : t('errors.notFound'))) })
</script>

<template>
  <NuxtLayout name="public">
    <EmptyState
      :title="forbidden ? t('errors.forbidden') : props.error.statusCode === 404 ? t('errors.notFound') : props.error.statusMessage"
      :description="forbidden ? t('errors.forbiddenText') : t('errors.notFoundText')"
    >
      <template #actions><Button @click="clearError({ redirect: '/dashboard' })">{{ t('errors.home') }}</Button></template>
    </EmptyState>
  </NuxtLayout>
</template>
