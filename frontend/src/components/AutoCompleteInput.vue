<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['update:input', 'clearInput', 'isActive'])
const props = defineProps({
  id: String,
  input: String,
  placeholder: String
})

const { id, input, placeholder } = toRefs(props)
const inputComputed = computed({
  get: () => input?.value,
  set: (val) => emit('update:input', val)
})
</script>

<template>
  <div class="flex items-center">
    <input :id="id" v-model="inputComputed" @click="emit('isActive', true)" type="text" class="bg-gray-100 appearance-none w-full py-2.5 px-3 leading-tight focus:outline-none focus:shadow-md focus:bg-gray-200" :placeholder="placeholder" autocomplete="off">
    <Icon icon="mdi:window-close" color="#2e2e2d" width="28" @click="emit('clearInput')" />
  </div>
</template>