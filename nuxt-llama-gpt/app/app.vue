<template>
  <v-app :theme="cookieTheme ? 'dark' : 'light'" >
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
type Theme = "dark" | "light";
const colorMode = useColorMode()
const cookieTheme = useCookie<Theme>('color-scheme')

onMounted(() => {
  const initWath = watch(colorMode ,(val) => {
    console.log( val , ' server value ')
    if(!val.unknown){
      setTimeout(() => {
        cookieTheme.value = val.value as Theme
        console.log('change? in watch', cookieTheme.value)
      }, 500)
    }
  },{ flush: 'post', once: true })


  
  setTimeout(() => {
    console.log('allWatch exit')
    unwatch()
    initWath()
  }, 5000)


})


const unwatch = watchEffect(() => {
  if(cookieTheme.value == undefined){
    console.log('um')
    return cookieTheme.value = 'dark'
  }
})


</script>