<template>
  <div>
    여기되나
    <NuxtLink :to="'/'">home</NuxtLink>

    <div>
      <h1 class="text-capitalize">tets call llama</h1>
    </div>

  </div>
</template>

<script setup lang="ts">
const { data, error } = useFetch('/api/llama/test',{
  method:'POST'
})
</script>