<script setup lang="ts">
import {onMounted, ref} from "vue";
import fetchApi from "../api/fetchApi";
import { authService } from "@/services/authService";
interface Post {
  userId: number
  id: number
  title: string
  content: string
  user: {
    id: number
    name: string
  }
  categories: {
    data: {
      id: number
      name: string
    }[]
  }
  created_at: string
}

const posts = ref<Post[]>([]);
const error = ref<string | null>(null);
const isLogged = authService.isAuthenticated();

const fetchPosts = async () => {
  try {
    const response = await fetchApi('post');
    posts.value = response.data;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = 'An unknown error occurred.';
    }
  }
};

const downloadPosts = () => {
  const url = 'http://leviatan.test/api/export-posts';
  window.open(url, '_blank');
}



onMounted(fetchPosts);
</script>

<template>
  <main>
    <div class="flex justify-between mb-6">
      <h1 class="text-3xl text-blue-900">Billet de blog</h1>
      <div v-if="isLogged" class="flex gap-4">
        <button @click="downloadPosts" class="bg-blue-900 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded">
          Télécharger tous les Posts (xls)
        </button>
        <router-link :to="{ name: 'PostCreate' }" class="bg-blue-900 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded">
          Créer un Post
        </router-link>
      </div>
    </div>
    <ul class="grid grid-cols-3 gap-6">
      <li v-for="post in posts" :key="post.id" class="col-span-1 border p-6 flex flex-col justify-between">
        <div class="article-head flex justify-end gap-2 mb-4">
          <span v-for="category in post.categories.data" :key="category.id" class="flex items-center bg-blue-200 text-blue-900 rounded px-2 py-1 text-xxs thin block overflow-hidden flex-1">{{ category.name }}</span>
        </div>
        <div class="article-content mb-4">
          <h2 class="text-xl font-bold text-blue-900 hover:underline mb-4">
            <router-link :to="{ name: 'PostDetail', params: {postId: post.id} }">{{ post.title }}</router-link>
          </h2>
          <p v-if="post.content.length > 100">{{ post.content.substring(0,100) }}...</p>
          <p v-else>{{ post.content }}</p>
        </div>
        <div class="article-meta flex flex-col gap-4 justify-between">
          <div>
            <p>Auteur : {{ post.user.name }}</p>
            <p>Publié le : {{ post.created_at }}</p>
          </div>
          <div>
            <router-link class="bg-blue-900 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded" :to="{ name: 'PostDetail', params: {postId: post.id} }">Lire</router-link>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="error">{{ error }}</p>
  </main>
</template>

<style scoped>

</style>