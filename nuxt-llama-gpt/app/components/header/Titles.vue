<template>
  <div v-for="docObject, key, index in data" :key="key" >
    <template v-if="Array.isArray(docObject) && docObject.length != 0">
      <v-list class="px-4" >
        <v-list-subheader >{{ key }}</v-list-subheader>
        <v-list-item
          v-for="doc in docObject"
          :key="doc._id"
          :title="doc.title"
          :value="doc._id"
          :subtitle="doc.updatedAt"
          :to="doc._id"
          rounded="lg"
        ></v-list-item>
      </v-list>
    </template>
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

interface TitleType {
  _id: string
  title: string
  updatedAt: string // Date 
}

const { data, error, refresh } = useFetch('/api/title',{
  transform: (data:TitleType[]) => {
    return splitTitlesByDate(data)
  }
})

const triggerP = useTrigger()
const { trigger } = storeToRefs(triggerP)

watch( trigger, async() => {
  await refresh()
})

const isToday = (date: Date, now: Date) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date >= today;
};

const isYesterday = (date: Date, now: Date) => {
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return date >= yesterday && date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const isThreeDaysAgo = (date: Date, now: Date) => {
  const threeDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
  return date >= threeDaysAgo && date < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
};

const isSevenDaysAgo = (date: Date, now: Date) => {
  const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
  return date >= sevenDaysAgo && date < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3);
};

const isThirtyDaysAgo = (date: Date, now: Date) => {
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  return date >= thirtyDaysAgo && date < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
};

const isSameMonth = (date: Date, now: Date) => date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();

const isWithinSameYear = (date: Date, now: Date) => date.getFullYear() === now.getFullYear();

function splitTitlesByDate(titles: TitleType[]) {
  const now = new Date();
  
  const grouped = {
    today: [] as TitleType[],
    yesterday: [] as TitleType[],
    threeDaysAgo: [] as TitleType[],
    sevenDaysAgo: [] as TitleType[],
    thirtyDaysAgo: [] as TitleType[],
    // etc: [] as TitleType[],
    pastMonths: {} as Record<string, TitleType[]>, // Grouped by month
    pastYears: {} as Record<number, TitleType[]>,  // Grouped by year
  };

  titles.forEach((title) => {
    const updatedAtDate = new Date(title.updatedAt);

    // 각 조건별로 분리된 함수를 통해 유지보수 용이하게 처리
    if (isToday(updatedAtDate, now)) grouped.today.push(title)

    else if (isYesterday(updatedAtDate, now)) grouped.yesterday.push(title)

    else if (isThreeDaysAgo(updatedAtDate, now)) grouped.threeDaysAgo.push(title)

    else if (isSevenDaysAgo(updatedAtDate, now)) grouped.sevenDaysAgo.push(title)

    else if (isThirtyDaysAgo(updatedAtDate, now)) grouped.thirtyDaysAgo.push(title)

    // else{
    //   grouped.thirtyDaysAgo.push(title)
    // }

    else if (isWithinSameYear(updatedAtDate, now)) {
      // 같은 연도 내에서 월별로 분리
      const month = updatedAtDate.toLocaleString('default', { month: 'long' })
      const monthKey = `${updatedAtDate.getFullYear()}-${month}`
      if (!grouped.pastMonths[monthKey]) {
        grouped.pastMonths[monthKey] = []
      }
      grouped.pastMonths[monthKey].push(title)
    } 
    else {
      // 연도가 다르면 연도별로 그룹화
      const year = updatedAtDate.getFullYear()

      if (!grouped.pastYears[year]) grouped.pastYears[year] = []

      grouped.pastYears[year].push(title)
    }
  })

  return grouped
}

</script>