<template>
  <v-container>
    <v-card class="pa-4">
      <div class="text-h6 mb-4">{{ isEdit ? 'Editar Usuario' : 'Nuevo Usuario' }}</div>

      <v-form ref="form">
        <v-text-field v-model="form.nombre" label="Nombre" required></v-text-field>
        <v-text-field v-model="form.email" label="Email" required></v-text-field>
        <v-select
          v-model="form.rol"
          :items="['admin', 'usuario']"
          label="Rol"
          required
        ></v-select>

        <v-btn color="primary" @click="submit">Guardar</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

type Usuario = { id?: number; nombre: string; email: string; rol: 'admin'|'usuario' }

const route = useRoute()
const router = useRouter()

const form = ref<Usuario>({ nombre: '', email: '', rol: 'usuario' })
const isEdit = ref(false)

// Función para cargar usuario
const loadUser = async (id: string | number) => {
  try {
    const { data } = await api.get<Usuario>(`/usuarios/getUser/${id}`)
    form.value = { ...data }
  } catch (error) {
    console.error('Error al cargar usuario', error)
  }
}

// Detectar si es edición
const idParam = route.params.id
if (idParam) {
  isEdit.value = true
  loadUser(Number(idParam)) // convertir a número
}

// Observar cambios de la ruta
watch(() => route.params.id, (newId) => {
  if (newId) {
    isEdit.value = true
    loadUser(Number(newId))
  } else {
    isEdit.value = false
    form.value = { nombre: '', email: '', rol: 'usuario' }
  }
})

// Guardar usuario
const submit = async () => {
  try {
    if (isEdit.value && route.params.id) {
      await api.put(`/usuarios/updateUser/${route.params.id}`, form.value)
    } else {
      await api.post('/usuarios/addUser', form.value)
    }
    router.push('/usuarios')
  } catch (error) {
    console.error('Error al guardar', error)
  }
}
</script>
