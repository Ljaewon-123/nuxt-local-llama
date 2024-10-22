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
        ></component>
      </div>
    </div>
  
    <v-bottom-navigation height="94" elevation="0" bg-color="#ffffff00" >
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
  const ChatClient = markRaw(defineAsyncComponent(() =>
    import('~/components/chat/Client.vue')
  ))
  const ChatLlama = markRaw(defineAsyncComponent(() =>
    import('~/components/chat/Llama.vue')
  ))
  
  const { $socket }  = useNuxtApp();
  const goTo = useGoTo()
  const chatAreaEl = ref()
  const { height } = useElementSize(chatAreaEl)
  const word = ref()
  onMounted(() => {
    $socket.on('chat', mess => {
      word.value = mess 
    })
  
    $socket.on('goto', () => {
      goTo(height.value)
    })
  })
  
  type ChatArea = { component: DefineComponent<{}, {}, any>, saying?: string }
  
  const contentList = ref<ChatArea[]>([])
  
  // 클라입력 직후에 바로 ai 답변대기 표시를 하고 그 다음에 socket으로 답변을 받는다.
  const callLlama = async(say: string) => {
    contentList.value.push({
      component: ChatClient,
      saying: say,
    })
  
    word.value = ''
    await delay(100) // 혹시 모르니 딜레이 살짝줌 
  
    contentList.value.push({
      component: ChatLlama,
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
  