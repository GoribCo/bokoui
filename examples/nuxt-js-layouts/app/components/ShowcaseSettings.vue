<script setup lang="ts">
import { Bell, CircleHelp, Globe, Moon, Settings, ShieldCheck } from '@lucide/vue'
import { Avatar, Button, Card, Heading, Switch, Text, useTheme } from 'bokoui/vue'

const t = useT()
const locale = useLocale()
const { profile } = await useShell()
const { resolvedMode, setMode } = useTheme()
const notifications = ref(true)
const saved = ref(false)
</script>

<template>
  <div class="mx-auto flex max-w-xl flex-col gap-4">
    <Heading as="h1">{{ t('showcase.settingsTitle') }}</Heading>
    <Card padding="none" class="overflow-hidden">
      <ListRow :title="profile?.name ?? ''" :subtitle="profile?.email" to="/profile"><template #icon><Avatar :name="profile?.name" color="primary" /></template></ListRow>
    </Card>
    <Card padding="none" class="divide-y divide-border overflow-hidden">
      <ListRow :title="t('showcase.notifications')"><template #icon><IconTile><Bell /></IconTile></template><template #end><Switch v-model="notifications" :aria-label="t('showcase.notifications')" /></template></ListRow>
      <ListRow :title="t('showcase.darkMode')"><template #icon><IconTile><Moon /></IconTile></template><template #end><Switch :model-value="resolvedMode === 'dark'" :aria-label="t('showcase.darkMode')" @update:model-value="setMode($event ? 'dark' : 'light')" /></template></ListRow>
      <ListRow :title="t('showcase.language')"><template #icon><IconTile><Globe /></IconTile></template><template #end><Text muted as="span">{{ locale === 'bn' ? 'বাংলা' : 'English' }}</Text></template></ListRow>
    </Card>
    <Card padding="none" class="divide-y divide-border overflow-hidden">
      <ListRow :title="t('showcase.privacy')" to="/settings/privacy"><template #icon><IconTile><ShieldCheck /></IconTile></template></ListRow>
      <ListRow :title="t('showcase.appSettings')" to="/account"><template #icon><IconTile><Settings /></IconTile></template></ListRow>
      <ListRow :title="t('showcase.help')" to="/help"><template #icon><IconTile><CircleHelp /></IconTile></template></ListRow>
    </Card>
    <Button size="lg" full-width @click="saved = true">{{ t('showcase.saveChanges') }}</Button>
    <p role="status" class="min-h-5 text-center text-sm text-muted-foreground">{{ saved ? t('showcase.saved') : '' }}</p>
  </div>
</template>
