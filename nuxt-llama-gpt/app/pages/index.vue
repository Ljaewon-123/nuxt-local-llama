<template>
<div class="position-relative ">

  <div id="welcome-text" class="px-16 py-8" >
    Welcome Hello World
  </div>

  <!-- 이놈이 좀더 free해야할거 같은데  -->
  <v-bottom-navigation height="94" elevation="0" bg-color="#ffffff00" >
    <v-row justify="center">
      <v-col cols="8">
        <CallLlama />
      </v-col>
    </v-row>
  </v-bottom-navigation>

</div>
</template>

<script setup lang="ts">


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
