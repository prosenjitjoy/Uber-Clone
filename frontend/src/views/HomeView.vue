<script setup lang="ts">
import ServiceSelectSmall from "@/components/ServiceSelectSmall.vue";
import ServiceSelectLarge from "../components/ServiceSelectLarge.vue"
import { useRouter } from "vue-router";
import { useDirectionStore } from "@/stores";
import { Icon } from '@iconify/vue';
import { onMounted } from "vue";

const router = useRouter()
const direction = useDirectionStore()

onMounted(() => {
  direction.origin = ""
  direction.destination = ""
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="m-3 mb-auto">
      <div>
        <Icon icon="simple-icons:uber" width="150" />
      </div>

      <div @click="router.push('/directions')" class="grid grid-cols-2 gap-3 my-3">
        <ServiceSelectLarge text="Ride" imageWidth="74" image="ride" />
        <ServiceSelectLarge text="Food" imageWidth="74" image="food" :promo="true" />
      </div>

      <div class="grid grid-cols-4 gap-3 my-3">
        <ServiceSelectSmall text="2 Wheels" image="2wheels" />
        <ServiceSelectSmall text="Transit" image="transit" />
        <ServiceSelectSmall text="Reserve" image="reserve" />
        <ServiceSelectSmall text="Travel" image="travel" />
      </div>

      <div @click="router.push('/directions')" class="w-full bg-gray-200 h-14 rounded-full flex items-center p-3">
        <Icon icon="mdi:magnify" width="40" />
        <div class="ml-3 text-xs font-semibold text-gray-700">Enter pick-up point</div>
      </div>
    </div>

    <footer class="w-full z-50 flex justify-around p-1 mb-2 border-t-2 border-t-gray-200">
      <div class="grid place-items-center">
        <Icon icon="mdi:home" color="#1f1e1e" width="30" />
        <div class="w-full -mt-1 text-xs text-center text-gray-800 font-semibold">
          Home
        </div>
      </div>
      <div @click="router.push('/directions')" class="grid place-items-center">
        <Icon icon="mdi:map-marker" color="#b3b1b1" width="30" />
        <div class="w-full -mt-1 text-xs text-center text-gray-800 font-semibold">
          Destination
        </div>
      </div>
    </footer>
  </div>
</template>

