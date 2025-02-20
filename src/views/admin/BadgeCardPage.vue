<script setup>
import { ref } from "vue";
import BadgeCard from "../../components/cards/BadgeCard.vue";
const badge = ref({
  name: "Badge Name test",
});
const badge2 = ref({
  name: "Badge Name test and this is soooo long",
});
</script>
<template>
  <BadgeCard :badge="badge"></BadgeCard>
  <BadgeCard :badge="badge2"></BadgeCard>
  <BadgeCard :badge="badge"></BadgeCard>
  <BadgeCard :badge="badge"></BadgeCard>
  <BadgeCard :badge="badge"></BadgeCard>
</template>
