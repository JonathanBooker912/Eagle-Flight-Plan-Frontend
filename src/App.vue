<script setup>
    import { userStore } from "./stores/userStore";
    const store = userStore();
    store.setupRouteWatcher();
</script>

<template>
    <v-app>
        <!-- <MenuBar :key="$route.fullPath" /> -->
        <v-main color="background">
            <router-view />
        </v-main>
    </v-app>
</template>
