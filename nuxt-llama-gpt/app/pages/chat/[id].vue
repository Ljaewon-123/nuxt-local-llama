<template>
<div class="position-relative ">

  <div id="chat-area" ref="chatAreaEl" class="px-16 py-8" >
    <!-- <ChatLlama /> -->
    <!-- <ChatClient /> -->
    <div v-for="content, index in contentList">
      <component 
      :is="content.component" 
      :saying="content.saying" 
      :word="isLastComponent(index) ? word : ''"
      :isLoading="content.loading"
      ></component>
    </div>
  </div>

  <v-bottom-navigation :name="'navigation' + route.params.id" height="94" elevation="0" bg-color="#ffffff00" >
    <v-row justify="center">
      <v-col cols="8">
        <CallLlama v-model="userInput" @sendMessage="callLlama"/>
      </v-col>
    </v-row>
  </v-bottom-navigation>

</div>
</template>

<script setup lang="ts">

/**
 * 1. 클릭해서 넘어올때
 * 2. 인덱스에서 세션만들고 넘어올때 
 */

import type { DefineComponent } from 'vue';
import { CustomHttpCode } from '~/common/custom-http-code';
import { useHelper } from '~/stores/useHelper';
import type { Chat } from '~~/server/models/ChatHistory';
const ChatClient = markRaw(defineAsyncComponent(() =>
  import('~/components/chat/Client.vue')
))
const ChatLlama = markRaw(defineAsyncComponent(() =>
  import('~/components/chat/Llama.vue')
))
type ChatArea = { component: DefineComponent<{}, {}, any>, saying?: string, loading?: boolean }

const route = useRoute()
const { data, error, execute } = useFetch<Chat[]>(`/api/chat-sssion/${route.params.id}`)
await execute() // 솔직히 이해안되네 워닝은 
console.log(data.value)

const helper = useHelper()
const { indexSay } = storeToRefs(helper)
const socket = useSocket()
const { $socket } = storeToRefs(socket)
const goTo = useGoTo()
const chatAreaEl = ref()
const { height } = useElementSize(chatAreaEl)

const userInput = ref()
const word = ref()

const { execute: textExecute } = useLazyFetch(() => `/api/llama/create-text/${route.params.id}`,{
  method: 'POST',
  watch: false,
  immediate: false,
  body:{
    message: userInput  // input에 있는 text미리 없애기 
  },
  onResponseError: ({ request, response, options }) => {
    const { status } = response
    const { openModal } = usePageAuth()
    
    if(status == CustomHttpCode.LoginSessionInvailed) {
      openModal()
    }
  }
})

watchEffect(() => {
  if($socket.value){
    $socket.value.on('chat', mess => {
      word.value = mess 
    })

    $socket.value.on('goto', () => {
      goTo(height.value)
    })
  }
})
onMounted(() => {
  // index에서 넘어올때 작동 => 필요할지도...
  if(indexSay.value){
    userInput.value = indexSay.value
    callLlama()
    indexSay.value = ''
  }
  // 세션을 누르고 들어올때 작동 
  restoreChatHistory()
})

const restoreChatHistory = () => {
  if(!data.value) return 
  
  // 기존 chat세션에 남아있는 히스토리 가져와서 배치해줌 
  data.value.forEach(history => {
    history.messages.forEach(message => {
      if (message.type === 'user') {
        contentList.value.push({
          component: ChatClient,
          saying: message.text,
        });
      } 
      else if (message.type === 'model') {
        contentList.value.push({
          component: ChatLlama as any,
          saying: message.response?.[0],
          loading: false,
        })
      }
    })
    // history.messages[1] // user
    // history.messages[2] // say llama
  })
}

const contentList = ref<ChatArea[]>([])


// 클라입력 직후에 바로 ai 답변대기 표시를 하고 그 다음에 socket으로 답변을 받는다.
const callLlama = async() => {
  contentList.value.push({
    component: ChatClient,
    saying: userInput.value,
  })

  word.value = ''
  await delay(100) // 혹시 모르니 딜레이 살짝줌 

  contentList.value.push({
    component: ChatLlama as any,
    loading: true
  })

  await delay(1000)
  goTo(height.value)

  // goto 후에 했던거 같은데 
  await textExecute()
}


const isLastComponent = (index: number) => {
  return index === contentList.value.length - 1
}

</script>

<style lang="css" scoped>
/* .test{
  background-color: rgb(var(--v-theme-background));
} */
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
}
</style>
