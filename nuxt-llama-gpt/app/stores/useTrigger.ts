export const useTrigger = defineStore('trigger', () => {

  // 어차피 저장해야되서 이거 사용할 필요도 없네... 있네
  const trigger = ref(false)
  const changeTrigger = () => {
    trigger.value = !trigger.value
  }
  

  return {
    changeTrigger,
    trigger,
  }
})
