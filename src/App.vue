<script setup>
import { userStore } from "./stores/userStore";
const store = userStore();
store.setupRouteWatcher();
import UserCard from "./components/cards/UserCard.vue";
</script>

<template>
  <v-app>
    <v-main color="background">
      <user-card></user-card>
    </v-main>
  </v-app>
</template>
