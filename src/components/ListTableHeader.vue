<script setup>
const props = defineProps({
  headers: {
    type: Array,
    required: true, // Array of column headers
  },
});
</script>

<template>
  <v-card
    color="backgroundDarken"
    class="headerCard"
    role="row"
    aria-label="Table Header"
  >
    <v-container class="header-container">
      <v-row>
        <v-col
          v-for="(header, index) in headers"
          :key="index"
          :cols="index === 0 ? 1 : 12 / (headers.length - 1 + 1)"
          class="text-left"
        >
          <v-card-text class="pa-0">
            <p class="text-h6 font-weight-bold header-text">
              {{ header }}
            </p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.headerCard {
  border-radius: 20px;
  height: 30px;
  margin: 5px 0;
  background-color: #333;
  color: #fff;
}

.header-container {
  padding: 0;
}
</style>
