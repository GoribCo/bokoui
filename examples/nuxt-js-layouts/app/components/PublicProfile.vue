<script setup lang="ts">
import { Avatar, Badge, Card, Heading, Link, Text } from 'bokoui/vue'
import type { PublicOrganization } from '~/utils/types'

const props = defineProps<{ organization: PublicOrganization }>()
const t = useT()
const format = useFormat()
const yesNo = (v: boolean) => t(v ? 'publicProfile.yes' : 'publicProfile.no')
const d = computed(() => props.organization.details)

// One list of label/value rows per section; adding an organization type adds a case here.
const facts = computed<{ label: string; value: string }[]>(() => {
  const x = d.value
  if (x.type === 'hospital') return [{ label: t('publicProfile.beds'), value: format.number(x.beds) }, { label: t('publicProfile.emergency'), value: yesNo(x.emergency) }]
  if (x.type === 'pharmacy') return [{ label: t('publicProfile.licenseNo'), value: x.licenseNo }, { label: t('publicProfile.open24h'), value: yesNo(x.open24h) }, { label: t('publicProfile.delivery'), value: yesNo(x.delivery) }]
  return [{ label: t('publicProfile.industry'), value: x.industry }, { label: t('publicProfile.employees'), value: format.number(x.employees) }, { label: t('publicProfile.founded'), value: String(x.founded) }]
})

// Structured data for search engines; `<` is escaped so a name can never close the script tag.
useHead({
  title: props.organization.name,
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': { hospital: 'Hospital', pharmacy: 'Pharmacy', company: 'Organization' }[props.organization.type],
      name: props.organization.name,
      description: props.organization.description,
      address: { '@type': 'PostalAddress', addressLocality: props.organization.city },
    }).replace(/</g, '\\u003c'),
  }],
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <header class="flex items-center gap-4">
      <Avatar size="lg" shape="square" :name="organization.name" />
      <div class="flex min-w-0 flex-col gap-1">
        <Heading as="h1" class="wrap-break-word">{{ organization.name }}</Heading>
        <div class="flex flex-wrap items-center gap-2"><Badge>{{ t(`organizationType.${organization.type}`) }}</Badge><Text muted as="span">{{ organization.city }}</Text></div>
      </div>
    </header>
    <section aria-labelledby="about" class="flex flex-col gap-2">
      <Heading id="about" as="h2" size="md">{{ t('publicProfile.about') }}</Heading>
      <Text>{{ organization.description }}</Text>
    </section>
    <Card>
      <Heading as="h2" size="md">{{ t(`publicProfile.${organization.type}`) }}</Heading>
      <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        <template v-for="f in facts" :key="f.label"><dt class="text-muted-foreground">{{ f.label }}</dt><dd>{{ f.value }}</dd></template>
        <template v-if="d.type === 'hospital'">
          <dt class="text-muted-foreground">{{ t('publicProfile.departments') }}</dt>
          <dd class="flex flex-wrap gap-2"><Badge v-for="x in d.departments" :key="x" color="neutral">{{ x }}</Badge></dd>
        </template>
      </dl>
    </Card>
    <Card v-if="organization.phone || organization.website">
      <Heading as="h2" size="md">{{ t('publicProfile.contact') }}</Heading>
      <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
        <template v-if="organization.phone"><dt class="text-muted-foreground">{{ t('publicProfile.phone') }}</dt><dd>{{ organization.phone }}</dd></template>
        <template v-if="organization.website"><dt class="text-muted-foreground">{{ t('publicProfile.website') }}</dt><dd><Link :href="organization.website" external>{{ organization.website }}</Link></dd></template>
      </dl>
    </Card>
  </div>
</template>
