<template>
<v-form ref="form">
  <h1 class="text-center my-4">Create Account</h1>
  <v-text-field
    v-model="email"
    rounded="lg"
    append-inner-icon="mdi-email-outline"
    label="Email"
    variant="solo-filled"
    :rules="emptyValue"
  ></v-text-field>
  <v-text-field
    v-model="password"
    rounded="lg"
    append-inner-icon="mdi-account-outline"
    label="Password"
    variant="solo-filled"
    :rules="emptyValue"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="show = !show"
  ></v-text-field>
  <v-text-field
    v-model="userName"
    rounded="lg"
    append-inner-icon="mdi-lock-outline"
    label="User name"
    variant="solo-filled"
    :rules="emptyValue"
  ></v-text-field>

  <v-btn @click="signUp" size="x-large" block :loading="status == 'pending'">
    Sign Up <v-icon>mdi-arrow-right-thick</v-icon>
  </v-btn>
</v-form>
</template>

<script setup lang="ts">
import emptyValue from '~/constant/rules/emptyValue';
import CryptoJS from "crypto-js";

const { encryptStr } = useCrypto()
const config = useRuntimeConfig()
const key = CryptoJS.SHA256(config.public.encryptionKey).toString(CryptoJS.enc.Hex)
const emit = defineEmits(['success'])
const show = ref()
const email = ref()
const password = ref()
const encrypt = computed(() => encryptStr(password.value))
const userName = ref()
const form = ref()
const { data, error, execute, status } = useLazyFetch('/api/login/signup', {
  method: 'POST',
  immediate: false,
  watch: false,
  body: {
    email: email,
    password: encrypt ,
    userName: userName
  }
})

const signUp = async() => {
  const { valid } = await form.value.validate()
  if(!valid) return 

  await execute()
  if(!error.value) emit('success')
}



</script>