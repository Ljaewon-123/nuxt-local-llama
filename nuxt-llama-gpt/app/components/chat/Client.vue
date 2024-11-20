<template>
<v-row justify="end">
  <v-col sm="10" cols="7">
    <v-card class="pa-4" rounded="lg">
      <div class="pre-line-text">
        {{ props.saying }}
      </div>
    </v-card>
  </v-col>
  <v-avatar>
    <v-img
      alt="Llama"
      src="public/two-llama.svg"
    >
      <template #placeholder>
        <LazyLoading />
      </template>
    </v-img>
  </v-avatar>
</v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  saying: String
})
</script>

<style lang="css" scoped>
.pre-line-text {
  white-space: pre-line;
}
</style>