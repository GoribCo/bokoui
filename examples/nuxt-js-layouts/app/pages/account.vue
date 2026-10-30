<script setup lang="ts">
const { profile } = await useShell()
</script>

<template>
  <StaticPage title="Manage account" description="Account settings belong to the host project.">
    Signed in as {{ profile?.name }} ({{ profile?.email }}).
  </StaticPage>
</template>
