<template>
<div>
  <div >
    <v-app-bar :order="1">
      <v-app-bar-nav-icon v-if="!drawer" @click="drawer = !drawer">
        <v-icon>mdi-animation-outline</v-icon>
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        llama-GPT
        <v-btn @click="logout" color="confirmBtn" variant="flat">test log out</v-btn>
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      persistent
      permanent
    >
      <template #prepend>
        <div class="d-flex align-center" style="height: 64px;">
          <v-app-bar-nav-icon @click="drawer = !drawer">
            <v-icon>mdi-animation-outline</v-icon>
          </v-app-bar-nav-icon>
        </div>
      </template>
      <!-- <v-list >

      </v-list> -->
    </v-navigation-drawer>
  </div>
  <v-main class="d-flex align-center justify-center position-relative">
    <v-container fluid >
      <slot></slot>
    </v-container>
  </v-main>
</div>
</template>

<script setup lang="ts">
const drawer = ref(true)

const logout = async() => {
  try {
    await $fetch('/api/logout')
    navigateTo('/login')
  } catch (error) {
    console.error(error, 'server error')
  }
}

</script>