<script setup lang="ts">
import { Bell } from '@lucide/vue'
import { Badge, Button, Popover } from 'bokoui/vue'

const t = useT()
const { items, unreadCount, markRead } = await useNotifications()
</script>

<template>
  <Popover placement="bottom-end" :aria-label="t('shell.notifications')" class="w-80 p-0">
    <template #trigger>
      <Button icon-only variant="ghost" color="neutral" class="relative" :aria-label="`${t('shell.notifications')}${unreadCount ? ` (${t('shell.notificationsUnread', '', { count: String(unreadCount) })})` : ''}`">
        <Bell aria-hidden="true" />
        <Badge v-if="unreadCount" size="sm" action="danger" variant="solid" class="absolute -end-1 -top-1" aria-hidden="true">{{ unreadCount }}</Badge>
      </Button>
    </template>
    <div class="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
      <span class="font-medium">{{ t('shell.notifications') }}</span>
      <Button size="sm" variant="ghost" :disabled="!unreadCount" @click="markRead()">{{ t('shell.markAllRead') }}</Button>
    </div>
    <p v-if="!items.length" class="px-3 py-6 text-center text-muted-foreground">{{ t('shell.noNotifications') }}</p>
    <ul class="max-h-80 divide-y divide-border overflow-y-auto">
      <li v-for="n in items.slice(0, 5)" :key="n.id" class="flex flex-col gap-0.5 px-3 py-2 text-sm">
        <span :class="n.unread ? 'font-semibold' : 'font-medium'">{{ n.title }}</span>
        <span class="text-muted-foreground">{{ n.body }}</span>
      </li>
    </ul>
    <div class="border-t border-border px-3 py-2"><NuxtLink to="/notifications" class="focus-ring rounded-sm text-sm">{{ t('shell.viewAllNotifications') }}</NuxtLink></div>
  </Popover>
</template>
