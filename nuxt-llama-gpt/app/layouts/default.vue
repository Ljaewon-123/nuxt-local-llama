<template>
<div>
  <div >
    <v-app-bar :order="1" color="background">
      <v-app-bar-nav-icon v-if="!drawer" @click="drawer = !drawer">
        <v-icon>mdi-animation-outline</v-icon>
      </v-app-bar-nav-icon>

      <v-app-bar-title>
        llama-GPT
      </v-app-bar-title>

      <template #append>
        <v-btn icon="mdi-magnify"></v-btn>

        <v-btn icon="mdi-dots-vertical"></v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon="mdi-cog-outline"></v-btn>
          </template>
          <v-card width="250" rounded="lg">
            <v-list>
              <v-list-item
                v-for="item, i in configItems"
                :key="i"
                :value="item"
                color="primary"
                rounded="shaped"
                @click="item?.click"
              >
                <template #prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <v-list-item-title v-text="item.text"></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </template>
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

  <!-- <v-bottom-navigation height="94" elevation="0" bg-color="#ffffff00" >
    <v-container fluid >
      <v-row justify="center">
        <v-col cols="8">
          <CallLlama />
        </v-col>
      </v-row>
    </v-container>
  </v-bottom-navigation> -->


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

const configItems = [
  { text: 'My Llama', icon: 'mdi-account-cog' },
  { text: 'Config', icon: 'mdi-cogs' },
  { text: 'Logout', icon: 'mdi-logout', click: logout },
]


</script>