<template>
<div class="position-relative ">

  <v-main>
    <div id="welcome-text" class="px-8 py-8" >
      <p style="font-weight: 600;" :style="{ 'font-size': downDisplay }">
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
        <CallLlama @sendMessage="createText"/>
      </v-col>
    </v-row>
  </v-bottom-navigation>

</div>
</template>

<script setup lang="ts">
import { CustomHttpCode } from '~/common/custom-http-code';
import { useHelper } from '~/stores/useHelper';

const { openModal, closeModal } = useGlobalDialog()
const { changeTrigger } = useTrigger()
const { openSnack } = useSnack()
const helper = useHelper()
const { indexSay } = storeToRefs(helper)
const userInput = ref()
const { data: titleData ,error: titleError, execute: titleExecute, status } = useLazyFetch('/api/llama/create-title',{
  method: 'POST',
  immediate: false,
  watch: false,
  body:{
    message: userInput
  },
  default:() => 'New Chat', // transform: title => title ?? 'New Chat' 흠 
  onResponseError: ({ request, response, options }) => {
    const { status } = response
    const { openModal } = useGlobalDialog()
    
    if(status == CustomHttpCode.LoginSessionInvailed) {
      return openModal()
    }

  }
})


const createText = async(say: string) => {
  // indexSay 필요할지도...
  userInput.value  = say
  indexSay.value = say

  await titleExecute()

  if(titleError.value) {
    openSnack(500, 'Server Error') // createError필요?
    throw createError({statusCode: 500, message: 'Server Error'})  // 여기서 크리에트는?
  }

  changeTrigger() // 사이드바에 타이틀 재조정 하는데 사용여기서는 
  console.log('AI 컴퓨터 메모리 에러만 아니면 정상동작한다.')
  await navigateTo(`/chat/${titleData.value}`)
}

// pending중에만 띄우고 결과가 나오면 닫음 idle(시작전) 에는 동작안함 
watchEffect(() => {
  closeModal()
  if(status.value == 'pending'){
    openModal('entireLoading')
  }
})


const { smAndUp } = useDisplay()
const downDisplay = computed(() => !smAndUp.value ? '2.5rem' : '5rem')
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
