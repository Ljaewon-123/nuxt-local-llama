<template>
  <v-list>
    {{ title }}
  </v-list>
</template>

<script setup lang="ts">
import { useHeaderTitle } from '~/stores/useHeaderTitle';

const headerTitle = useHeaderTitle()
const { title } = storeToRefs(headerTitle)


// 채팅 내용과 관련있는 
// title
// 고유값 
// 

</script>