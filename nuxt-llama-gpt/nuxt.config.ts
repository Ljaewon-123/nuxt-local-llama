// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxt/image',
    "vuetify-nuxt-module",
    '@nuxtjs/color-mode',
    '@sidebase/nuxt-auth'
  ],
  auth: {
    baseURL: 'http://localhost:3000/api/',
    provider: {
      type: 'local',
      pages: {
        login: '/login'
      },
      endpoints: {
        signIn: { path: '/login/signin', method: 'post' },
        signUp: { path: '/login/signup', method: 'post' },
        // signOut: { path: '/logout', method: 'post' },
        getSession: { path: '/auth/session', method: 'get' },
      }
      // sessionDataType: {
      //   id: 'string | number',
      //   email: 'string',
      //   userName: 'string',
      //   password: 'string'
      // }
    },
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    sessionRefresh: {
      enablePeriodically: true,
      enableOnWindowFocus: true,
    },
    globalAppMiddleware: true
    // provider: { /* your provider config */ },
  },
  runtimeConfig:{
    dburl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME
  }
})