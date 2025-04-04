<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  strength: {
    type: Object,
    required: true,
  },
});

// Reactive property to track the hovered strength name
const hoveredStrength = ref(null);

// Use the description from the strength object
const strengthDescription = computed(() => {
  return props.strength.description || "Description not available.";
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
</script>

<template>
  <v-card
    color="backgroundDarken"
    class="pa-3 my-2 rounded-lg strengthCard"
    v-show="hoveredStrength === null || hoveredStrength === strength.name"
    :class="{
      expanded: hoveredStrength === strength.name,
    }"
    @mouseover="hoveredStrength = strength.name"
    @mouseleave="hoveredStrength = null"
  >
    <v-row align="center" class="strength-header">
      <v-card class="category" :style="{ backgroundColor: categoryColor }">
        <h3>{{ props.strength.number }}</h3>
      </v-card>
      <h3 class="strength-name">{{ props.strength.name }}</h3>
      <p class="ml-auto domain">{{ props.strength.domain }}</p>
    </v-row>

    <!-- Show the description only when hovered -->
    <p v-if="hoveredStrength === strength.name" class="strength-description">
      {{ strengthDescription }}
    </p>
  </v-card>
</template>

<style scoped>
.strengthCard {
  height: 5vh;
  align-items: center;
  transition:
    height 0.3s ease,
    opacity 0.3s ease;
  width: 100%;
}

.strength-header {
  display: flex;
  align-items: center;
  width: 100%;
}

.strength-name {
  margin: 0 20px;
  font-size: 1.2rem;
  font-weight: 500;
}

/* Hide other strengths when hovering */
.hidden {
  opacity: 0;
  display: none !important;
  height: 0 !important;
  overflow: hidden;
  transition:
    height 0.3s ease,
    opacity 0.3s ease;
}

/* Expand hovered strength */
.expanded {
  height: 20vh;
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
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.strength-description {
  margin: 20px 80px;
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
}

.noShow {
  display: none;
  height: 0%;
}

.expanded {
  height: 100%;
}
</style>
