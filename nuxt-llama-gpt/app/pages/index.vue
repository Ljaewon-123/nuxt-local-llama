<template>
<div class="position-relative ">

  <v-main>
    <div id="welcome-text" class="px-8 py-8" >
      <p style="font-weight: 600; font-size: 5rem;">
        Welcome 
        <span style="color:#4070F4">
          Hello World
        </span>
      </p>
      <TextTyping :texts="[
        'Your helper',
        'Your smart llama',
        'Your friend'
      ]"
      />  
    </div>
  </v-main>

  <!-- layout으로 이동?? -->
  <!-- bottom-navigation을 안쓰고 callLlama를 사용할수도 있을거같아서 이동하지 않음 -->
  <v-bottom-navigation :name="'main-navigation'" height="94" elevation="0" bg-color="#ffffff00" >
    <v-row justify="center">
      <v-col cols="8">
        <CallLlama v-model="userInput" @sendMessage="createText"/>
      </v-col>
    </v-row>
  </v-bottom-navigation>

</div>
</template>

<script setup lang="ts">
/*
  useHelper 삭제하는게 목표, 근본이 되었던 route.name == index 페이지 에서 특정 세션 페이지로 넘어갈때에 로직을 정리한다.
  지금은 llama한테 보내는 fatch 자체가 CallLlama내부에 있어서 ( create-title, create-text )
  router가 이동하면서 하는 특정 동작이 굉장히 어거지스럽고 부자연스러운데 이것을 고치는게 목표다 ( 오래걸리기까지함 )
  fatching 코드를 내부가 아니라 라우터에서 동작하게 하고 각각 로직을 나눈다. 
  인덱스에서 동작시 title매서드를 보내고 로딩을 띄워줌 title이 완료되면 왼쪽에 세션을 만들고 페이지를 이동함 그후 페이지를 이동해서 text동작 
  ## 페이지를 클릭해서 들어갈때와 index에서 fatching을 하고 넘어갈때를 구분해서 동작시켜야함 
*/

import { CustomHttpCode } from '~/common/custom-http-code';
import { useHelper } from '~/stores/useHelper';

const userInput = ref()
const { changeTrigger } = useTrigger()
const helper = useHelper()
const { indexSay } = storeToRefs(helper)

const { data: titleData ,error: titleError, execute: titleExecute } = useLazyFetch('/api/llama/create-title',{
  method: 'POST',
  immediate: false,
  watch: false,
  body:{
    message: userInput
  },
  transform: title => title ?? 'New Chat',
  onResponseError: ({ request, response, options }) => {
    const { status } = response
    const { openModal } = usePageAuth()
    
    if(status == CustomHttpCode.LoginSessionInvailed) {
      openModal()
    }
  }
})


const createText = async() => {
  // indexSay 필요할지도...
  indexSay.value = userInput.value

  await titleExecute()

  if(titleError.value) throw createError({statusCode: 500, message: 'Server Error'})  // 여기서 크리에트는?

  changeTrigger() // 사이드바에 타이틀 재조정 하는데 사용여기서는 

  await navigateTo(`/chat/${titleData.value}`)
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
