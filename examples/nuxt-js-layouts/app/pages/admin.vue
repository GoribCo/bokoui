<script setup lang="ts">
// Role-restricted: the route middleware answers 403 when the menu hides this page from the user's roles.
const { org } = await useShell()
</script>

<template>
  <StaticPage title="Access control" description="Visible to the admin and auditor roles in the active organization.">
    Your roles here: {{ org?.roles.join(', ') }}.
  </StaticPage>
</template>
