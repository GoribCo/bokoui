<script setup lang="ts">
import { Building2, Languages, LayoutPanelLeft, ShieldCheck } from '@lucide/vue'
import { Card, Heading, Text } from 'bokoui/vue'
import { services } from '~/services'

definePageMeta({ layout: 'public' })
const t = useT()
const { data: organizations } = await useAsyncData('public-organizations', () => services.publicOrganizations(), { default: () => [] })
const features = [{ key: 'f1', icon: Building2 }, { key: 'f2', icon: ShieldCheck }, { key: 'f3', icon: Languages }, { key: 'f4', icon: LayoutPanelLeft }]
const buttonLink = 'focus-ring inline-flex h-10 items-center rounded-control px-4 font-medium no-underline'
</script>

<template>
  <div class="flex flex-col gap-12">
    <section class="flex max-w-2xl flex-col gap-5 py-6 md:py-10">
      <p data-tone="primary" class="font-medium text-(--tone-ink)">{{ t('home.eyebrow') }}</p>
      <Heading as="h1" size="3xl">{{ t('home.title') }}</Heading>
      <Text muted>{{ t('home.description') }}</Text>
      <div class="flex flex-wrap gap-3">
        <NuxtLink to="/sign-in" data-tone="primary" :class="[buttonLink, 'bg-(--tone) text-(--tone-fg)']">{{ t('home.signIn') }}</NuxtLink>
        <a href="#organizations" :class="[buttonLink, 'border border-border text-foreground']">{{ t('home.browse') }}</a>
      </div>
    </section>

    <section aria-labelledby="features-title" class="flex flex-col gap-5">
      <Heading id="features-title" as="h2" size="xl">{{ t('home.featuresTitle') }}</Heading>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card v-for="f in features" :key="f.key" class="gap-2">
          <component :is="f.icon" aria-hidden="true" class="size-6 text-primary" />
          <Heading as="h3" size="md">{{ t(`home.${f.key}t`) }}</Heading>
          <Text muted>{{ t(`home.${f.key}d`) }}</Text>
        </Card>
      </div>
    </section>

    <section id="organizations" aria-labelledby="orgs-title" class="flex scroll-mt-6 flex-col gap-5">
      <div class="flex flex-col gap-1"><Heading id="orgs-title" as="h2" size="xl">{{ t('home.orgsTitle') }}</Heading><Text muted>{{ t('home.orgsDescription') }}</Text></div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="o in organizations" :key="o.id" :to="`/${o.type}/${o.slug}`" class="rounded-card text-foreground no-underline focus-ring">
          <Card class="h-full transition-colors hover:bg-muted"><Text muted>{{ t(`organizationType.${o.type}`) }}</Text><Heading as="h3" size="md">{{ o.name }}</Heading><Text muted>{{ o.city }}</Text></Card>
        </NuxtLink>
      </div>
    </section>

    <section class="flex flex-col items-start gap-3 border-t border-border pt-8">
      <Heading as="h2" size="xl">{{ t('home.ctaTitle') }}</Heading>
      <Text muted>{{ t('home.ctaDescription') }}</Text>
      <NuxtLink to="/sign-in" data-tone="primary" :class="[buttonLink, 'bg-(--tone) text-(--tone-fg)']">{{ t('home.signIn') }}</NuxtLink>
    </section>
  </div>
</template>
