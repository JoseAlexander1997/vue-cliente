<template>
  <v-container>
    <v-card class="pa-4">
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="text-h6">Listado de Tareas</div>
        <v-btn color="primary" @click="goToNew">Nueva Tarea</v-btn>
        </div>
        <v-btn color="success" class="ma-0 pa-1 text-body-2" @click="downloadExcel">
    DESCARGAR FORMULARIO
    </v-btn>
 
<v-btn
  x-small
  color="secondary"
  class="mb-3"
  @click="goToUsuarios">
 🧑 Usuarios
</v-btn>

      <v-data-table
        :headers="headers"
        :items="tareas"
        :loading="loading"
        class="elevation-1"
      >
        <template #item.usuario="{ item }">
          {{ item.usuario?.nombre || 'Sin asignar' }}
        </template>

        <template #item.estado="{ item }">
          <v-chip :color="estadoColor(item.estado)" dark>{{ item.estado }}</v-chip>
        </template>

        <template #item.fecha_vencimiento="{ item }">
            {{ item.fecha_vencimiento || '-' }}
        </template>


       <template #item.actions="{ item }">
            <v-btn 
                color="primary" 
                class="ma-0 pa-1 text-body-2" 
                @click="editTarea(item.id)"
            >
                Editar
            </v-btn>
            <v-btn 
                color="error" 
                class="ma-0 pa-1 text-body-2" 
                @click="deleteTarea(item.id)"
            >
                Eliminar
            </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

type Usuario = { id: number; nombre: string }
type Tarea = {
  id: number
  titulo: string
  descripcion: string
  estado: string
  usuario?: Usuario
}

const router = useRouter()
const tareas = ref<Tarea[]>([])
const loading = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Título', key: 'titulo' },
  { title: 'Descripción', key: 'descripcion' },
  { title: 'Usuario', key: 'usuario' },
  { title: 'Estado', key: 'estado' },
  { title: 'Fecha Vencimiento', key: 'fecha_vencimiento' }, // <-- nueva columna
  { title: 'Acciones', key: 'actions', sortable: false },
]


// Cargar tareas desde API
const loadTareas = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/tareas/listTareas')
    tareas.value = data
  } catch (error) {
    console.error('Error al cargar tareas', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTareas()
})

// Navegar a crear
const goToNew = () => router.push('/tareas/nueva')

// Navegar a usuarios
const goToUsuarios = () => router.push('/usuarios')

// Navegar a editar
const editTarea = (id: number) => router.push(`/tareas/${id}/editar`)

// Eliminar tarea
const deleteTarea = async (id: number) => {
  if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return
  try {
    await api.delete(`/tareas/deleteTarea/${id}`)
    alert('Tarea eliminada correctamente')
    loadTareas()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al eliminar tarea')
  }
}

// Color para estado
const estadoColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'orange'
    case 'en_progreso': return 'blue'
    case 'completada': return 'green'
    default: return 'grey'
  }
}

const downloadExcel = async () => {
  try {
    const response = await api.get('/tareas/exportPendientes', {
      responseType: 'blob', // necesario para descargar archivos
      headers: {
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'tareas_pendientes.xlsx')
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error: any) {
    console.error('Error al descargar Excel', error.response || error)
    alert('No se pudo descargar el archivo')
  }
}


</script>
