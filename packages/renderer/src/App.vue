<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from './use/store'

const router = useRouter()
const store = useUserStore()
const loading = ref(true)

;(async() => {
  if (await store.checkAccess()) {
    await store.getUserInfo()
    router.push(`/${store.accounts[0]?.id}`)
  }
  else { router.push('/authorize') }

  loading.value = false
})()
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <div
        v-if="loading"
        class="flex justify-center items-center h-screen bg-white"
      >
        <gg:spinner class="animate-spin -ml-1 mr-3 h-10 w-10" />
      </div>
      <div v-else class="font-sans flex flex-col h-screen bg-white">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>
