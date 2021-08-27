<script setup lang="ts">
import mccCodes from '../mcc.json'

const props = defineProps<{
  item: any
}>()

const { item } = toRefs(props)

const amount = computed(() => (item.value.amount / 100).toFixed(2))
const cashback = computed(() => (item.value.cashbackAmount / 100).toFixed(2))
const mcc = computed(() => item.value.comment
  ? {
    title: item.value.comment,
    name: 'card',
    color: 'indigo',
  }
  : getMCCFromCode(item.value.mcc) || {
    title: item.value.amount > 0 ? 'Поповнення картки' : 'Переказ на картку',
    name: 'card',
    color: 'indigo',
  },
)

function getMCCFromCode(code: number) {
  return mccCodes.find(item =>
    item.items
      .map(item => item.split('-').map(item => +item))
      .some(([from, to]) => (to ? code >= from && code <= to : code === from)),
  )
}
</script>
<template>
  <li
    class="flex justify-between py-2 border-b border-blue-gray-200 last:border-b-0"
  >
    <div class="flex items-center overflow-hidden mr-1">
      <slot name="icon" :mcc="mcc" />
      <div class="flex flex-col overflow-hidden pr-2">
        <div class="text-sm text-blue-gray-900 w-full truncate">
          {{ item.description }}
        </div>
        <span class="flex items-center text-xs text-blue-gray-600 rounded">
          {{ mcc.title }}
        </span>
      </div>
    </div>
    <div class="flex flex-col justify-center text-right">
      <span class="text-base font-semibold">
        {{ amount }}
      </span>
      <span
        v-if="item.cashbackAmount"
        class="flex justify-end items-center text-sm text-green-400 font-semibold"
      >
        <heroicons-solid-gift class="h-4 w-4 mr-1" /> {{ cashback }}
      </span>
    </div>
  </li>
</template>
