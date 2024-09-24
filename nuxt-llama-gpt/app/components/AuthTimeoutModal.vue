<template>
<v-card
  max-width="400"
  rounded="lg"
  prepend-icon="mdi-lock-open-alert-outline"
  :title="title"
  :text="text"
>
  <template #actions>
    <v-btn
      text="Ok"
      variant="outlined"
      @click="goLoginPage(), dialog = false"
    ></v-btn>
  </template>
</v-card>
</template>

<script setup lang="ts">
const dialog = defineModel({ default: false })
const { title, text } = usePageAuth()
const goLoginPage = () => {
  navigateTo('/login')
}
</script>