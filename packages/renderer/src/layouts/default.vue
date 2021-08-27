<template>
  <router-view class="flex-grow overflow-hidden" />
  <div
    class="flex flex-shrink-0 justify-around border-t border-blue-gray-200 text-xs"
  >
    <router-link
      v-slot="{ isActive, navigate}"
      to="/"
      custom
    >
      <div class="flex flex-1 flex-col items-center p-2 text-blue-gray-400 hover:text-blue-gray-900 cursor-pointer" :class="{ 'text-blue-gray-900': isActive }" @click="navigate">
        <heroicons-solid-credit-card class="h-6 w-6" />
        <span>Виписка</span>
      </div>
    </router-link>
    <router-link
      v-slot="{ isActive, navigate}"
      to="stocks"
      custom
    >
      <div class="flex flex-1 flex-col items-center p-2 text-blue-gray-400 hover:text-blue-gray-900 cursor-pointer" :class="{ 'text-blue-gray-900': isActive }" @click="navigate">
        <heroicons-solid-switch-vertical class="h-6 w-6" />
        <span>Курси валют</span>
      </div>
    </router-link>
    <a
      href="#"
      class="flex flex-1 flex-col items-center p-2 text-blue-gray-400 hover:text-blue-gray-900 cursor-pointer"
      @click="logout"
    >
      <heroicons-solid-logout class="h-6 w-6" />
      <span>Вихід</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = async() => {
  await window.ipc.invoke('logout')
  router.push('authorize')
}
</script>
