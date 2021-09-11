<template>
  <div class="shadow-wrap">
    <div
      class="relative flex flex-col justify-between py-5 px-5 rounded-lg overflow-hidden h-160px w-280px"
      :class="account.type === 'white' ? 'bg-white' : 'bg-black'"
    >
      <div class="flex flex-col">
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <span
              class="text-xs text-blue-gray-400 uppercase font-semibold tracking-widest"
            >
              Баланс
            </span>
            <span
              class="text-xl font-bold"
              :class="account.type === 'white' ? 'text-black' : 'text-white'"
            >
              {{ account.currency.symbol }} {{ account.balance.toFixed(2) }}
            </span>
          </div>
          <VisaLogo v-if="account.type === 'white'" class="w-16" />
          <MastercardLogo v-else class="w-16" />
        </div>
        <span
          class="mt-1 text-xs text-blue-gray-400 font-semibold"
        >
          Кредитний ліміт: {{ account.currency.symbol }}
          {{ account.creditLimit.toFixed(2) }}
        </span>
      </div>
      <div class="flex justify-between space-x-1 text-sm">
        <div
          class="text-blue-gray-500 truncate cursor-pointer"
          :class="
            account.type === 'white'
              ? 'hover:text-blue-gray-800'
              : 'hover:text-blue-gray-200'
          "
        >
          {{ showIBAN ? account.iban : account.maskedPan[0] }}
        </div>
        <span class="text-blue-gray-500">{{ account.currency.code }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { clipboard } from 'electron'

import MastercardLogo from '/@/../assets/mastercard.svg'
import VisaLogo from '/@/../assets/visa.svg'

const props = defineProps<{
  account: any
}>()

const showIBAN = false

const { account } = toRefs(props)
// const copyIBAN = (value: string) => {
//   clipboard.writeText(value)
//   copied = true
// }
</script>
