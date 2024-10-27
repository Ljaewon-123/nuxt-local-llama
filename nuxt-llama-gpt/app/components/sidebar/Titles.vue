<template>
  <div  >
    <!-- :to="'/chat/' + doc._id" -->
    <v-list class="px-4" >
      <div v-for="docObject, key, index in data" :key="key">
        <template v-if="Array.isArray(docObject) && docObject.length != 0">
          <v-list-subheader >{{ key }}</v-list-subheader>
          <v-list-item
            v-for="doc in docObject"
            :key="doc._id"
            :title="doc.title"
            :value="doc._id"
            :to="'/chat/' + doc._id"
            rounded="lg"
          >
            <div class="position-absolute" style="top: 50%; transform: translateY(-50%);right: 10%;">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon="mdi-dots-horizontal" size="x-small" variant="text" v-bind="props" @click.stop.prevent.self ></v-btn>
                </template>
                <v-card width="250" rounded="lg">
                  <v-list>
                    <v-list-item
                      @click="deleteChatSession(doc._id)"
                      base-color="error"
                      rounded="lg"
                    >
                      <template #prepend>
                        <v-icon :icon="'mdi-delete-outline'"></v-icon>
                      </template>

                      <v-list-item-title v-text="'Delete'"></v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </div>
          </v-list-item>
        </template>
      </div>
    </v-list>
    <!-- <template v-else-if="docObject.constructor == Object && Object.keys(docObject).length == 0">
      <v-list class="px-4" >
        <v-list-subheader >{{ key }}</v-list-subheader>
        <v-list-item
          v-for="doc in docObject"
          :key="doc._id"
          :title="doc.title"
          :value="doc._id"
          :subtitle="doc.updatedAt"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </template> -->
  </div>
</template>

<script setup lang="ts">
import { useTrigger } from '~/stores/useTrigger';
const { changeTrigger } = useTrigger()
interface TitleType {
  _id: string
  title: string
  updatedAt: string // Date 
}

const { data, error, refresh } = useFetch('/api/title',{
  transform: (data:TitleType[]) => {
    const dateGrouper = new DateGrouper();
    return dateGrouper.splitTitlesByDate(data);
  }
})

const triggerP = useTrigger()
const { trigger } = storeToRefs(triggerP)

watch( trigger, async() => {
  await refresh()
})

const deleteChatSession = async(id:string) => {
  const res = await $fetch('/api/delete/chat-session', { 
    method: 'DELETE',
    body: {
      id
    }
  })
  
  if(res) changeTrigger()
}

</script>