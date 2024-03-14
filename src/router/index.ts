import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authService } from '../services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/posts',
      name: 'PostList',
      component: () => import('../views/PostView.vue')
    },
    {
        path: '/posts/:postId',
        name: 'PostDetail',
        component: () => import('../views/PostDetailView.vue')
    },
    {
      path: '/create-post',
      name: 'PostCreate',
      component: () => import('../views/CreatePostView.vue')
    },
    {
      path: '/edit-post/:postId',
      name: 'PostEdit',
      component: () => import('../views/EditPostView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {

    const publicPages = [
        '/',
        '/login',
        '/register',
        '/posts',
    ];
    const authRequired = !publicPages.includes(to.path) && !to.path.startsWith('/posts/');
    const loggedIn = authService.isAuthenticated();

    const token = authService.getToken();
    const tokenExp = localStorage.tokenExp;
    if (token && tokenExp && (Date.now() > tokenExp)) {
        authService.logout();
        return next('/login');
    }

    if (authRequired && !loggedIn) {
        return next('/login');
    }

    next();
})

export default router
