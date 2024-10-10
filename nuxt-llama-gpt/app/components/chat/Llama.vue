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
    <div v-if="loading" >
      <LazyLoading :justify="'start'" />
    </div>
    <div class="answer" v-html="parsedAnswer"></div>
    <!-- <div class="answer">{{ answer }}</div> -->
    <div>
      some options area
    </div>
  </v-col>
</v-row>
</template>

<script setup lang="ts">
import { marked } from 'marked';

const props = defineProps({
  coment: String
})
const { $socket }  = useNuxtApp();

const answer = ref("")
const parsedAnswer = ref();

watchEffect(() => {
  answer.value += props.coment ?? ''
  parsedAnswer.value = marked(answer.value); // 마크다운을 HTML로 변환
})
const loading = ref(true)

onMounted(() => {
  $socket.on('chat', mess => {
    loading.value = false
  })
})
</script>
