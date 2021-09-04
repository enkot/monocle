<script setup lang="ts">
const props = defineProps<{
  href?: string
  variant?: 'primary' | 'secondary'
}>()

const { href, variant } = toRefs(props)
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :target="href ? 'blank' : undefined"
    :class="['btn', variant || 'secondary']"
    type="button"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<style lang="postcss" scoped>
.primary {
  @apply bg-purple-600 border-transparent text-white hover:bg-purple-500 focus:(outline-none border-purple-700 ring ring-purple-200) active:bg-purple-700;
}
.secondary {
  @apply bg-white border-gray-300 text-gray-900 hover:text-gray-700 focus:(outline-none border-purple-300 ring ring-purple-200);
}
</style>
