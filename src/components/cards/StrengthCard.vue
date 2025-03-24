<template>
  <v-card
    v-show="hoveredStrength === null || hoveredStrength === strength.name"
    color="backgroundDarken"
    class="pa-3 my-2 rounded-lg strengthCard"
    :class="{
      noShow: hoveredStrength !== strength.name && hoveredStrength !== null, // Default class when not hovered
      expanded: hoveredStrength === strength.name, // Expanded class when hovered
    }"
    @mouseover="hoveredStrength = strength.name"
    @mouseleave="hoveredStrength = null"
  >
    <v-row align="center">
      <!-- Strength number in category -->
      <v-card class="category" :style="{ backgroundColor: categoryColor }">
        <h3>{{ props.strength.number }}</h3>
      </v-card>
      <h3>{{ props.strength.name }}</h3>
      <p class="ml-auto domain">{{ props.strength.domain }}</p>
    </v-row>

    <!-- Conditionally show the description when hovered -->
    <p
      v-if="hoveredStrength === props.strength.name"
      class="strength-description"
    >
      {{ strengthDescription }}
    </p>
  </v-card>
</template>

<script setup>
import { computed, ref } from "vue";
import { strengthDescriptions } from "./strengthDescriptions";

const props = defineProps({
  strength: {
    type: Object,
    required: true,
  },
});

// Reactive property to track the hovered strength name
const hoveredStrength = ref(null);

// Fetch the description based on the strength name
const strengthDescription = computed(() => {
  return (
    strengthDescriptions[props.strength.name] || "Description not available."
  );
});

// Map domain values to colors
const categoryColor = computed(() => {
  const domainColors = {
    Executing: "#8B5CF6", // Blue
    Influencing: "#D97706", // Orange
    "Relationship Building": "#0070CA", // Green
    "Strategic Planning": "#10B981", // Purple
  };

  return domainColors[props.strength.domain] || "#0070CA"; // Default to blue if no match
});

// Handle mouse over event to set hovered strength
const handleHover = () => {
  hoveredStrength.value = props.strength.name;
};

// Handle mouse leave event to reset hovered strength
const handleLeave = () => {
  hoveredStrength.value = null;
};
</script>
<style>
.strengthCard {
  height: 5vh;
  display: inline-flex;
  align-items: center;
}

.category {
  height: 5vh;
  width: 40px;
  border-top-left-radius: 10px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
}

.domain {
  margin-right: 20px;
}

.noShow {
  display: none;
  height: 0%;
}

.expanded {
  height: 100%;
}
</style>
