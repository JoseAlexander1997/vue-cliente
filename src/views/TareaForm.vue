<template>
  <v-container>
    <v-card class="pa-4">
      <div class="text-h6 mb-4">{{ isEdit ? 'Editar Tarea' : 'Nueva Tarea' }}</div>

      <v-form>
        <v-text-field v-model="form.titulo" label="Título" required></v-text-field>
        <v-textarea v-model="form.descripcion" label="Descripción"></v-textarea>

        <v-select
          v-model="form.usuario_id"
          :items="usuarios"
          item-title="nombre"
          item-value="id"
          label="Asignar a usuario"
          required
        ></v-select>

        <v-select
          v-model="form.estado"
          :items="['pendiente','en_progreso','completada']"
          label="Estado"
        ></v-select>

        <v-text-field
          v-model="form.fecha_vencimiento"
          type="date"
          label="Fecha de vencimiento"
        ></v-text-field>

        <v-btn color="primary" @click="saveTarea">Guardar</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

type Usuario = { id: number; nombre: string }
type Tarea = {
  id?: number
  titulo: string
  descripcion?: string
  estado: string
  fecha_vencimiento?: string
  usuario_id: number
}

const route = useRoute()
const router = useRouter()

const form = ref<Tarea>({
  titulo: '',
  descripcion: '',
  estado: 'pendiente',
  fecha_vencimiento: '',
  usuario_id: 0
})

const isEdit = ref(false)
const usuarios = ref<Usuario[]>([])

// Cargar usuarios para el select
const loadUsuarios = async () => {
  try {
    const { data } = await api.get<Usuario[]>('/usuarios/listUsers')
    usuarios.value = data
  } catch (error) {
    console.error('Error al cargar usuarios', error)
  }
}

// Cargar tarea si es edición
const loadTarea = async (id: string | number) => {
  try {
    const { data } = await api.get<Tarea>(`/tareas/getTarea/${id}`)
    form.value = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      estado: data.estado,
      fecha_vencimiento: data.fecha_vencimiento,
      usuario_id: data.usuario_id
    }
  } catch (error) {
    console.error('Error al cargar tarea', error)
  }
}

// Detectar si es edición
const idParam = route.params.id
if (idParam) {
  isEdit.value = true
  loadTarea(Number(idParam))
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    loadTarea(Number(newId))
  } else {
    isEdit.value = false
    form.value = { titulo: '', descripcion: '', estado: 'pendiente', fecha_vencimiento: '', usuario_id: 0 }
  }
})

const saveTarea = async () => {
  try {
    if (isEdit.value && route.params.id) {
      await api.put(`/tareas/updateTarea/${route.params.id}`, form.value)
      alert('Tarea actualizada correctamente')
    } else {
      await api.post('/tareas/addTarea', form.value)
      alert('Tarea creada correctamente')
    }
    router.push('/tareas')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Error al guardar tarea')
  }
}

onMounted(() => {
  loadUsuarios()
})
</script>
