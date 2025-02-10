<script setup>
import HelloWorld from './components/HelloWorld.vue'
import NavigationBar from './components/NavigationBar.vue';
import { userStore } from "./stores/userStore";
const store = userStore();
store.setupRouteWatcher();
</script>

<template>
  <v-app>
    <!-- <MenuBar :key="$route.fullPath" /> -->
    <v-main color="background">
      <NavigationBar></NavigationBar>
      <router-view />
    </v-main>
  </v-app>
</template>
