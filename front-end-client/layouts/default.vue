<template>
  <div>
    <Theheader></Theheader>
    <erisLoadingVue id="default" v-model="isLoading"></erisLoadingVue>
    <NuxtPage />
    <Thefooter></Thefooter>
  </div>
</template>

<script setup lang="ts">
import erisLoadingVue from "~/components/eris-loading.vue";
const isLoading = ref();
</script>

<style scoped></style>
