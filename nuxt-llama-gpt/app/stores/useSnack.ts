// 전역 인증 모달 제외 스낵바
export const useSnack = defineStore('snack', () => {
  const snackbar = ref(false)
  const text = ref('Unknow Error')
  const openSnack = (code = 500, message = "Server Error") => {
    snackbar.value = true
    text.value = `${code}: ${message}`
  }
  return {
    snackbar,
    text,
    openSnack
  }
})
