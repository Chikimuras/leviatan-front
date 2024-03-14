<script setup lang="ts">
  import { onMounted, ref} from "vue";
  import { useRoute } from "vue-router";
  import fetchApi from "../api/fetchApi";
  import router from "@/router";
  import { authService } from "@/services/authService";

  const route = useRoute();
  const post = ref({
    id: null,
    title: "",
    content: "",
    created_at: "",
    user: {
      id: "",
      name: ""
    },
  });
  const error = ref("");
  const isLogged = authService.isAuthenticated();

  const deletePost = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce post?")) {
      return;
    }
    const postId = route.params.postId;
    try {
      await fetchApi(`post/${postId}`, { method: "DELETE" });
      // Redirect to the post list
      await router.push({ name: "PostList" });
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Une erreur inconnue s'est produite.";
      }
    }
  };

  onMounted(async () => {
    const postId = route.params.postId;
    try{
      const response = await fetchApi(`post/${postId}`);
      post.value = response.data;
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = "Une erreur inconnue s'est produite.";
      }
    }
  });

</script>
<template>
  <div>
    <div class="px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <h1 class="font-bold text-4xl text-blue-900">{{ post.title }}</h1>
        <p class="text-gray-500 text-sm">Publié le : {{ post.created_at }} par {{ post.user.name }}</p>
      </div>
      <div class="mb-4">
        <p class="text-gray-700 text-base">{{ post.content }}</p>
      </div>
      <div>
        <div class="flex justify-end gap-4">
          <router-link :to="{name: 'PostList'}" class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Retour</router-link>
          <router-link v-if="isLogged" :to="{name: 'PostEdit', params: {postId: post.id}}" class="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Modifier</router-link>
          <button v-if="isLogged" @click="deletePost" class="bg-red-900 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>