<script setup lang="ts">
import { Badge, Button, Card, Heading, Text } from 'bokoui/vue'

const t = useT()
const { organizations, org, switchOrg } = await useShell()
</script>

<template>
  <div>
    <PageTitle :title="t('organization.manage')" lead="Administration (add, rename, remove) belongs to the host project." />
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card v-for="o in organizations" :key="o.id" class="gap-3">
        <div><Heading as="h2" size="md">{{ o.name }}</Heading><Text muted class="capitalize">{{ o.type }}</Text></div>
        <div class="flex flex-wrap gap-2"><Badge v-for="r in o.roles" :key="r" color="neutral" class="capitalize">{{ r }}</Badge></div>
        <div class="flex items-center gap-2">
          <Badge v-if="o.id === org?.id" action="success">{{ t('organization.current') }}</Badge>
          <Button v-else size="sm" variant="outline" @click="switchOrg(o.id)">{{ t('organization.switch') }}</Button>
          <NuxtLink :to="`/${o.type}/${o.slug}`" class="focus-ring rounded-sm text-sm">{{ t('organization.publicProfile') }}</NuxtLink>
        </div>
      </Card>
    </div>
  </div>
</template>
