<script setup lang="ts">

</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="slide" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style scoped>
.slide-leave-active {
  transition: transform 0.175s ease-out
}

.slide-leave-to {
  transform: translate(-100%, 0);
}
</style>