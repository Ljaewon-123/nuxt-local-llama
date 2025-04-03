<template>
  <v-infinite-scroll class="titles" @load="load" >
    <template #error="{ props }">
      <v-alert type="error">
        <div class="d-flex justify-space-between align-center">
          Something went wrong...
          <v-btn
            color="white"
            size="small"
            variant="outlined"
            v-bind="props"
          >
            Retry
          </v-btn>
        </div>
      </v-alert>
    </template>
    <!-- <template #empty>
      <v-alert type="info">No more items!</v-alert>
    </template> -->
    <!-- :to="'/chat/' + doc._id" -->
    <v-list class="px-4" >
      <div v-for="docObject, key, index in data" :key="key">
        <template v-if="Array.isArray(docObject) && docObject.length != 0">
          <v-list-subheader >{{ key }}</v-list-subheader>
          <v-list-item
            v-for="doc, docIndex in docObject"
            :key="doc._id"
            :value="doc._id"
            :to="'/chat/' + doc._id"
            rounded="lg"
          >
            <v-list-item-title v-if="compare(docIndex, index)" :id="'s' + doc._id">
              {{ doc.title }}
            </v-list-item-title>
            <v-text-field 
              v-else
              v-model="changeTitle"
              placeholder="Rename"
              variant="underlined"
              append-inner-icon="mdi-arrow-right-circle"
              density="compact"
              hide-details
              autofocus
              v-click-outside="onClickOutside"
              :click:appendInner="rename"
              @keyup.enter.prevent="rename"
            ></v-text-field>

            <div v-if="compare(docIndex, index)" class="position-absolute" style="top: 50%; transform: translateY(-50%);right: 10%;">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn icon="mdi-dots-horizontal" size="x-small" variant="text" v-bind="props" @click.stop.prevent.self ></v-btn>
                </template>
                <v-card width="250" rounded="lg">
                  <v-list>
                    <v-list-item
                      @click="clickItem(docIndex, index, doc.title, doc._id)"
                      rounded="lg"
                    >
                      <template #prepend>
                        <v-icon :icon="'mdi-pencil-plus-outline'"></v-icon>
                      </template>

                      <v-list-item-title v-text="'Rename'"></v-list-item-title>
                    </v-list-item>
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

    <!-- <v-text-field 
                v-model="doc.title"
                placeholder="Rename"
                variant="underlined"
                append-inner-icon="mdi-arrow-right-circle"
              ></v-text-field> -->
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import { useTrigger } from '~/stores/useTrigger';

interface TitleType {
  _id: string
  title: string
  updatedAt: string // Date 
}

// 이거 맞나 모르겠네... 이거안쓰면 hydrate때문에 워닝뜨긴하는데 
const originTitleData = useState<TitleType[]>(('title') ,() => [])
const currentPage = ref(0)
const isLast = ref(false)

// lazy옵션을키고 transform대신 default옵션을 사용하면??
const { data, error, refresh } = await useFetch(() => `/api/title/${currentPage.value}`,{
  deep :false,
  immediate: false,
  transform: (data:TitleType[] | { last: boolean }) => {
    const dateGrouper = new DateGrouper();

    if ('last' in data) {
      isLast.value = true
      return dateGrouper.splitTitlesByDate(originTitleData.value);
    }

    isLast.value = false
    originTitleData.value.push(...data)
    return dateGrouper.splitTitlesByDate(originTitleData.value);
  },
  // onResponse:() => currentPage.value++
})

const changeTitle = ref()
const currentObjectId = ref()
const { execute: patchExecute, error:patchError } = await useLazyFetch('/api/patch/chat-session-title',{ 
  method: 'PATCH',
  immediate: false,
  watch:false,
  body:{
    id: currentObjectId,
    title: changeTitle
  }
})
const { changeTrigger } = useTrigger()
const triggerP = useTrigger()
const { trigger } = storeToRefs(triggerP)
const changeList = ref(true)
const listId = ref()
const parentId = ref() // 쓰읍...
const route = useRoute()
const { openSnack } = useSnack()

// 최근수정 리스트 가져오기 위한 트리거
watch( trigger, async() => {
  originTitleData.value = []
  currentPage.value = 1
  await refresh()

  // rename 혹은 delete후에 현재 세션id를 가진 라우터라면 index페이지로 이동
  const targetTitle = originTitleData.value.find(titleObj => titleObj._id == route.params.id);
  if (!targetTitle) {
    navigateTo('/');
  }
  
})

const deleteChatSession = async(id:string) => {
  try{
    const success = await $fetch('/api/delete/chat-session', { 
      method: 'DELETE',
      body: {
        id
      }
    })

    if(success) return changeTrigger()
  }
  catch (e: any){
    console.log(e.data.message)
    openSnack(e.data.code, e.data.message)
  }

  // 에러 스낵바 필요 이게 첫번째 필요성인거같은데 => catch에 만듬
}
const rename = async() => {
  await patchExecute()
  if(!patchError.value){
    changeTitle.value = undefined
  }
  changeList.value = true
  changeTrigger()
}

const clickItem = (index:number, parent:number, title:string, id:string) => {
  listId.value = index
  parentId.value = parent
  changeTitle.value = title
  changeList.value = false
  currentObjectId.value = id
}
const onClickOutside = () => {
  changeList.value = true
}
const compare = (index:number, parent:number) => {
  if(parentId.value == parent && listId.value == index){
    if(!changeList.value) return false
  }
  return true
}

const load = async({ done }: any) => {
  // if(!data.value) return
  if(isLast.value) return done('empty')

  currentPage.value++
  await refresh()

  if(error.value){
    throw done('error')
  }

  done('ok')
};

</script>