export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', async() => {
    console.log('global auth plugins middleware only client')

    await useFetch("/api/auth/page-auth",{
      server: false,
    })

  }, { global: true })
})