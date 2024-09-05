<template>
<div>
  <h1 class="text-center my-4">Create Account</h1>
  <v-text-field
    rounded="lg"
    append-inner-icon="mdi-email-outline"
    label="Email"
    variant="solo-filled"
  ></v-text-field>
  <v-text-field
    rounded="lg"
    append-inner-icon="mdi-account-outline"
    label="User Name"
    variant="solo-filled"
  ></v-text-field>
  <v-text-field
    rounded="lg"
    append-inner-icon="mdi-lock-outline"
    label="Password"
    variant="solo-filled"
  ></v-text-field>

  <v-btn size="x-large" block>
    Sign Up <v-icon>mdi-arrow-right-thick</v-icon>
  </v-btn>
</div>
</template>