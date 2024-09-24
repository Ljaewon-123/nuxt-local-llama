<template>
<div class="position-relative " style="min-height: 88vh;">

  <div class="chat-area w-100 px-16 py-8" >
    <v-row justify="start">
      <v-avatar>
        <v-img
          alt="Llama"
          src="/two-llama.svg"
        ></v-img>
      </v-avatar>
      <v-col cols="10">
        <div>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore libero eius, et nostrum officiis consequuntur, magni atque animi excepturi saepe suscipit accusamus, beatae sit recusandae officia nemo molestiae impedit necessitatibus?
        </div>

        <div>
          some options area
        </div>
      </v-col>
    </v-row>

    <v-row justify="end">
      <v-col cols="7">
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In necessitatibus sapiente deserunt asperiores error facilis doloribus corporis nihil, quae amet laborum quia fuga. Sapiente modi, vero nulla fugiat nihil deserunt?
        </div>
      </v-col>
      <v-avatar>
        <v-img
          alt="Llama"
          src="/two-llama.svg"
        ></v-img>
      </v-avatar>
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
