<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import VueQrcode from '@chenfengyuan/vue-qrcode'

import Logo from '/@/../assets/logo.svg'

interface AccessData {
  _tokenRequestId: string
  _acceptUrl: string
}

const { execute: getAccess, data: getAccessData } = useFetch<AccessData>('/api/getaccess', { immediate: false }).get().json()
const { execute: checkAccess, data: checkAccessData } = useFetch('/api/checkaccess', {
  immediate: false,
  async beforeFetch({ options, cancel }: { options: any; cancel: () => void }) {
    const token = getAccessData.value?._tokenRequestId

    if (!token) cancel()

    return {
      options: {
        headers: {
          'x-token': token,
        },
      },
    }
  },
  afterFetch(ctx) {
    if (!ctx.data?.isGranted) setTimeout(() => checkAccessData.value = undefined, 2000)

    return ctx
  },
}).get().json()
</script>

<template>
  <div class="flex flex-col justify-center items-center py-24 px-10">
    <Logo />
    <button
      class="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      @click="() => getAccess()"
    >
      Get Access
    </button>
    <div v-if="getAccessData" class="flex flex-col justify-center items-center">
      <div class="mt-6 flex rounded-md shadow-sm">
        <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-blue-gray-300 bg-blue-gray-50 text-blue-gray-500 sm:text-sm">
          Token
        </span>
        <input :value="getAccessData._tokenRequestId" type="text" name="company-website" class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-blue-gray-300" placeholder="www.example.com" />
      </div>
      <vue-qrcode :value="getAccessData._acceptUrl" :options="{ width: 260 }" tag="svg"></vue-qrcode>
      <button
        class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md text-blue-gray-700 bg-blue-gray-100 hover:bg-blue-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        :class="checkAccessData && (checkAccessData?.isGranted ? 'text-green-700 bg-green-100 focus:ring-green-500' : 'text-red-700 bg-red-100 focus:ring-red-500')"
        @click="() => checkAccess()"
      >
        <span>{{ checkAccessData ? (checkAccessData?.isGranted ? 'Access Granted' : 'No Access') : 'Check Access' }}</span>
      </button>
    </div>
  </div>
</template>
