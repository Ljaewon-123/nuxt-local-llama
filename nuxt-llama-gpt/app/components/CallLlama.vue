<template>
<v-card 
rounded="pill" 
density="compact" 
class="d-flex align-center pa-3">
  <v-icon>mdi-paperclip</v-icon>
  <v-textarea
    flat
    placeholder="Call llama message"
    variant="solo"
    row-height="15"
    rows="1"
    max-rows="3"
    auto-grow
    hide-details
    no-resize
    density="compact"
  ></v-textarea>
</v-card>
</template>

<script setup lang="ts">
const model = defineModel({ default: '' })
</script>