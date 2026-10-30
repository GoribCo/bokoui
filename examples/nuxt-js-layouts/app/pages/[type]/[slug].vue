<script setup lang="ts">
import { services } from '~/services'
import type { OrganizationType } from '~/utils/types'

// /hospital/<slug>, /pharmacy/<slug>, /company/<slug>: public, no sign-in. Any other first segment is a 404.
definePageMeta({ layout: 'public' })
const { type, slug } = useRoute().params as { type: string; slug: string }
const types: OrganizationType[] = ['hospital', 'pharmacy', 'company']
const { data: organization } = await useAsyncData(`public-${type}-${slug}`, () => (types.includes(type as OrganizationType) ? services.publicOrganization(type as OrganizationType, slug) : Promise.resolve(null)))
if (!organization.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
</script>

<template>
  <PublicProfile :organization="organization!" />
</template>
