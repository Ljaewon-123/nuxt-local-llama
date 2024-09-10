<template>
  <v-card
  max-width="400"
  prepend-icon="mdi-lock-open-alert-outline"
  text="Your application will relaunch automatically after the update is complete."
  title="Update in progress"
>
  <template #actions>
    <v-btn
      class="ms-auto"
      text="Ok"
      @click="dialog = false"
    ></v-btn>
  </template>
</v-card>
</template>

<script setup lang="ts">
const dialog = defineModel({ default: false })
</script>