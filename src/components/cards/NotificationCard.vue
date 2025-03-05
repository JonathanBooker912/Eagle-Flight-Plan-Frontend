<script setup>
import eventServices from "../../services/eventServices";
import notificationServices from "../../services/notificationServices";
import EventCard from "../../components/cards/EventCard.vue";

import { onMounted, ref } from "vue";

const events = ref([]);
const notifications = ref([]);
const isLoaded = ref(false);

const getEvents = async () => {
  await eventServices
    .getAllEventsForUser()
    .then((res) => {
      events.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

const getNotifications = async () => {
  await notificationServices
    .getAllNotificationsForUser()
    .then((res) => {
      notifications.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  getEvents();
  getNotifications();
});
</script>

<template>
  <v-card
    color="backgroundDarken"
    class="d-flex align-center justify-center ma-2 pa-2 flex-wrap"
  >
    <v-row justify="center">
      <v-card
        color="background"
        class="adminItem adminItemSmall d-flex flex-column text-start ma-2 pa-3 rounded-lg"
        height="45vh"
      >
        <strong class="text-h6 pb-2">Upcoming Events</strong>
        <EventCard
          v-for="(item, index) in events.slice(0, 2)"
          :key="index"
          :event="item"
          :isEdit="false"
          :to="{ name: 'admin-calendar' }"
        ></EventCard>
      </v-card>

      <v-card
        color="background"
        class="adminItem adminItemBig d-flex justify-center align-center ma-2 pa-3 rounded-lg"
        width="45vw"
      >
        <p>Engagement Breakdown by Classification</p>
      </v-card>

      <v-card
        color="background"
        class="adminItem adminItemSmall d-flex flex-column text-start ma-2 pa-3 rounded-lg"
        height="45vh"
      >
        <strong class="text-h6 pb-2">Notifications</strong>
        <div id="notifList">
          <v-card
            v-for="(item, index) in notifications.slice(0, 4)"
            :key="index"
            :to="{ name: 'admin-notifications' }"
            class="notification d-flex align-center ma-2 pa-2 rounded-lg"
            color="background"
          >
            <div class="d-flex align-center">
              <v-img
                class="mr-2"
                height="30px"
                src="../../../public/Birb.png"
              />
              <div>
                <strong class="text-body-1">{{ item.header }}</strong>
                <p class="text-caption">{{ item.description }}</p>
              </div>
            </div>
          </v-card>
        </div>
      </v-card>

      <v-card
        color="background"
        class="adminItem adminItemBig d-flex justify-center align-center ma-2 pa-3 rounded-lg"
        width="45vw"
      >
        <p>Percentage of students on track to complete their flight plan</p>
      </v-card>
    </v-row>
  </v-card>
</template>
