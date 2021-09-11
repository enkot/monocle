<script setup lang="ts">
import { useRouter } from 'vue-router'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { useUserStore } from '../use/store'

import Logo from '/@/../assets/logo.svg?component'

const router = useRouter()
const store = useUserStore()
const acceptUrl = ref<string | undefined>(undefined)
const loading = ref<boolean>(true)

;(async() => {
  acceptUrl.value = await window.ipc.invoke('getAccess')
  loading.value = false

  const timer = setInterval(async() => {
    if (await store.checkAccess()) {
      clearInterval(timer)
      await store.getUserInfo()
      router.push('/')
    }
  }, 2000)
})()
</script>

<template>
  <div class="flex flex-col justify-center items-center p-16 space-y-6">
    <Logo class="w-160px" />
    <div v-if="loading" class="h-210px w-210px bg-gray-200 animate-pulse"></div>
    <vue-qrcode
      v-else-if="acceptUrl"
      :value="acceptUrl"
      :options="{ width: 210, margin: 0 }"
      tag="svg"
    ></vue-qrcode>
    <p class="text-blue-gray-400 text-sm">
      Відскануйте QR код для входу
    </p>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>
