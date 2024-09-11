// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: [
    '@nuxt/image',
    "vuetify-nuxt-module",
    '@nuxtjs/color-mode',
    "@pinia/nuxt",
  ],
  vuetify:{
    vuetifyOptions:{
      theme:{
        themes:{
          light: {
            dark:false,
            colors:{
              confirmBtn: "#1a1a1a"
            },
            variables:{
              "confirm-btn": "#f123"
            }
          },
          dark: {
            dark: true,
            colors:{
              confirmBtn: "#ffffff"
            },
            variables:{
              "confirm-btn": "#f123"
            }
          },
        }
      }
    }
  },
  pinia: {
    storesDirs: ['./app/stores/**','./stores/**'],
  },
  nitro: {
    storage: {
      redis: {
        driver: "redis",
        url: "redis://localhost:6379",
      },
    },
  },
  runtimeConfig:{
    dburl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    public:{
      encryptionKey: process.env.ENCRYPTION_KEY
    }
  }
})