<script setup>
import eventServices from "../../services/eventServices";
import notificationServices from "../../services/notificationServices";
import EventCard from "../../components/cards/EventCard.vue";

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
// import { useModalStore } from "../../store/modal.store";
// import { storeToRefs } from "pinia";

//const modalStore = useModalStore();

//const items = ref([]);
const events = ref({});
const notifications = ref([]);
const isLoaded = ref(false);
const route = useRoute();

const getEvents = async () => {
  await eventServices
    .getAllEventsForUser()
    .then((res) => {
      console.log(res);
      events.value = res.data;
      isLoaded.value = true;
      console.log(events);
    })
    .catch((err) => console.log(err));
};

const getNotifications = async () => {
  await notificationServices
    .getAllNotificationsForUser()
    .then((res) => {
      notifications.value = res.data;
      isLoaded.value = true;
      console.log(notifications);
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  getEvents();
  getNotifications();
});
//ok so now that we have the services, get the data.
</script>

<template>
  <v-card color="backgroundDarken" class="main-back">
    <v-row justify="center">
      <v-card color="background" class="adminItem adminItemSmall">
        <strong style="font-size: 20px; padding-bottom: 5px"
          >Upcoming Events</strong
        >
        <EventCard
          v-for=""
          :isEdit="false"
          :to="{ name: 'admin-notifications' }"
        ></EventCard>
        <EventCard
          :event="event2"
          :isEdit="false"
          :to="{ name: 'admin-notifications' }"
        ></EventCard>
      </v-card>
      <v-card color="background" class="adminItem adminItemBig">
        <p>Engagement Breakdown by Classification</p>
      </v-card>
      <v-card color="background" class="adminItem adminItemSmall">
        <strong style="font-size: 20px; padding-bottom: 5px"
          >Notifications</strong
        >
        <div id="notifList">
          <v-card
            :to="{ name: 'admin-notifications' }"
            class="notification"
            color="background"
            v-for="(item, index) in notifications.slice(0, 4)"
            :key="index"
          >
            <div style="display: flex; align-items: center">
              <img
                style="height: 30px; margin-right: 5px"
                src="../../../public/Birb.png"
              />
              <div>
                <strong style="font-size: 18px">{{ item.header }}</strong>
                <p style="font-size: 14px">{{ item.description }}</p>
              </div>
            </div>
          </v-card>
        </div>
      </v-card>
      <v-card color="background" class="adminItem adminItemBig">
        <p>Percentage of students on track to complete their flight plan</p>
      </v-card>
    </v-row>
  </v-card>
</template>

<style>
.main-back {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5%;
  padding: 0.5%;
  flex-wrap: wrap;
  align-self: flex-end;
  border-radius: 25px;
  width: 90vw;
}

.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 1%;
  height: 45vh;
  padding: 15px 0px 5px 0px;

  border-radius: 25px;
}

.adminItemSmall {
  width: 35vw;
}

.adminItemBig {
  justify-content: center;
  align-items: center;
  width: 45vw;
}

.notification {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}
</style>
