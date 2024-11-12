type modalType = 'auth' | 'entireLoading'
export const useGlobalDialog = defineStore('globalDialog', () => {

  const dialog = ref(false)
  const type = ref<modalType>('auth')
  const title = ref("Session expired!")
  const text = ref("Your session has expired. You must login to retrieve your records with Llama.")

  const openModal = (modalType: modalType = 'auth') => {
    dialog.value = !dialog.value
    type.value = modalType
  }

  const closeModal = () => {
    dialog.value = false
  }

  return {
    dialog,
    title,
    text,
    type,
    openModal,
    closeModal
  }
})
