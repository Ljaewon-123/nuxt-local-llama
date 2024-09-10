export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', async() => {
    console.log('global auth plugins middleware only client')
    
    const { dialog } = storeToRefs(usePageAuth())

    const { error } = await useFetch("/api/auth/page-auth",{
      server: false,
    })
    
    console.log(error.value?.data, '@@@@@@@@@@@@@')
    if(error.value) dialog.value = true

  }, { global: true })
})