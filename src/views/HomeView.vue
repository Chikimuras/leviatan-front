<script setup lang="ts">
  import { authService } from '@/services/authService';
  import { ref } from 'vue';

  const isLoggedIn = ref(false);

  isLoggedIn.value = authService.isAuthenticated();
</script>

<template>
  <div class="flex justify-center items-center flex-col">
      <h1 class="text-6xl text-blue-900 mb-20">Bienvenue sur le wiki de Leviatian</h1>
      <p class="text-center w-[60%]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet aut commodi consectetur corporis cum cumque dignissimos eligendi esse est fugiat illo laboriosam minima optio, repellendus tempora tempore ut! Laborum, quia.</p>
      <div class="flex gap-4">
        <router-link :to="{ name: 'PostList' }" class="bg-blue-900 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded mt-10">
          Voir les posts
        </router-link>
        <router-link v-if="isLoggedIn" :to="{ name: 'PostCreate' }" class="bg-blue-900 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded mt-10">
          Créer un post
        </router-link>
      </div>
  </div>
</template>
