<script setup lang="ts">
import getSymbolFromCurrency from 'currency-symbol-map'
import { useUserStore } from '../use/store'
import CatIllustration from '/@/../assets/cat.svg?component'
import Select from '../components/Select.vue'

const store = useUserStore()

const loading = ref(false)
const fromValue = ref(1)
const from = ref('UAH')
const to = ref('USD')
const reversed = ref(true)

const getCurrency = async() => {
  if (!store.currency.length) loading.value = true
  await store.getCurrency()
  loading.value = false
}

const currencyFormatted = computed(() => store.currency
  .filter(
    item =>
      item.currencyCodeB?.code === 'UAH',
  )
  .map(item => ({
    ...item,
    rateBuy: item.rateCross || item.rateBuy,
    rateSell: item.rateCross || item.rateSell,
  }))
  .map((item) => {
    return {
      ...item,
      code: item.currencyCodeA?.code,
      symbol: getSymbolFromCurrency(item.currencyCodeA?.code) || '$',
    }
  }))

const currentCurrency = computed(() => currencyFormatted.value.find(item => item.code === to.value) || { rateBuy: 1, rateSell: 1 })
const toValue = computed(() => {
  if (!currentCurrency.value) return 1
  return reversed.value
    ? fromValue.value * currentCurrency.value.rateBuy
    : fromValue.value / currentCurrency.value.rateSell
})
const toCurrency = computed(() => currencyFormatted.value
  .filter(item => item.code !== from.value)
  .map(item => ({
    value: item.code,
    label: item.code,
  })),
)

const swap = () => {
  fromValue.value = reversed.value
    ? currentCurrency?.value?.rateSell * fromValue.value
    : toValue.value
  reversed.value = !reversed.value
}

getCurrency()
</script>

<template>
  <div class="flex flex-col h-full">
    <transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="flex flex-grow justify-center items-center h-full"
      >
        <gg:spinner class="animate-spin -ml-1 mr-3 h-10 w-10" />
      </div>
      <div v-else class="flex flex-grow flex-col overflow-hidden">
        <div class="flex-shrink-0 mt-6 px-6">
          <span class="text-xl font-semibold">Курси валют</span>
          <div class="relative flex justify-between items-center mt-6 z-10">
            <div
              class="transform transition-transform duration-500 ease-in-out"
              :class="{ 'translate-x-46': reversed }"
            >
              <Button class="justify-start w-32">
                {{ from }}
              </Button>
            </div>
            <heroicons-solid-switch-horizontal
              class="h-6 w-6 text-blue-gray-400 hover:text-blue-gray-600 cursor-pointer transition-transform duration-500 ease-in-out transform"
              :class="{ 'rotate-180': reversed }"
              @click="swap"
            />
            <div
              class="transform transition-transform duration-500 ease-in-out"
              :class="{ '-translate-x-46': reversed }"
            >
              <Select v-model="to" :items="toCurrency" class="justify-start w-32" variant="primary">
                <span class="block truncate">{{ to }}</span>
                <span
                  class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                >
                  <heroicons-solid-selector class="w-5 h-5 text-white" aria-hidden="true" />
                </span>
              </Select>
            </div>
          </div>
          <div class="flex justify-between items-center mt-3">
            <Input
              v-model="fromValue"
              type="number"
              class="w-32"
            ></Input>
            <Input
              :model-value="toValue"
              type="number"
              class="w-32"
              disabled
            ></Input>
          </div>
        </div>
        <div class="flex flex-col flex-grow mt-6 overflow-hidden">
          <div class="flex flex-shrink-0 px-6 text-xs">
            <div class="w-2/3 py-2 text-left text-blue-gray-500">
              Валюта
            </div>
            <div class="w-1/4 py-2 text-left text-blue-gray-500">
              Купівля
            </div>
            <div class="w-1/4 py-2 text-left text-blue-gray-500">
              Продаж
            </div>
          </div>
          <div v-if="currencyFormatted.length" class="flex-grow relative h-full overflow-hidden">
            <perfect-scrollbar>
              <div class="px-6">
                <div
                  v-for="(item, index) in currencyFormatted"
                  :key="index"
                  class="flex flex-grow border-b border-gray-200 last:border-b-0"
                >
                  <div class="w-2/3 py-3 text-base">
                    <span class="font-semibold mr-2">{{ item.symbol }}</span>
                    <span>{{ item.code }}</span>
                  </div>
                  <div class="w-1/4 py-3 text-base tracking-wide">
                    {{ item.rateBuy ? item.rateBuy.toFixed(2) : 0 }}
                  </div>
                  <div class="w-1/4 py-3 text-base tracking-wide">
                    {{ item.rateSell ? item.rateSell.toFixed(2) : 0 }}
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
          <div v-else class="flex flex-grow flex-col items-center mt-8 h-full">
            <CatIllustration class="w-32 h-32" />
            <span class="mt-1 text-sm text-center text-gray-500">Щось пішло не так :(</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
