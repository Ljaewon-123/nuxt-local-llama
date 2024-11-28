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
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
  ],
  vuetify:{
    vuetifyOptions:{
      theme:{
        themes:{
          light: {
            dark:false,
            colors:{
              confirmBtn: "#1a1a1a",
              blankColor: "#ffffff00"
            },
            variables:{
              "confirm-btn": "#f123",
              "blank-color": "#ffffff00"
            }
          },
          dark: {
            dark: true,
            colors:{
              confirmBtn: "#ffffff",
              blankColor: "#ffffff00"
            },
            variables:{
              "confirm-btn": "#f123",
              "blank-color": "#ffffff00"
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
    experimental: {
      websocket: true
    },
    storage: {
      redis: {
        driver: "redis",
        url: "redis://redis:6379",
      },
    },
  },
  app:{
    head: {
      title: "Llama chat GPT",
      meta: [
        { name: 'description', content: "meta-llama-gpt" }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/two-llama.svg' }
      ]
    }
  },
  runtimeConfig:{
    dburl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    llamaName: "Meta-Llama-3.1-8B-Instruct.Q6_K",
    public:{
      encryptionKey: process.env.ENCRYPTION_KEY,
      rootPath: process.env.NODE_ENV === 'production' ? process.env.AI_PATH : process.cwd(),
    }
  },
  pwa:{ 
    strategies: 'injectManifest',
    registerType: 'autoUpdate',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    manifest:{
      name: 'LLama-GPT',
      short_name:'chat-gpt',
      display: "standalone",
      scope: "/",
      description: "LLama Icon.",
      background_color: "#ffffff",
      theme_color: "#000000",
      icons:[
        { 
          src: "/signin-llama.svg", 
          sizes: "any", 
          type: "image/svg+xml", 
          purpose: "any" 
        }
      ],
      screenshots:[
        {
          src: "/main_wide.png",
          sizes: "1402x870",
          type: "image/png", 
          form_factor: "wide"
        },
        {
          src: "/login_wide.png",
          sizes: "1022x866",
          type: "image/png", 
          form_factor: "wide"
        },
        {
          src: "/login_narrow.png",
          sizes: "476x435",
          type: "image/png", 
          form_factor: "narrow"
        },
      ]
    },
    workbox: {
      globPatterns: [ "**/*.{js,css,html,pdf}"],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      periodicSyncForUpdates: 20,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
})