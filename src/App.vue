<script setup>
import NavigationBar from "./components/NavigationBar.vue";
import { userStore } from "./stores/userStore";
const store = userStore();
store.setupRouteWatcher();
</script>

<template>
  <v-app>
    <v-row no-gutters no-wrap>
      <NavigationBar v-if="$route.path !== '/login'" />
      <v-main>
        <router-view />
      </v-main>
    </v-row>
  </v-app>
</template>
