<template>
<div>

  <v-textarea
    prepend-inner-icon="mdi-paperclip"
    rounded="pill"
    placeholder="Input Llama message"
    row-height="15"
    rows="1"
    max-rouws="6"
    variant="solo"
    auto-grow
    no-resize
  ></v-textarea>

  <v-textarea
          label="One row"
          row-height="15"
          rows="1"
          max-rows="3"
          variant="outlined"
          auto-grow
        ></v-textarea>

  <br><br><br>

  <v-card rounded="pill" class="d-flex align-center pa-4">
    <v-icon>mdi-paperclip</v-icon>
    <v-textarea
    flat
    placeholder="Input Llama message"

    row-height="15"
    rows="1"
    max-rows="6"
    hide-details
    no-resize
  ></v-textarea>
  </v-card>

</div>
</template>