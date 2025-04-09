<script setup>
import eventServices from "../../services/eventServices";
import notificationServices from "../../services/notificationServices";
import EventCard from "../../components/cards/EventCard.vue";

import { userStore } from "../../stores/userStore";
import { onMounted, ref } from "vue";
import { useNotificationStore } from "../../stores/notificationStore";
//import { useRoute } from "vue-router";
// import { useModalStore } from "../../store/modal.store";
// import { storeToRefs } from "pinia";

//const modalStore = useModalStore();

//const items = ref([]);
const events = ref([]);
const notifications = ref([]);
const isLoaded = ref(false);
//const route = useRoute();

const store = userStore();
const notifStore = useNotificationStore();

const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);

const getEvents = async () => {
  await eventServices
    .getAllEvents()
    .then((res) => {
      events.value = res.data.events;
      isLoaded.value = true;
    })
    .catch((err) => console.error(err));
};

const getNotifications = async (page = 1) => {
  try {
    const res = await notificationServices.getAllNotificationsForUser(
      store.user.userId,
      page,
      pageSize.value,
    );

    notifications.value = res.data.notifications; // Update the notifications array
    totalPages.value = Math.ceil(res.data.total / pageSize.value);
    currentPage.value = page; // Ensure currentPage updates correctly
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

const openNotification = (x) => {
  notifStore.setActiveNotification(x);
};

onMounted(() => {
  getEvents();
  getNotifications();
});
//ok so now that we have the services, get the data.
</script>

<template>
  <v-row justify="center">
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <strong style="font-size: 20px; padding-bottom: 5px"
        >Upcoming Events</strong
      >
      <EventCard
        v-for="(item, index) in events.splice(0, 2)"
        :key="index"
        :event="item"
        :isEventViewing="false"
        :to="{ name: 'admin-calendar' }"
      ></EventCard>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemBig">
      <p>Engagement Breakdown by Classification</p>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <strong style="font-size: 20px; padding-bottom: 5px"
        >Notifications</strong
      >
      <div id="notifList">
        <v-card
          v-for="(item, index) in notifications.slice(0, 4)"
          :key="index"
          :to="{ name: 'admin-notifications' }"
          class="notification"
          color="background"
          @click="openNotification(item.id)"
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
    <v-card color="backgroundDarken" class="adminItem adminItemBig">
      <p>Percentage of students on track to complete their flight plan</p>
    </v-card>
  </v-row>
</template>

<style>
.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 2% 1% 2% 1%;
  height: 45vh;
  padding: 2vh 2vw;

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
