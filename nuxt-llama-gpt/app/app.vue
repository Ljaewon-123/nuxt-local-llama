<template>
  <v-app :theme="cookieTheme ? 'dark' : 'light'" >
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>

<!-- pageauth를 할때 사용할 모달인데... 이런 전역 모달이 많이 사용되면 동적component사용하고 아니면 이대로?? -->
    <v-dialog
      v-model="dialog"
      width="auto"
      persistent
    >
      <AuthTimeoutModal v-model="dialog" />
    </v-dialog>

  </v-app>
</template>

<script setup lang="ts">

type Theme = "dark" | "light";
const colorMode = useColorMode()
const cookieTheme = useCookie<Theme>('color-scheme')

const { dialog } = storeToRefs(usePageAuth())

onMounted(() => {
  const initWath = watch(colorMode ,(val) => {
    // console.log( val , ' server value ')
    if(!val.unknown){
      setTimeout(() => {
        cookieTheme.value = val.value as Theme
        // console.log('change? in watch', cookieTheme.value)
      }, 500)
    }
  },{ flush: 'post', once: true })


  
  setTimeout(() => {
    // console.log('allWatch exit')
    unwatch()
    initWath()
  }, 5000)


})


const unwatch = watchEffect(() => {
  if(cookieTheme.value == undefined){
    return cookieTheme.value = 'dark'
  }
})


</script>