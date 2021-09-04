<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import SwiperCore, {
  EffectCoverflow,
  Pagination,
} from 'swiper/core'
import { Swiper, SwiperSlide } from 'swiper/vue'

import 'swiper/swiper-bundle.min.css'
import { useUserStore } from '../use/store'

SwiperCore.use([EffectCoverflow, Pagination])

const route = useRoute()
const router = useRouter()
const store = useUserStore()
const keyword = ref('')
const onSlideChange = (swiper: any) => {
  router.push(`/${store.accounts[swiper.activeIndex]?.id}`)
}
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
        @transitionEnd="onSlideChange"
      >
        <swiper-slide
          v-for="account in store.accounts"
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
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" :keyword="keyword" />
        </transition>
      </router-view>
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
