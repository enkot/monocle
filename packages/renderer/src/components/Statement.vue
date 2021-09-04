<script setup lang="ts">
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/uk'

import { useUserStore } from '../use/store'

import CatIllustration from '/@/../assets/cat.svg'
import CafeIcon from '/@/../assets/cafe.svg'
import CardIcon from '/@/../assets/card.svg'
import TravelIcon from '/@/../assets/travel.svg'
import MedicineIcon from '/@/../assets/medicine.svg'
import SportIcon from '/@/../assets/sport.svg'
import ProductsIcon from '/@/../assets/products.svg'
import CarIcon from '/@/../assets/car.svg'
import ClothesIcon from '/@/../assets/clothes.svg'
import TaxiIcon from '/@/../assets/taxi.svg'
import AnimalsIcon from '/@/../assets/animals.svg'
import BooksIcon from '/@/../assets/books.svg'
import FlowersIcon from '/@/../assets/flowers.svg'

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
  keyword: string
}>()
const { id, keyword } = toRefs(props)
const store = useUserStore()
const statement = computed<Statement[]>(() => store.statements[id.value])
const getStatement = async() => {
  store.statements[id.value] = await window.ipc.invoke('statement', id.value)
}
const filteredAccountStatementByDate = computed<StatementByDate[]>(() => {
  return statement.value.filter(item =>
    item.description.toLowerCase().includes(keyword.value.toLowerCase()),
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
await getStatement()
</script>

<template>
  <div
    v-if="filteredAccountStatementByDate.length"
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
  <div v-else class="flex flex-col items-center mt-8">
    <CatIllustration class="w-32 h-32" />
    <span class="mt-1 text-sm text-center text-gray-500">{{
      keyword
        ? `За запитом "${keyword}" нічого не знайдено :(`
        : 'Не густо тут у Вас :)'
    }}</span>
  </div>
</template>
