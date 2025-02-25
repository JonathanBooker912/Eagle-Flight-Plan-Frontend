<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <v-app>
    <v-row no-gutters nowrap>
      <NavBar />
      <v-main color="background">
        <router-view />
      </v-main>
    </v-row>
  </v-app>
</template>
