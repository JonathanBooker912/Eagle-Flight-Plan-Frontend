<script setup>
import { VRow, VCol, VCard } from "vuetify/components";

// Props for number of items per row and items array
const props = defineProps({
  items: { type: Array, required: true },
  showFilters: Boolean,
  perRow: { type: Number, default: 4 },
  perRowLg: { type: Number, default: 3 },
  perRowMd: { type: Number, default: 2 },
  perRowSm: { type: Number, default: 1 },
  perRowXs: { type: Number, default: 1 },
});

// Return the number of columns based on the screen size
const getCols = (screenSize) => {
  const sizes = {
    xs: props.perRowXs,
    sm: props.perRowSm,
    md: props.perRowMd,
    lg: props.perRowLg,
    default: props.perRow,
  };
  return 12 / (sizes[screenSize] || sizes.default);
};
</script>

<template>
  <v-container fluid class="mt-2">
    <v-row>
      <v-slide-x-transition>
        <v-col v-if="showFilters" cols="12" md="3" lg="3">
          <v-card class="pa-4 filter-card elevation-0" color="backgroundDarken">
            <v-card-title>Filters</v-card-title>
            <v-card-text>
              <slot name="filters">
                <v-card-text>
                  <p>No filters provided</p>
                </v-card-text>
              </slot>
            </v-card-text>
          </v-card>
        </v-col>
      </v-slide-x-transition>
      <v-col>
        <v-row>
          <template v-for="(item, index) in props.items" :key="index">
            <v-col
              :cols="getCols('xs')"
              :sm="getCols('sm')"
              :md="getCols('md')"
              :lg="getCols('lg')"
              :xl="getCols('default')"
            >
              <slot name="item" :item="item">
                <!-- Default slot content if none provided -->
                <v-card>
                  <v-card-title>{{ item.title }}</v-card-title>
                  <v-card-text>{{ item.description }}</v-card-text>
                </v-card>
              </slot>
            </v-col>
          </template>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.scrollable-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-right: 4px; /* Prevent content from hiding under scrollbar */
  margin-top: 10px;
}

.filter-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 25px;
}
</style>
