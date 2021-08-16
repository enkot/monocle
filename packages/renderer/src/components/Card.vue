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
              class="text-xs text-gray-400 uppercase font-semibold tracking-widest"
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
          class="mt-1 text-xs text-gray-400 uppercase font-semibold tracking-widest"
        >
          Кредитний ліміт: {{ account.currency.symbol }}
          {{ account.creditLimit.toFixed(2) }}
        </span>
      </div>
      <div class="flex justify-between space-x-1 text-sm">
        <div
          class="text-gray-500 truncate cursor-pointer"
          :class="
            account.type === 'white'
              ? 'hover:text-gray-800'
              : 'hover:text-gray-200'
          "
          @mouseenter="showIBAN = true"
          @mouseleave="showIBAN = false"
        >
          {{ showIBAN ? account.iban : account.maskedPan[0] }}
        </div>
        <span class="text-gray-500">{{ account.currency.code }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { clipboard } from 'electron'

import MastercardLogo from '/@/../assets/mastercard.svg'
import VisaLogo from '/@/../assets/visa.svg'

const props = defineProps<{
  account: any
}>()

const showIBAN = $ref(false)

// const copyIBAN = (value: string) => {
//   clipboard.writeText(value)
//   copied = true
// }

const { account } = $fromRefs(props)
</script>
