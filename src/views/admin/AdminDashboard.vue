<script setup>
import eventServices from "../../services/eventServices";
import notificationServices from "../../services/notificationServices";
import EventCard from "../../components/cards/EventCard.vue";
import { userStore } from "../../stores/userStore";
import { onMounted, ref } from "vue";
import { useNotificationStore } from "../../stores/notificationStore";

const events = ref([]);
const notifications = ref([]);
const isLoaded = ref(false);
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
      console.log("Events data:", events.value);
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
    notifications.value = res.data.notifications;
    totalPages.value = Math.ceil(res.data.total / pageSize.value);
    currentPage.value = page;

    console.log("Updated Notifications:", notifications.value);
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
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-container">
      <div class="dashboard-row">
        <v-card color="backgroundDarken" class="adminItem adminItemSmall">
          <strong style="font-size: 20px; padding-bottom: 5px"
            >Upcoming Events</strong
          >
          <div class="scrollable-content">
            <EventCard
              v-for="(item, index) in events.splice(0, 2)"
              :key="index"
              :event="item"
              :view-only="true"
              color="background"
              :is-event-viewing="false"
              :to="{ name: 'admin-calendar' }"
            ></EventCard>
          </div>
          <v-btn
            variant="text"
            class="see-more-btn"
            :to="{ name: 'admin-calendar' }"
          >
            See More...
          </v-btn>
        </v-card>
        <v-card color="backgroundDarken" class="adminItem adminItemBig">
          <p>Engagement Breakdown by Classification</p>
        </v-card>
      </div>
      <div class="dashboard-row">
        <v-card color="backgroundDarken" class="adminItem adminItemSmall">
          <strong style="font-size: 20px; padding-bottom: 5px"
            >Notifications</strong
          >
          <div id="notifList" class="scrollable-content">
            <v-card
              v-for="(item, index) in notifications.slice(0, 3)"
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
          <v-btn
            variant="text"
            class="see-more-btn"
            :to="{ name: 'admin-notifications' }"
          >
            See More...
          </v-btn>
        </v-card>
        <v-card color="backgroundDarken" class="adminItem adminItemBig">
          <p>Percentage of students on track to complete their flight plan</p>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style>
.dashboard-wrapper {
  height: 85vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 20px;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  max-width: 95vw;
}

.dashboard-row {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  height: 45vh;
  padding: 1vh 1vw;
  border-radius: 25px;
  overflow: hidden;
}

.adminItemSmall {
  width: 35vw;
}

.adminItemBig {
  justify-content: center;
  align-items: center;
  width: 45vw;
}

.see-more-btn {
  text-align: center;
  width: 100%;
}

.notification {
  margin: 10px 5px 10px 5px;
  height: 6vh;
  width: 100%;
}
</style>
