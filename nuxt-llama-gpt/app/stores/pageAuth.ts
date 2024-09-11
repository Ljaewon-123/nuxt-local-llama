export const usePageAuth = defineStore('pageAuth', () => {

  const dialog = ref(false)
  const title = ref("Session expired!")
  const text = ref("Your session has expired. You must log in to retrieve your records with Llama.")

  const openModal = () => {
    dialog.value = !dialog.value
  }

  return {
    dialog,
    title,
    text,
    openModal
  }
})
