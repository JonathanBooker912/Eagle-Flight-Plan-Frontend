<script setup>
import { onMounted, ref } from "vue";
import EventServices from "../../services/eventServices.js";

const event = ref(null);

const props = defineProps({
  eventToken: {
    type: Number,
    required: true,
  },
});

const getEvent = () => {
  EventServices.getEventByToken(props.eventToken).then((response) => {
    event.value = response.data;
  });
};

onMounted(() => {
  getEvent();
});
</script>
<template>
  <v-card v-if="event">
    <v-card-title>{{ event.name }}</v-card-title>
  </v-card>
</template>
