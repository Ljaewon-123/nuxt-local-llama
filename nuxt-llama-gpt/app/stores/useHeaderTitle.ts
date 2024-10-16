export const useHeaderTitle = defineStore('headerTitle', () => {

  // 어차피 저장해야되서 이거 사용할 필요도 없네...
  const title = ref('')
  const getAiTitle = (text: string) => {
    title.value = text
  }
  const callTitle = () => title.value
  

  return {
    getAiTitle,
    callTitle,
    title,
  }
})
