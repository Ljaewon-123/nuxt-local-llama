export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', () => {
    console.log('global auth plugins middleware only client')

    const { data } = useFetch("/api/auth/page-auth",{
      server: false,
    })

  }, { global: true })
})