<template>
<div>
  <div >
    <v-app-bar :order="1">
      <v-app-bar-title>
        side header
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      permanent
    >
      <v-list nav>
        <!-- <NuxtLink to="/" >
          <v-list-item :prepend-icon="'mdi-tray-full'" 
          :title="'index'" 
          :value="'index'"></v-list-item>
        </NuxtLink>
        <NuxtLink v-for="nav, index in navList" :key="index" 
        :to="{ path: `/docs${nav.to}` }" >
          <v-list-item :prepend-icon="nav.icon" 
          :title="nav.title" 
          :value="nav.value"></v-list-item>
        </NuxtLink> -->
      </v-list>
    </v-navigation-drawer>
  </div>
  <v-main class="d-flex align-center justify-center ">
    <slot></slot>
  </v-main>
</div>
</template>