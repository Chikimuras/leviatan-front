<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';

const isLoggedIn = ref(false);
const router = useRouter();

const logout = () => {
  isLoggedIn.value = false;
  authService.logout();
};

isLoggedIn.value = authService.isAuthenticated();
</script>

<template>
  <nav class="bg-blue-900 text-white py-4 mb-12">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/" class="text-2xl font-bold">Leviatan Wiki</router-link>
        <router-link :to="{ name: 'PostList' }" class="ml-4">Posts</router-link>
      </div>
      <div>
        <router-link v-if="!isLoggedIn" to="/login" class="py-2 px-4 hover:bg-blue-700 rounded">Connexion</router-link>
        <button v-else @click="logout" class="py-2 px-4 hover:bg-blue-700 rounded">Déconnexion</button>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>