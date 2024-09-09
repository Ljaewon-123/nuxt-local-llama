export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth', () => {
    console.log('global auth  plugins middleware only client')
  }, { global: true })
})