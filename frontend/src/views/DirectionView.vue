<script setup lang="ts">
import AutoCompleteInput from '@/components/AutoCompleteInput.vue';
import { Icon } from '@iconify/vue';
import { onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash'
import { useDirectionStore } from '@/stores';
import { useRouter } from 'vue-router';

const isPickerActive = ref(true)
const pickup = ref("")
const destination = ref("")
const addressData = ref<any>()
const direction = useDirectionStore()
const router = useRouter()

onMounted(() => {
  document.getElementById("firstInput")?.focus()
})

const clearInputFunc = (inputId: string) => {
  if (inputId === 'firstInput') {
    pickup.value = ''
    direction.origin = ''
  }

  if (inputId === 'secondInput') {
    destination.value = ''
    direction.destination = ''
  }
}

const storeAddress = async (address: string) => {
  if (isPickerActive.value) {
    pickup.value = address
    addressData.value = ""
  } else {
    destination.value = address
  }

  if (pickup.value.length > 0 && destination.value.length > 0) {
    direction.origin = await getPosition(pickup.value)
    direction.destination = await getPosition(destination.value)
    router.push("/map")
  }
}

const findAddress = debounce(async (address) => {
  if (address === null || address === "null" || address === "") {
    addressData.value = ""
    return ""
  }
  const baseURL = import.meta.env.VITE_APP_API_URL
  console.log(baseURL)
  try {
    const res = await fetch(`${baseURL}discover/${address}`, { mode: 'cors' })
    const data = await res.json()
    console.log(data)
    addressData.value = data.items
  } catch (e) {
    console.log(e)
  }
}, 400)

watch(pickup, async (pickup) => await findAddress(pickup))
watch(destination, async (destination) => await findAddress(destination))

const getPosition = async (address: any) => {
  const baseURL = import.meta.env.VITE_APP_API_URL
  console.log(baseURL)
  try {
    const res = await fetch(`${baseURL}discover/${address}`, { mode: 'cors' })
    const data = await res.json()
    return `${data.items[0].position.lat},${data.items[0].position.lng}`
  } catch (e) {
    console.log(e)
    return ""
  }
}
</script>

<template>
  <div>
    <div class="grid grid-cols-12 mt-4 shadow-md">
      <div class="col-span-2 mx-auto">
        <div @click="router.push('/')">
          <Icon icon="mdi:arrow-left" width="35" />
        </div>
        <div class="h-16 mt-4 w-full">
          <div :class="[isPickerActive ? 'circle-black' : 'circle-gray']"></div>
          <div class="line"></div>
          <div :class="[!isPickerActive ? 'square-black' : 'square-gray']"></div>
        </div>

      </div>
      <div class="col-span-10 pr-4">
        <div class="w-full h-5">

        </div>
        <div class="mb-2 mt-5">
          <AutoCompleteInput id="firstInput" v-model:input="pickup" placeholder="Enter pick-up location" @isActive="isPickerActive = true" @clearInput="clearInputFunc('firstInput')" />
        </div>
        <div class="mb-3">
          <AutoCompleteInput id="secondInput" v-model:input="destination" placeholder="Where to?" @isActive="isPickerActive = false" @clearInput="clearInputFunc('secondInput')" />
        </div>
      </div>
    </div>

    <div v-for="(address, index) in addressData" :key="index">
      <div @click="storeAddress(address.title)" class="flex items-center border-b border-solid border-b-gray-200">
        <div class="bg-gray-400 mx-5 my-3.5 p-1.5 rounded-full">
          <Icon icon="mdi:map-marker" color="whitesmoke" width="30" />
        </div>
        <div>
          <div class="text-lg text-gray-600">{{ address.title }}</div>
          <div class="text-lg text-gray-400">{{ address.address.countryName }}</div>
        </div>
      </div>
    </div>


  </div>
</template>

