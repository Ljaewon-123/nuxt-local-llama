export const usePageAuth = defineStore('pageAuth', () => {

  const dialog = ref(false)

  const openModal = () => {
    dialog.value = !dialog.value
  }

  return {
    dialog,
    openModal
  }
})
