<script setup lang="ts">
import dayjs from 'dayjs'
import SwiperCore, {
  EffectCoverflow,
  Pagination,
} from 'swiper/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import getSymbolFromCurrency from 'currency-symbol-map'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/uk'

import 'swiper/swiper-bundle.min.css'
import Check from '../components/Check.vue'
import { useUserStore } from '../use/store'
import Input from '../components/Input.vue'
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

SwiperCore.use([EffectCoverflow, Pagination])
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
const store = useUserStore()
const loading = ref(false)
const currentIndex = ref(0)
const keyword = ref('')
const accounts = computed<Account[]>(() => (store.userInfo?.accounts || [])
  .sort((a: Account, b: Account) => b.balance - a.balance)
  .map((account: Account) => {
    const { code } = account.currencyCode

    return {
      ...account,
      balance: (account.balance - account.creditLimit) / 100,
      creditLimit: account.creditLimit / 100,
      currency: {
        code,
        symbol: getSymbolFromCurrency(code),
      },
    }
  }))
const currentAccount = computed(() => accounts.value[currentIndex.value])
const statement = computed<Statement[]>(() => store.statements[currentAccount.value?.id])
const onSwiper = (swiper: any) => { }
const getStatement = async() => {
  const { id } = currentAccount.value
  const hasLoaded = !!store.statements[id]
  if (!hasLoaded) loading.value = true
  store.statements[id] = await window.ipc.invoke('statement', id)
  loading.value = false
}
const onSlideChange = (swiper: any) => {
  if (swiper.activeIndex === currentIndex.value) return
  currentIndex.value = swiper.activeIndex
  getStatement()
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
getStatement()
</script>

<template>
  <div class="flex flex-col h-full">
    <div
      class="flex justify-center items-center flex-shrink-0 h-210px bg-gradient-to-tr from-indigo-200 to-pink-100"
    >
      <swiper
        ref="swiper"
        slides-per-view="auto"
        :effect="'coverflow'"
        :space-between="0"
        :grab-cursor="true"
        :centered-slides="true"
        :coverflow-effect="{
          rotate: 46,
          stretch: 0,
          depth: 150,
          modifier: 1,
          slideShadows: false
        }"
        :pagination="{
          clickable: true
        }"
        class="h-full w-full"
        @swiper="onSwiper"
        @transitionEnd="onSlideChange"
      >
        <swiper-slide
          v-for="account in accounts"
          :key="account.id"
          class="flex justify-center items-center w-290px h-200px"
        >
          <Check v-if="account.type === 'fop'" :user="store.userInfo" :account="account" />
          <Card v-else :account="account" />
        </swiper-slide>
      </swiper>
    </div>
    <div class="px-6 pt-4 pb-2">
      <Input v-model="keyword" placeholder="Пошук по виписці">
        <bx-bx-search class="h-5 w-5 text-blue-gray-400" />
      </Input>
    </div>
    <div class="flex flex-col flex-grow w-full h-full overflow-hidden">
      <transition name="fade" mode="out-in">
        <div
          v-if="loading"
          class="flex flex-grow justify-center items-center h-full"
        >
          <gg:spinner class="animate-spin -ml-1 mr-3 h-10 w-10" />
        </div>
        <div
          v-else-if="filteredAccountStatementByDate.length"
          :key="currentAccount?.id"
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
      </transition>
    </div>
  </div>
</template>

<style lang="postcss">
.swiper-pagination {
  @apply -mb-1.3;
}
.swiper-pagination-bullet {
  @apply mx-0.5 !important;
}
.swiper-pagination-bullet-active {
  @apply bg-black opacity-50;
}
</style>
