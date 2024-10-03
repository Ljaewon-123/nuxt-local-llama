<template>
<v-card 
rounded="pill" 
density="compact" 
class="d-flex align-center pa-3">
  <v-icon>mdi-paperclip</v-icon>
  <v-textarea
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
// const userInput = defineModel({ default: '' })
const userInput = ref()
const llamaInput = ref()
const emit = defineEmits<{
  (e: 'sendMessage', input: string): void
}>()

const { data, error, execute } = useLazyFetch('/api/llama/test/greeting',{
  method: 'POST',
  watch: false,
  immediate: false,
  body:{
    message: llamaInput  // input에 있는 text미리 없애기 
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
  await execute()
}

</script>