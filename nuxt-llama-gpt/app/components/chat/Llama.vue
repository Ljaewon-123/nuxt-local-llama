<template>
<v-row justify="start">
  <v-avatar>
    <v-img
      alt="Llama"
      src="public/two-llama.svg"
    >
      <template #placeholder>
        <LazyLoading />
      </template>
    </v-img>
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
</template>