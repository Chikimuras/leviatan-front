<script setup lang="ts">
  import { ref } from "vue";
  import fetchApi from "../../api/fetchApi";
  import router from "@/router";
  import { authService } from "@/services/authService";

  const email = ref("");
  const password = ref("");
  const errorMessages = ref("");

  async function login() {
    errorMessages.value = "";
    try{
      const data = await fetchApi("login", {
        method: "POST",
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
      authService.login(data);
      await router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message)
        errorMessages.value = err.message;
      } else {
        errorMessages.value = "An unknown error occurred.";
      }
    }
  }
</script>

<template>
  <div class="flex justify-center items-center min-h-screen">
    <form @submit.prevent="login" class="w-full max-w-xs">
      <div class="mb-4">
        <label for="email" class="block text-sm font-bold mb-2 text-gray-700">Email:</label>
        <input v-model="email" type="text" id="email" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="mb-6">
        <label for="password" class="block text-sm font-bold mb-2 text-gray-700">Mot de passe:</label>
        <input v-model="password" type="password" id="password" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
      </div>
      <div class="flex items-center justify-between">
        <button type="submit" class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Connexion</button>
        <div v-if="errorMessages" class="text-red-500 text-xs italic">{{ errorMessages }}</div>
      </div>
    </form>
  </div>
</template>

