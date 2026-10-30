<script setup lang="ts">
import { Avatar, Card, Text } from 'bokoui/vue'

const format = useFormat()
const { profile } = await useShell()
if (!profile.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
</script>

<template>
  <div>
    <PageTitle title="Profile" />
    <Card class="flex-row items-center gap-4">
      <Avatar :name="profile!.name" size="lg" />
      <div class="flex min-w-0 flex-col">
        <Text class="font-medium">{{ profile!.name }}</Text>
        <Text muted>{{ profile!.jobTitle }}</Text>
        <Text muted>{{ profile!.email }}</Text>
        <Text muted>Member since {{ format.date(profile!.joinedAt) }}</Text>
      </div>
    </Card>
  </div>
</template>
