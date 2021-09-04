<script setup lang="ts">
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/uk'

import { useUserStore } from '../../use/store'

import CatIllustration from '/@/../assets/cat2.svg?component'
import CafeIcon from '/@/../assets/cafe.svg?component'
import CardIcon from '/@/../assets/card.svg?component'
import TravelIcon from '/@/../assets/travel.svg?component'
import MedicineIcon from '/@/../assets/medicine.svg?component'
import SportIcon from '/@/../assets/sport.svg?component'
import ProductsIcon from '/@/../assets/products.svg?component'
import CarIcon from '/@/../assets/car.svg?component'
import ClothesIcon from '/@/../assets/clothes.svg?component'
import TaxiIcon from '/@/../assets/taxi.svg?component'
import AnimalsIcon from '/@/../assets/animals.svg?component'
import BooksIcon from '/@/../assets/books.svg?component'
import FlowersIcon from '/@/../assets/flowers.svg?component'

dayjs.extend(localizedFormat)
dayjs.locale('uk')

interface StatementByDate {
  day: string
  items: Statement[]
}

const icons: any = {
  cafe: CafeIcon,
  card: CardIcon,
  travel: TravelIcon,
  medicine: MedicineIcon,
  sport: SportIcon,
  products: ProductsIcon,
  car: CarIcon,
  clothes: ClothesIcon,
  taxi: TaxiIcon,
  animals: AnimalsIcon,
  books: BooksIcon,
  flowers: FlowersIcon,
}

const props = defineProps<{
  id: string
  keyword?: string
}>()
const { id, keyword } = toRefs(props)
const store = useUserStore()

const isLoading = ref(false)
const statement = computed<Statement[]>(() => store.statements[id.value])
const getStatement = async() => {
  if (!store.statements[id.value]) isLoading.value = true
  store.statements[id.value] = await window.ipc.invoke('statement', id.value)
  isLoading.value = false
}
const filteredAccountStatementByDate = computed<StatementByDate[]>(() => {
  return (statement.value || []).filter(item =>
    item.description.toLowerCase().includes((keyword?.value || '').toLowerCase()),
  ).reduce<StatementByDate[]>((acc, item) => {
    const day = dayjs(item.time).format('LL')
    const dayItem = acc.find(item => item.day === day)

    if (dayItem) {
      dayItem.items.push(item)
    }
    else {
      acc.push({
        day,
        items: [item],
      })
    }

    return acc
  }, [])
})
watch(id, id => getStatement())
getStatement()
</script>

<template>
  <div v-if="isLoading" class="flex flex-grow justify-center items-center h-full">
    <gg:spinner class="animate-spin -ml-1 mr-3 h-10 w-10" />
  </div>
  <div
    v-else-if="filteredAccountStatementByDate.length"
    class="flex-grow h-full overflow-hidden"
  >
    <perfect-scrollbar>
      <ul class="relative px-6">
        <li
          v-for="dayItem in filteredAccountStatementByDate"
          :key="dayItem.day"
        >
          <div
            class="sticky top-0 w-full bg-white py-2 text-xs text-center text-blue-gray-500"
            style="transform: translateY(-1px)"
          >
            {{ dayItem.day }}
          </div>
          <ul>
            <StatementItem
              v-for="statementItem in dayItem.items"
              :key="statementItem.id"
              :item="statementItem"
            >
              <template #icon="{ mcc }">
                <div
                  class="flex justify-center items-center flex-shrink-0 h-8 w-8 rounded-full mr-2"
                  :class="`bg-${mcc.color}-500`"
                >
                  <component :is="icons[mcc.name]" class="h-5 w-5 text-white" />
                </div>
              </template>
            </StatementItem>
          </ul>
        </li>
      </ul>
    </perfect-scrollbar>
  </div>
  <div v-else class="flex flex-grow flex-col items-center mt-10 h-full">
    <div>
      <CatIllustration class="w-32 h-32 text-gray-900" />
      <span class="mt-1 text-sm text-center text-blue-gray-500">{{
        keyword
          ? `За запитом "${keyword}" нічого не знайдено :(`
          : 'Не густо тут у Вас :)'
      }}</span>
    </div>
  </div>
</template>
