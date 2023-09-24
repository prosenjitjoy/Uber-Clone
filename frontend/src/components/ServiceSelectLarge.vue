<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps({
  text: String,
  imageWidth: String,
  image: String,
  promo: { Boolean, default: false }
})

const { text, imageWidth, image, promo } = toRefs(props)
</script>

<template>
  <div id="ServiceSelectLarge">
    <div class="w-full rounded-2xl bg-gray-200 h-24">
      <div v-if="promo" class="w-full relative z-10">
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-700 py-1 px-2.5 text-gray-100 rounded-3xl text-sm">Promo</span>
      </div>
      <div class="flex justify-between p-2">
        <div class="text-lg ml-2 text-gray-900 mt-14">
          {{ text }}
        </div>
        <div class="mt-3 mr-1">
          <img :src="'/img/' + image + '.png'" alt="uberX" :width="imageWidth" class="w-16">
        </div>
      </div>
    </div>
  </div>
</template> 