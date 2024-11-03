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
        <CallLlama @sendMessage="callLlama"/>
      </v-col>
    </v-row>
  </v-bottom-navigation>

</div>
</template>

<script setup lang="ts">
import type { DefineComponent } from 'vue';
import { useHelper } from '~/stores/useHelper';
import type { Chat } from '~~/server/models/ChatHistory';
type ChatArea = { component: DefineComponent<{}, {}, any>, saying?: string, loading?: boolean }
const ChatClient = markRaw(defineAsyncComponent(() =>
  import('~/components/chat/Client.vue')
))
const ChatLlama = markRaw(defineAsyncComponent(() =>
  import('~/components/chat/Llama.vue')
))

const route = useRoute()
const { data, error } = useFetch<Chat[]>(`/api/chat-sssion/${route.params.id}`)
console.log(data.value)

const helper = useHelper()
const { indexSay } = storeToRefs(helper)

const socket = useSocket()
const { $socket } = storeToRefs(socket)
const goTo = useGoTo()
const chatAreaEl = ref()
const { height } = useElementSize(chatAreaEl)
const word = ref()
watchEffect(() => {
  if($socket.value){
    console.log($socket.value, 'socket!!!')
    $socket.value.on('chat', mess => {
      word.value = mess 
    })

    $socket.value.on('goto', () => {
      goTo(height.value)
    })
  }
})
onMounted(() => {
  if(indexSay.value){
    console.log('너뭐해 ', indexSay.value)
    callLlama(indexSay.value)
    indexSay.value = ''
  }
  if(data.value){
    data.value.forEach( history => {
      contentList.value.push({
        component: ChatClient,
        saying: history.messages[1]?.text,
      })
      contentList.value.push({
        component: ChatLlama as any,
        saying: history.messages[2]?.response[0],
        loading:false
      })
      console.log(history.messages[2]?.response[0])
      // history.messages[1] // user
      // history.messages[2] // say llama
    })
  }

})

const contentList = ref<ChatArea[]>([])


// 클라입력 직후에 바로 ai 답변대기 표시를 하고 그 다음에 socket으로 답변을 받는다.
const callLlama = async(say: string) => {
  contentList.value.push({
    component: ChatClient,
    saying: say,
    loading: false
  })

  word.value = ''
  await delay(100) // 혹시 모르니 딜레이 살짝줌 

  contentList.value.push({
    component: ChatLlama as any,
  })

  await delay(1000)
  goTo(height.value)
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
