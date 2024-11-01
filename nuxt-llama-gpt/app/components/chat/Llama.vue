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
import DOMPurify from 'dompurify';

const props = defineProps({
  word: String
})
const socket = useSocket()
const { $socket } = storeToRefs(socket)

const answer = ref("")
const parsedAnswer = ref();

// const paragraphSeparation = computed(() => )

watchEffect(async () => {
  // console.log(props.word) 뭔지 못찾음
  // if(props.word == '\n\n') { console.log(props.word, 'n둘') }
  // if(props.word == '\n') { console.log(props.word, 'n하나')}
  // if(props.word == " ''' ") { console.log(props.word," ''' ")}
  // if(props.word == " '' ") { console.log(props.word," '' ")}

  answer.value += props.word ?? ''
  parsedAnswer.value = DOMPurify.sanitize(await marked(answer.value)); // 마크다운을 HTML로 변환 xss예방 
})
const loading = ref(true)

onMounted(() => {
  if(!$socket.value) throw Error('Socket Connect Error')
  $socket.value.on('chat', mess => {
    loading.value = false
  })
})
</script>
