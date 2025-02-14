<script setup>
import { onMounted, ref } from "vue";
import TaskCard from "../../components/cards/TaskCard.vue";

const task = ref({
  category: "Academic",
  taskType: "Automatic",
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
  <TaskCard :task="task"></TaskCard>
  <TaskCard :task="task"></TaskCard>
</template>
