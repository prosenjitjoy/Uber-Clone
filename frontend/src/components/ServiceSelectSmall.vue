<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
  text: String,
  image: String,
})

const { text, image } = toRefs(props)
</script>

<template>
  <div id="ServiceSelectSmall">
    <div class="w-full rounded-2xl bg-gray-200 h-24 relative">
      <div class="absolute top-1/3 left-1/3 -translate-x-1/4 -translate-y-1/4 bg-green-700 mt-0.5">
        <img :src="'img/' + image + '.png'" alt="uberX" width="55" class="w-16">
      </div>
    </div>
    <div class="text-xs text-center mt-2 text-gray-900">
      {{ text }}
    </div>
  </div>
</template> 