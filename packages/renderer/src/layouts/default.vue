<template>
  <transition name="fade" mode="out-in">
    <div
      v-if="loading"
      class="flex justify-center items-center h-screen bg-white"
    >
      <gg:spinner class="animate-spin -ml-1 mr-3 h-10 w-10" />
    </div>
    <div v-else class="font-sans flex flex-col h-screen bg-white">
      <router-view class="flex-grow overflow-hidden" />
      <div
        v-if="$route.name !== 'Authorize'"
        class="flex flex-shrink-0 justify-around border-t border-gray-200 text-xs"
      >
        <router-link
          v-slot="{ isActive, navigate}"
          to="/"
          custom
        >
          <div class="flex flex-1 flex-col items-center p-2 text-gray-400 hover:text-gray-900 cursor-pointer" :class="{ 'text-gray-900': isActive }" @click="navigate">
            <heroicons-solid-credit-card class="h-6 w-6" />
            <span>Виписка</span>
          </div>
        </router-link>
        <router-link
          v-slot="{ isActive, navigate}"
          to="stocks"
          custom
        >
          <div class="flex flex-1 flex-col items-center p-2 text-gray-400 hover:text-gray-900 cursor-pointer" :class="{ 'text-gray-900': isActive }" @click="navigate">
            <heroicons-solid-switch-vertical class="h-6 w-6" />
            <span>Курси валют</span>
          </div>
        </router-link>
        <a
          href="#"
          class="flex flex-1 flex-col items-center p-2 text-gray-400 hover:text-gray-900 cursor-pointer"
          @click="logout"
        >
          <heroicons-solid-logout class="h-6 w-6" />
          <span>Вихід</span>
        </a>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const loading: boolean = $ref(false)
const logout = () => {}
</script>
