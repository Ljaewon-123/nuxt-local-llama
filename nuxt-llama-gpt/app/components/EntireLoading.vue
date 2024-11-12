<template>
<v-card
  max-width="400"
  rounded="lg"
>
  <v-list
    class="py-2"
    color="primary"
    elevation="12"
    rounded="lg"
  >
    <v-list-item
      prepend-icon="$vuetify-outline"
      title="Create New Session..."
    >
      <template v-slot:prepend>
        <div class="pe-4">
          <v-icon color="primary" size="x-large"></v-icon>
        </div>
      </template>

      <template v-slot:append>
        <v-progress-circular
          color="primary"
          indeterminate="disable-shrink"
          size="16"
          width="2"
        ></v-progress-circular>
      </template>
    </v-list-item>
  </v-list>
</v-card>
</template>

<script setup lang="ts">
const dialog = defineModel({ default: false })
</script>