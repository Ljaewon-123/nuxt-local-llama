<template>
<v-main class="d-flex justify-center align-center login-image">
  <v-container>
    <v-row class="form-container">
      <v-col v-if="name !== 'xs'" class="col-1 d-flex align-center justify-center" style="height: 600px;" :class="signIn ? 'col-radius-1' : 'col-radius-2'" >

        <v-slide-x-transition>
          <v-avatar size="300" >
            <VImg 
            :lazy-src="`${signIn ? 'signin' : 'signup'}-llama.svg`" height="300" width="300"
            :src="`${signIn ? 'signin' : 'signup'}-llama.svg`" 
            >
            <template #placeholder>
              <LazyLoading />
            </template>
            </VImg>
          </v-avatar>
        </v-slide-x-transition>

      </v-col>
      <v-col align-self="center">
        <div class="d-flex justify-center ga-3">
          <v-btn @click="switchSignIn" color="#5C7694" rounded="xl">Sign In</v-btn>
          <v-btn @click="switchSignUp" color="#9CC6D8" rounded="xl">Sign Up</v-btn>
        </div>
        <v-slide-x-transition mode="out-in">
          <LazyLoginSignIn v-if="signIn"></LazyLoginSignIn>
        </v-slide-x-transition>
        <v-slide-x-reverse-transition mode="out-in">
          <LazyLoginSignUp @success="switchSignIn" v-if="signUp"></LazyLoginSignUp>
        </v-slide-x-reverse-transition>
      </v-col>
    </v-row>
    <!-- <br>
    <Connection /> -->
  </v-container>
</v-main>
</template>

<script setup lang="ts">

definePageMeta({
  layout: false,
})
const { name } = useDisplay()
const signIn = ref(true)
const signUp = ref(false)

// const arr = ref([1,2,3,4])
// const test2 = (refVal: Ref<number[]>) => {
//   refVal.value.splice(1,1) // 빼는건 되는데 초기화는 안되네
// }
const switchSignIn = async() => {
  signUp.value = false
  await nextTick() // 이걸해도 안되네 
  setTimeout(() => signIn.value = true, 350)
}
const switchSignUp = async() => {
  signIn.value = false
  await nextTick()
  setTimeout(() => signUp.value = true, 350)
}


// 방법이 없을까 
// const switchSign = (ref1: Ref<boolean>, ref1ㅋ: Ref<boolean>) => {
//   signUp.value = true
//   setTimeout(() => signIn.value = false, 300)
// }

</script>

<style lang="css" scoped>
.login-image{
  background: url('../../public/snowmountain.svg');
  background-position: center;
  background-repeat: no-repeat;
  /* background-size : contain; */
  background-size : cover;
  
}
.form-container{
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  backdrop-filter: blur(20px);
  max-width: 1192;
}
.col-1{
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 55%; */
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(30px);
  transition: border-radius .3s;
}
.col-radius-1{
  border-radius: 25px 30% 20% 25px;
}
.col-radius-2{
  border-radius: 25px 70% 50% 25px;
}
</style>