<template>
<v-row justify="start">
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
  <v-col cols="9">
    <div class="answer">
      {{ answer }}
    </div>

    <div>
      some options area
    </div>
  </v-col>
</v-row>
</template>

<script setup lang="ts">
const { $socket }  = useNuxtApp();

const answer = ref()

onMounted(() => {
  $socket.on('chat', mess => {
    answer.value += mess 
  })
})
</script>