<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
}>()
const emit = defineEmits<(e: 'update:modelValue', value: string) => void>()
const { modelValue, type } = toRefs(props)
const focused = ref(false)
const formatedValue = ref('')
const stripValue = (value: any) => +parseFloat(String(value).replace(/[^0-9.]/g, ''))
const formatValue = (value: any): string => {
  if (type?.value === 'number') {
    const stripedValue = stripValue(value)
    return value ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(stripedValue) : ''
  }
  return value
}
const onInput = (payload: Event) => {
  const { value } = payload.target as HTMLInputElement
  formatedValue.value = formatValue(value)
  emit('update:modelValue', type?.value === 'number' ? String(stripValue(value)) : value)
}
watch(modelValue, value => formatedValue.value = formatValue(value))
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <slot />
    </div>
    <input
      :value="focused ? modelValue : formatedValue"
      :placeholder="placeholder"
      type="text"
      class="px-3 appearance-none block w-full py-2 bg-gray-100 border border-blue-gray-200 rounded-md transition duration-150 ease-in-out text-base placeholder-blue-gray-400 focus:(bg-white border-purple-400 ring ring-purple-200)"
      :class="{ 'pl-10': $slots.default }"
      :disabled="disabled"
      @input="onInput"
      @focus="focused = true"
      @blur="focused = false"
    />
  </div>
</template>
