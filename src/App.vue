<script setup>
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <v-app>
    <!-- <MenuBar :key="$route.fullPath" /> -->
    <v-main color="background">
      <router-view />
    </v-main>
  </v-app>
</template>
