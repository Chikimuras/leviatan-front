<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import fetchApi from '@/api/fetchApi'
  import { authService } from '@/services/authService'
  import { useRouter } from 'vue-router'

  const post = ref({
    title: '',
    content: '',
    user_id: authService.getUserData().id,
  })

  const router = useRouter()

  const categories = ref([])
  const selectedCategories = ref([])
  const newCategory = ref('')

  const errorMessages = ref({
    title: '',
    content: '',
    category: '',
    general: '',
  })

  const contentLength = computed(() => post.value.content.length);

  const fetchCategories = async () => {
    const response = await fetchApi('category')
    categories.value = response.data
  }

  const submitPost = async () => {
    //Reset error messages
    errorMessages.value = {
      title: '',
      content: '',
      category: '',
      general: '',
    }
    //Create a boolean to check if can submit
    let canSubmit = true;
    //Validate if title is empty
    if (!post.value.title.trim()) {
      errorMessages.value.title = 'Le titre ne peut pas être vide.';
      canSubmit = false;
    }
    //Validate if content is empty
    if (!post.value.content.trim()) {
      errorMessages.value.content = 'Le contenu ne peut pas être vide.';
      canSubmit = false;
    }
    //Title must not be longer than 150 characters and shorter than 5 characters
    if (post.value.title.length > 150 || post.value.title.length < 5) {
      errorMessages.value.title = 'Le titre doit être entre 5 et 150 caractères.';
      canSubmit = false;
    }
    //Content must not be longer than 5000 characters and shorter than 10 characters
    if (post.value.content.length > 5000 || post.value.content.length < 10) {
      errorMessages.value.content = 'Le contenu doit être entre 10 et 5000 caractères.';
      canSubmit = false;
    }
    if (selectedCategories.value.length === 0) {
      errorMessages.value.category = 'Vous devez sélectionner au moins une catégorie.';
      canSubmit = false;
    }
    if (canSubmit)
    {
      try {
        const response = await fetchApi('post', {
          method: 'POST',
          body: JSON.stringify({
            ...post.value,
            categories: selectedCategories.value,
          }),
        })
        await router.push({ name: 'PostDetail', params: { postId: response.data.id } })
      } catch (err) {
        if (err instanceof Error) {
          errorMessages.value.general = err.message
        } else {
          errorMessages.value.general = 'Une erreur inattendu est survenue. Merci de réessayer plus tard.'
        }
      }
    }
  }

  const availableCategories = computed(() => {
    return categories.value.filter(c => !selectedCategories.value.includes(c.id));
  });

  const addCategory = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    selectedCategories.value.push(categoryId);
  };

  const removeCategory = (categoryId) => {
    const index = selectedCategories.value.indexOf(categoryId);
    if (index !== -1) {
      selectedCategories.value.splice(index, 1);
    }
  };

  const createCategory = async () => {
    if (newCategory.value.trim()) {
      //Validate if category already exists
      if (categories.value.find(c => c.name === newCategory.value)) {
        selectedCategories.value.push(categories.value.find(c => c.name === newCategory.value).id);
        newCategory.value = '';
        return;
      }
      //Create new category
      //The string must not be longer than 50 characters
      if (newCategory.value.length > 50) {
        errorMessages.value.category = 'Le nom des catégories ne doivent pas dépasser 50 caractère.';
        return;
      }
      try{
        const response = await fetchApi('category', {
          method: 'POST',
          body: JSON.stringify({ name: newCategory.value })
        });
        categories.value.push(response.data);
        selectedCategories.value.push(response.data.id);
        newCategory.value = '';
        await fetchCategories();
      }
      catch (err) {
        if (err instanceof Error) {
          errorMessages.value.category = err.message;
        } else {
          errorMessages.value.category = 'Une erreur inattendu est survenue. Merci de réessayer plus tard.';
        }
      }
    }
    errorMessages.value.category = 'Le nom de la catégorie ne peut pas être vide.';
  };

  onMounted(fetchCategories)
</script>
<template>
  <div class="p-4">
    <div v-if="errorMessages.general" class="text-red-800 bg-red-100 text-sm italic py-4 px-6 rounded mb-4">{{ errorMessages.general }}</div>
    <form @keydown.enter.prevent @submit.prevent="submitPost">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 text-sm font-bold mb-2">Titre de l'article:</label>
        <input id="title" v-model="post.title" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required>
        <div v-if="errorMessages.title" class="text-red-800 text-sm italic">{{ errorMessages.title }}</div>
      </div>
      <div class="mb-4">
        <label for="content" class="block text-gray-700 text-sm font-bold mb-2">Corp de l'article:</label>
        <textarea id="content" v-model="post.content" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required></textarea>
        <div class="flex justify-between">
          <div v-if="errorMessages.content" class="text-red-800 text-sm italic">{{ errorMessages.content }}</div>
          <p class="text-gray-500 text-sm">{{contentLength}} / 5000</p>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">Catégories associées:</label>
        <div v-if="selectedCategories.length > 0" class="mb-4">
         <div v-for="categoryId in selectedCategories" :key="categoryId" class="bg-blue-200 inline-flex items-center text-blue-800 m-1 p-1 rounded">
           {{ categories.find(category => category.id === categoryId).name }}
           <button @click.prevent="removeCategory(categoryId)" class="inline-block text-blue-900 p-1 ml-1">x</button>
         </div>
       </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <select @change="addCategory" class="shadow border rounded w-full py-2 px-3 text-gray-700 mb-2">
              <option value="" selected>Ajouter une catégorie</option>
              <option v-for="category in availableCategories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="flex-1">
            <input type="text" v-model="newCategory" @keydown.enter.prevent="createCategory" placeholder="Créer une catégorie" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
          </div>
        </div>
        <div v-if="errorMessages.category" class="text-red-800 text-sm italic">{{ errorMessages.category }}</div>
      </div>
      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >Valider</button>
    </form>
  </div>
</template>