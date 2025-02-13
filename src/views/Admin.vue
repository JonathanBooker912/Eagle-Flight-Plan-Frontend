<script setup></script>

<template>
  <v-card color="background">
    <v-card color="background">
      <router-view :key="$route.fullPath" />
    </v-card>
  </v-card>
</template>

<style scoped></style>
