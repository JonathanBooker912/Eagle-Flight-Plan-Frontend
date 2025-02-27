<script setup>
import { ref } from "vue";
import EventCard from "../../components/cards/EventCard.vue";

const event = ref({
  id: 2,
  name: "Career Fair",
  description: "go socialize",
  location: "Meinders Conference Center",
  date: "2025-03-01T00:00:00.000Z",
  startTime: "2025-03-01T09:00:00.000Z",
  endTime: "2025-03-01T11:00:00.000Z",
  attendanceType: "In Person",
  registration: "In App",
  completionType: "automatic",
  createdAt: "2025-02-18T14:44:47.000Z",
  updatedAt: "2025-02-18T14:44:47.000Z",
});
</script>
<template>
  <EventCard :event="event"></EventCard>
  <EventCard :event="event"></EventCard>
</template>
