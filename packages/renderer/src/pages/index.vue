<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-center items-center flex-shrink-0 h-210px bg-gradient-to-tr from-indigo-200 to-pink-100">
      <swiper
        slides-per-view="auto"
        :effect="'coverflow'"
        :space-between="0"
        :grab-cursor="true"
        :centered-slides="true"
        :coverflow-effect="{
          &quot;rotate&quot;: 46,
          &quot;stretch&quot;: 0,
          &quot;depth&quot;: 150,
          &quot;modifier&quot;: 1,
          &quot;slideShadows&quot;: false
        }"
        :pagination="{
          clickable: true
        }"
        class="h-full w-full"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide class="flex justify-center items-center w-290px h-200px">
          <Card :account="account1" />
        </swiper-slide>
        <swiper-slide class="flex justify-center items-center w-290px h-200px">
          <Card :account="account2" />
        </swiper-slide>
        <swiper-slide class="flex justify-center items-center w-290px h-200px">
          <Card :account="account1" />
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SwiperCore, {
  EffectCoverflow,
  Pagination,
} from 'swiper/core'

import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.min.css'

SwiperCore.use([EffectCoverflow, Pagination])

const onSwiper = (swiper: any) => {}
const onSlideChange = () => {}
const account1 = {
  type: 'black',
  currency: {},
  creditLimit: 0,
  balance: 0,
  iban: 'IBAN 3434343409009090909090',
  maskedPan: ['537541******8831'],
}
const account2 = {
  type: 'white',
  currency: {},
  creditLimit: 0,
  balance: 0,
  iban: 'IBAN 3434343409009090909090',
  maskedPan: ['537541******8831'],
}
</script>

<style lang="postcss">
.swiper-pagination {
  @apply -mb-1;
}
.swiper-pagination-bullet {
  @apply mx-0.5 !important;
}
.swiper-pagination-bullet-active {
  @apply bg-black opacity-50;
}
</style>
