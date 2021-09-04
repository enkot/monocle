<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'

interface Items {
  value: string | number
  label: string
}

const props = defineProps<{
  modelValue: string | number
  items: Items[]
  variant?: 'primary' | 'secondary'
}>()
const emit = defineEmits<(e: 'update:modelValue', value: string | number) => void>()

const { variant } = toRefs(props)
</script>

<template>
  <Listbox :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <div class="relative mt-1">
      <ListboxButton as="template">
        <Button :variant="variant || 'secondary'" class="w-full">
          <slot />
        </Button>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="flex flex-col absolute w-full py-1 mt-1 text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <perfect-scrollbar>
            <ListboxOption
              v-for="item in items"
              v-slot="{ active, selected }"
              :key="item.value"
              :value="item.value"
              as="template"
            >
              <li
                :class="[
                  active ? 'text-purple-900 bg-purple-100' : 'text-gray-900',
                  'cursor-default select-none relative py-2 pl-10 pr-4',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-medium' : 'font-normal',
                    'block truncate',
                  ]"
                >{{ item.label }}</span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600"
                >
                  <heroicons-solid-check class="w-5 h-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </perfect-scrollbar>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
