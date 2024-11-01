<template>
<v-card 
rounded="pill" 
density="compact" 
class="d-flex align-center pa-3">
  <v-icon>mdi-paperclip</v-icon>
  <v-textarea
    :id="id"
    v-model="userInput"
    flat
    placeholder="Call the llama"
    variant="solo"
    row-height="15"
    rows="1"
    max-rows="3"
    auto-grow
    hide-details
    no-resize
    density="compact"
    @keydown="handleKeydown"
  >
    <template #append-inner>
      <v-avatar 
      v-ripple 
      @click="emitInput" 
      color="confirmBtn"
      icon="mdi-arrow-up"
      style="cursor: pointer;"
      ></v-avatar>
    </template>
  </v-textarea>
</v-card>
</template>

<script setup lang="ts">
import { CustomHttpCode } from '~/common/custom-http-code';
import { useTrigger } from '~/stores/useTrigger';

const { changeTrigger } = useTrigger()
const userInput = ref()
const llamaInput = ref()
const emit = defineEmits<{
  (e: 'sendMessage', input: string): void
}>()
const id = useId()
const route = useRoute()

const { execute: textExecute } = useLazyFetch('/api/llama/create-text',{
  method: 'POST',
  watch: false,
  immediate: false,
  body:{
    message: llamaInput  // input에 있는 text미리 없애기 
  },
  onResponseError: ({ request, response, options }) => {
    const { status } = response
    const { openModal } = usePageAuth()
    
    if(status == CustomHttpCode.LoginSessionInvailed) {
      openModal()
    }
  }
})

const { data: titleData ,error: titleError, execute: titleExecute } = useLazyFetch('/api/llama/create-title',{
  method: 'POST',
  immediate: false,
  watch: false,
  body:{
    message: llamaInput
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

const emitInput = () => {
  console.log('Test method called:', userInput.value)
  emit('sendMessage', userInput.value)
  llamaInput.value = userInput.value
  userInput.value = ''
}

const handleKeydown = async(event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Shift 없이 Enter를 누른 경우
    event.preventDefault() // 기본 개행 동작 방지
    emitInput() // 메서드 호출
    
    await sendMessageLlama() // llama 호출 

    return
  }
}

const sendMessageLlama = async() => {
  // route가 "/"면 초기 페이지로 여기서 입력하게 되면 제목을 생성한후 해당 params로 이동 
  // chat/id 라면 text생성만 
  if(route.name == 'index'){
    await titleExecute()
    if(titleError.value) throw createError({statusCode: 500, message: 'Server Error'})  // 여기서 크리에트는?
  
    changeTrigger() // 사이드바에 타이틀 재조정 

    await navigateTo(`/chat/${titleData.value}`)
    return
  }

  // 결국 별개의 컴포넌트 실행이라 내부에서는 해줄게 없다.
  await textExecute()
}

</script>