import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDirectionStore = defineStore('direction', () => {
  const origin = ref("")
  const destination = ref("")

  return { origin, destination }
}, {
  persist: {
    storage: sessionStorage
  },
})
