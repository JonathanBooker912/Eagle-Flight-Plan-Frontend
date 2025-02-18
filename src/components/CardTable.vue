<script setup>
import { VRow, VCol, VCard } from "vuetify/components";

// Props for number of items per row and items array
const props = defineProps({
  items: Array,
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
  <v-container fluid class="scrollable-container">
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
  </v-container>
</template>

<style scoped>
.scrollable-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding-right: 4px; /* Prevent content from hiding under scrollbar */
  margin-top: 10px;
}
</style>
