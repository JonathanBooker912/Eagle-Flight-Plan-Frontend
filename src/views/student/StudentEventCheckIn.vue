<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userStore } from "../../stores/userStore";
import { storeToRefs } from "pinia";
import EventServices from "../../services/eventServices.js";
import EventCard from "../../components/cards/EventCard.vue";
import FlightPlanItemCard from "../../components/cards/FlightPlanItemCard.vue";
import flightPlanItemServices from "../../services/flightPlanItemServices";

const route = useRoute();
const router = useRouter();
const store = userStore();
const { user } = storeToRefs(store);
const event = ref(null);
const flightPlanItem = ref(null);

const props = defineProps({
  eventToken: {
    type: Number,
    required: true,
  },
});

const userInitials = computed(() => {
  if (!user?.value?.fName || !user?.value?.lName) return "";
  return `${user.value.fName[0]}${user.value.lName[0]}`;
});

const getEvent = async () => {
  const response = await EventServices.getEventByToken(props.eventToken);
  event.value = response.data;

  EventServices.getFulfillableFlightPlanItems(event.value.id, 3).then(
    (response) => {
      flightPlanItem.value = response.data.fulfillableFlightPlanItems[0];
    }
  );
};

onMounted(() => {
  getEvent();
});
</script>
<template>
  <v-card v-if="event" color="backgroundDarken rounded-xl w-75 mx-auto mt-8">
    <v-card-title class="text-center text-h4">Event Check-In</v-card-title>
    <v-card-text>
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" md="5" class="d-flex justify-center">
          <div class="dashed-outline sub-card">
            <EventCard :event="event" view-only />
          </div>
        </v-col>
        <v-col class="d-flex justify-center align-center">
          <v-card-text class="text-center text-h5">
            Event Fulfills:
          </v-card-text>
          <v-icon>mdi-arrow-right</v-icon>
        </v-col>
        <v-col cols="12" md="5" class="d-flex justify-center">
          <div class="dashed-outline sub-card">
            <FlightPlanItemCard
              v-if="flightPlanItem"
              :flightPlanItem="flightPlanItem"
            />
            <div v-else class="text-center text-h6 pa-4">
              No Associated Flight Plan Item Found
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row
        class="align-center justify-center mt-8 mx-auto"
        no-gutters
        style="max-width: 400px"
      >
        <v-avatar color="primary" size="64" class="mr-4"
          ><span class="text-h6">{{ userInitials }}</span></v-avatar
        >
        <v-col cols="auto" class="align-start">
          <v-card-text class="text-h5"
            >{{ user?.fName }} {{ user?.lName }}</v-card-text
          >
          <v-card-text class="text-subtitle-1 mt-n6">{{
            user?.studentId
          }}</v-card-text>
        </v-col>
      </v-row>
      <v-row class="mt-10" justify="center" align="center" no-gutters>
        <v-btn class="rounded-lg mr-6" variant="outlined">Cancel</v-btn>
        <v-btn class="rounded-lg" color="primary">Check-In</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.dashed-outline {
  border: 3px;
  border-style: dashed;
  border-radius: 25px;
  height: fit-content;
  min-width: 300px;
}

.sub-card {
  width: 30%;
}

.fit-content {
  width: fit-content;
}
</style>
