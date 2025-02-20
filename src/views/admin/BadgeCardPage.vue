<script setup>
import { ref } from "vue";
import BadgeCard from "../../components/cards/BadgeCard.vue";
const badge = ref({
  category: "Academic",
  badgeType: "Automatic",
  reflectionRequired: true,
  schedulingType: "one-time",
  completionType: "self-reported",
  description: "Build your profressional resume for potential job appilcations",
  name: "Build Resume",
  rationale: "Prepare student for career success",
  points: 30,
});
</script>
<template>
  <BadgeCard :badge="badge"></BadgeCard>
  <BadgeCard :badge="badge"></BadgeCard>
</template>