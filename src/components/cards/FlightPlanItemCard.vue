<script setup>
import { computed } from "vue";

const props = defineProps({
  flightPlanItem: {
    type: Object,
    required: true,
  },
});

const color = computed(
  () =>
    ({
      Incomplete: "danger",
      Pending: "warning",
    })[props.flightPlanItem.status] || "primary",
);
</script>
<template>
  <v-card color="backgroundDarken" class="cardContainer pa-0 ma-0">
    <v-container class="pa-2">
      <v-row no-gutters>
        <v-sheet :color="color" class="accentChip mr-2" width="20"></v-sheet>
        <v-col>
          <v-card-text class="text-no-wrap">
            <p class="text-h6 mb-2">
              {{ flightPlanItem.flightPlanType }}
            </p>
            <p>{{ flightPlanItem.status }}</p>
            <p>{{ flightPlanItem.dueDate }}</p></v-card-text
          >
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.cardContainer {
  border-radius: 25px;
}
.accentChip {
  border-radius: 20px 0px 0px 20px;
}
</style>
