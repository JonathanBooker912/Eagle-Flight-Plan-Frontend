<script setup>
</script>

<template>
  <v-card color="background">
    <v-card color="background">
        <router-view :key="$route.fullPath" />
    </v-card>
  </v-card>
</template>


<style scoped>
.main-page {
  display: flex;
  height: 100%;
}
.content-area {
  flex: 1;
  padding: 20px;
}
</style>