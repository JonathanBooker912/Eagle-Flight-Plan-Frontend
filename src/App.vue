<script setup>
    import { userStore } from "./stores/userStore";
    const store = userStore();
    store.setupRouteWatcher();
    import NavigationBar from './components/NavigationBar.vue';

</script>

<template>
  <v-app style="background-color: #242424;">
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
