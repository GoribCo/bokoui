<script setup lang="ts">
import { Badge, Button, Card, Text } from 'bokoui/vue'

const { items, unreadCount, markRead } = await useNotifications()
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <PageTitle title="Notifications" lead="Everything sent to you, newest first." />
    <div class="mb-3 flex items-center justify-between gap-3">
      <Text muted>{{ unreadCount }} unread</Text>
      <Button size="sm" variant="outline" :disabled="!unreadCount" @click="markRead()">Mark all as read</Button>
    </div>
    <Card padding="none">
      <ul class="divide-y divide-border">
        <li v-for="n in items" :key="n.id" class="flex flex-col gap-1 px-4 py-3">
          <div class="flex items-baseline justify-between gap-3">
            <NuxtLink v-if="n.href" :to="n.href" :class="n.unread ? 'font-semibold' : 'font-medium'" class="focus-ring rounded-sm">{{ n.title }}</NuxtLink>
            <span v-else :class="n.unread ? 'font-semibold' : 'font-medium'">{{ n.title }}</span>
            <span class="text-sm text-muted-foreground tabular-nums">{{ n.time }}</span>
          </div>
          <Text muted>{{ n.body }}</Text>
          <div class="flex gap-2">
            <Badge v-if="n.urgent" action="danger">Urgent</Badge>
            <Badge v-if="n.kind === 'invitation'" color="neutral">Invitation</Badge>
            <Button v-if="n.unread" size="sm" variant="ghost" @click="markRead([n.id])">Mark as read</Button>
          </div>
        </li>
      </ul>
    </Card>
  </div>
</template>
