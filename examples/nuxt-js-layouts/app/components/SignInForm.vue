<script setup lang="ts">
import { Button, Card, FormField, Heading, Input, Text } from 'bokoui/vue'

const t = useT()
const route = useRoute()
const { signIn } = useAuth()
const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string; password?: string }>({})

// Only same-site paths are followed after sign-in (no open redirect).
const target = computed(() => {
  const next = String(route.query.next ?? '')
  return next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard'
})

async function submit() {
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? undefined : t('auth.invalidEmail')
  errors.password = password.value ? undefined : t('auth.passwordRequired')
  if (errors.email || errors.password) return
  signIn(email.value)
  await navigateTo(target.value, { replace: true })
}
</script>

<template>
  <Card class="w-full max-w-sm">
    <Heading as="h1" size="lg">{{ t('auth.title') }}</Heading>
    <Text muted>{{ t('auth.description') }}</Text>
    <form novalidate class="mt-4 flex flex-col gap-4" @submit.prevent="submit">
      <FormField :label="t('auth.email')" required :error="errors.email" v-slot="{ controlProps }"><Input v-bind="controlProps" v-model="email" type="email" autocomplete="email" /></FormField>
      <FormField :label="t('auth.password')" required :error="errors.password" v-slot="{ controlProps }"><Input v-bind="controlProps" v-model="password" type="password" autocomplete="current-password" /></FormField>
      <Button type="submit" full-width>{{ t('auth.submit') }}</Button>
    </form>
  </Card>
</template>
