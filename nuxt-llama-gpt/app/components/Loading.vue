<template>
<v-row
  align="center"
  class="fill-height ma-0"
  :justify="justify"
>
  <v-progress-circular
    color="grey-lighten-5"
    indeterminate
  ></v-progress-circular>
</v-row>
</template>

<script setup lang="ts">

type JustifyType = "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | "stretch" 
const props = defineProps({
  justify: {
    type: String as PropType<JustifyType>,
    default: 'center'
  }
})
</script>