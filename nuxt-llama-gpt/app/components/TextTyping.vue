<template>
  <div class="container" >
    <span class="font-setup first-text">{{ props.defaultText }}</span>
    <span :class="cookieTheme" class="font-setup text sec-text text-color-back">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Theme } from '~/types/Theme.type';

const props = defineProps({
  texts: {
    type: Array<String>,
    required: true
  },
  defaultText: {
    type: String,
    default: "I'm a"
  },
  accentColor: {
    type: String,
    default: '#4070F4'
  }
})

const cookieTheme = useCookie<Theme>('color-scheme')
const DEFAULT_SEQ = 4000
const text = ref('')
const seq = computed(() => props.texts.length)
const timeoutId = ref()
const { smAndUp } = useDisplay()
const downDisplay = computed(() => !smAndUp.value ? '1.5rem' : '3rem')

onMounted(() => {
  
  const textLoad = () => {
    props.texts.forEach( (propText, index) => {
      setTimeout(() => {
        text.value = " " + propText;
      }, DEFAULT_SEQ * index);
    })
  }
  textLoad();
  timeoutId.value = setInterval(textLoad, DEFAULT_SEQ * seq.value);
})

onUnmounted(() => clearInterval(timeoutId.value))
</script>

<style lang="css" scoped>

.container{
  overflow: hidden;
}
.container .text{
  position: relative;
  color: v-bind(accentColor);
}
.font-setup{
  font-size: v-bind(downDisplay);
  font-weight: 600;
}
.container .text.first-text{
  color: #FFF;
}
.text.sec-text:before{
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-left: 2px solid v-bind(accentColor);
  animation: animate 4s steps(12) infinite;
}
.dark.text.sec-text:before{
  background-color:  #111111;
}
.light.text.sec-text:before{
  background-color:  #ffffff;
}
@keyframes animate{
  40%, 60%{
    left: calc(100% + 4px);
  }
  100%{
    left: 0%;
  }
}
</style>