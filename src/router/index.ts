import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/usuarios' },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },

    { path: '/usuarios', name: 'usuarios', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },

    { path: '/usuarios/nuevo', name: 'usuarios-nuevo', component: () => import('@/views/UserForm.vue'), meta: { requiresAuth: true } },
    { path: '/usuarios/:id/editar', name: 'usuarios-editar', component: () => import('@/views/UserForm.vue'), props: true, meta: { requiresAuth: true } },

    { path: '/:pathMatch(.*)*', redirect: '/usuarios' },
    
    { path: '/tareas', name: 'tareas', component: () => import('@/views/Tareas.vue'), meta: { requiresAuth: true } },
    { path: '/tareas/nueva', name: 'tareas-nueva', component: () => import('@/views/TareaForm.vue'), meta: { requiresAuth: true } },
    { path: '/tareas/:id/editar', name: 'tareas-editar', component: () => import('@/views/TareaForm.vue'), props: true, meta: { requiresAuth: true } },


  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null

  // Requiere login
  if (to.meta.requiresAuth && !token) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Requiere admin
  if (to.meta.requiresAdmin && user?.rol !== 'admin') {
    return { name: 'usuarios' } // redirige al listado
  }

  // Si ya está logueado y va al login, redirige al listado
  if (to.name === 'login' && token) {
    return { name: 'usuarios' }
  }

  return true
})


export default router
