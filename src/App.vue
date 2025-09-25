<template>
  <v-app>
    <!-- App Bar / Header -->
   <v-app-bar
  app
  color="indigo darken-3"
  dark
  elevate-on-scroll
  prominent
>
  <v-app-bar-title>
    <v-icon left>mdi-laravel</v-icon>
    Taller Laravel + Vue | Alexander Hernandez
  </v-app-bar-title>
  
  <v-spacer></v-spacer>

  <!-- Perfil -->
  <v-btn icon>
    <v-icon>mdi-account</v-icon>
  </v-btn>

  <!-- Logout -->
  <v-btn icon @click="logout">
    <v-icon>mdi-logout</v-icon>
  </v-btn>
</v-app-bar>


    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="pa-4">
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer opcional -->
    <v-footer
      padless
      color="indigo darken-4"
      class="white--text text-center"
    >
      <v-col class="py-3">
        &copy; {{ new Date().getFullYear() }} Alexander Hernandez
      </v-col>
    </v-footer>
  </v-app>
</template>



<style scoped>
.main-content {
  background: linear-gradient(to bottom right, #f5f7fa, #c3cfe2);
  min-height: calc(100vh - 64px); /* Ajusta al tamaño del header */
}
</style>


