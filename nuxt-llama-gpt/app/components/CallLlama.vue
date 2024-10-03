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
const userInput = defineModel({ default: '' })
const emit = defineEmits<{
  (e: 'sendMessage', input: string): void
}>()
const emitInput = () => {
  console.log('Test method called:', userInput.value)
  emit('sendMessage', userInput.value)
  userInput.value = ''
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    // Shift 없이 Enter를 누른 경우
    event.preventDefault() // 기본 개행 동작 방지
    emitInput() // 메서드 호출
    return
  }
  // else if (event.key === 'Enter' && event.shiftKey) {
  //   // Shift + Enter인 경우 줄바꿈 문자 추가
  //   event.preventDefault() // 기본 개행 방지
  //   userInput.value += '\n' // 개행 문자 추가
  // }
}
</script>