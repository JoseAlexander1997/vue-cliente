<template>
  <v-data-table
    :items="filtered"
    :headers="headers"
    :loading="loading"
    class="elevation-1"
  >
    <!-- Columna formateada solo con fecha -->
    <template #item.created_at="{ item }">
      {{ new Date(item.created_at).toLocaleDateString('es-ES') }}
    </template>

    <!-- Botón acciones -->
    <template #item.actions="{ item }">
      <v-btn color="primary" small @click="editUser(item.id)">
        Editar
      </v-btn>
    </template>

    <template #no-data>
      <div class="pa-6 text-center">No hay usuarios para mostrar.</div>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

type Usuario = { id:number; nombre:string; email:string; rol:'admin'|'usuario' }
const props = defineProps<{ searchTerm?: string }>()
const router = useRouter()

const items = ref<Usuario[]>([])
const loading = ref(false)

const headers = [
  { title: 'Nombre', value: 'nombre' },
  { title: 'Email',  value: 'email' },
  { title: 'Rol',    value: 'rol' },
  { title: 'Creación',    value: 'created_at' },
  { title: 'Acciones', value: 'actions' } // nueva columna para acciones
]

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data } = await api.get<Usuario[]>('/usuarios/listUsers')
    items.value = data
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)

const filtered = computed(() => {
  const q = (props.searchTerm || '').toLowerCase().trim()
  if (!q) return items.value
  return items.value.filter(u =>
    u.nombre.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)  ||
    u.rol.toLowerCase().includes(q)
  )
})

const editUser = (id: number) => {
  router.push(`/usuarios/${id}/editar`)
}
</script>
