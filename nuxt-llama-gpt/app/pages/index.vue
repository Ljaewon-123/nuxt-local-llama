<template>
<div class="position-relative " style="min-height: 88vh;">

  <v-row>asd</v-row>

  <div class="position-absolute w-100" style="bottom: 0;">
    <v-row justify="center">
      <v-col cols="8">
        <CallLlama />
      </v-col>
    </v-row>
  </div>
</div>
</template>

<!-- 역할이 딱히;;;??? 이게 푸터라고 표시하는거 외에는 없는거 같은데 -->
<!-- <v-footer class="ma-3" color="rgb(var(--v-theme-background))"> -->
<!-- </v-footer> -->
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
