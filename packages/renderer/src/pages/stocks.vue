<template>
  <p class="text-green-500 text-lg font-bold">
    Stocks page1: {{ result }}
  </p>
</template>

<script lang="ts" setup>
let result: string = $ref('')
window.ipc.invoke('some-name', 'testme').then((res: string) => result = res)
</script>
