<template>
<v-form ref="form">
  <h1 class="text-center my-4">Sign In</h1>
  <v-text-field
    v-model="email"
    rounded="lg"
    append-inner-icon="mdi-account-outline"
    label="User Name"
    variant="solo-filled"
    :rules="emptyValue"
  ></v-text-field>
  <v-text-field
    v-model="password"
    rounded="lg"
    append-inner-icon="mdi-lock-outline"
    label="Password"
    variant="solo-filled"
    :rules="emptyValue"
    :type="show ? 'text' : 'password'"
    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="show = !show"
  ></v-text-field>

  <v-btn size="x-large" block>
    Sign In <v-icon>mdi-arrow-right-thick</v-icon>
  </v-btn>
</v-form>
</template>

<script setup lang="ts">
import emptyValue from '~/constant/rules/emptyValue';

const show = ref(false)
const email = ref()
const password = ref()

const {data, error, execute } = useLazyFetch('/api/login/signin', {
  method: 'POST',
  immediate: false,
  watch: false,
  body: {
    email: email,
    password: password
  }
})
</script>