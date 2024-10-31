<template>
<div class="position-relative ">

  <v-main>
    <div id="welcome-text" class="px-8 py-8" >
      <p style="font-weight: 600; font-size: 5rem;">
        Welcome 
        <span style="color:#4070F4">
          Hello World
        </span>
      </p>
      <TextTyping :texts="[
        'Your helper',
        'Your smart llama',
        'Your friend'
      ]"
      />  
    </div>
  </v-main>

  <!-- layout으로 이동?? -->
  <!-- bottom-navigation을 안쓰고 callLlama를 사용할수도 있을거같아서 이동하지 않음 -->
  <v-bottom-navigation :name="'main-navigation'" height="94" elevation="0" bg-color="#ffffff00" >
    <v-row justify="center">
      <v-col cols="8">
        <CallLlama @sendMessage="indexCall"/>
      </v-col>
    </v-row>
  </v-bottom-navigation>

</div>
</template>

<script setup lang="ts">
import { useHelper } from '~/stores/useHelper';

const helper = useHelper()
const { indexSay } = storeToRefs(helper)

const indexCall = (say: string) => {
  indexSay.value = say
}

</script>

<style lang="css" scoped>
/* .test{
  background-color: rgb(var(--v-theme-background));
} */
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
}
</style>
