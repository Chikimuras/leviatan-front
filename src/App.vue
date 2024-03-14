<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
</script>

<template>
  <header>
    <div>
      <Navbar />
    </div>
  </header>
  <div class="container mx-auto pb-12">
    <RouterView />
  </div>

</template>

<style scoped>
</style>
