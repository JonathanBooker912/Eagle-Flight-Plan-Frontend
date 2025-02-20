<script setup>
import { ref } from "vue";
import BadgeCard from "../../components/cards/BadgeCard.vue";
const badge = ref({
  name: "Badge Name test",
});
</script>
<template>
  <BadgeCard :badge="badge"></BadgeCard>
  <BadgeCard :badge="badge"></BadgeCard>
</template>