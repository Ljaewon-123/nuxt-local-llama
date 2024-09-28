<template>
  <div>
    여기되나
    <NuxtLink :to="'/'">home</NuxtLink>
    <v-btn @click="execute">recall Llama</v-btn>
    <div>
      <h1 class="text-capitalize">tets call llama</h1>
    </div>

  </div>
</template>

<script setup lang="ts">
const { data, error, execute } = useFetch('/api/llama/example/test-systemprompt',{
  method:'POST'
})
</script>