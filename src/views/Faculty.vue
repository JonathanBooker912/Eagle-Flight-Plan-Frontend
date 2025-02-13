<script setup>
</script>

<template>
  <v-card class="main-page">
    <v-card class="content-area">
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