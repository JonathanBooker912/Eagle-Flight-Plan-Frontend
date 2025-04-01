<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import notificationServices from "../../services/notificationServices";
import NotificationCard from "../../components/cards/NotificationCard.vue";

import { userStore } from "../../stores/userStore";
const route = useRoute();

const notifications = ref([]);
const selectedNotif = ref({});
const showsidebar = ref(false);

const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);
const store = userStore();

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

    console.log("Updated Notifications:", notifications.value); // Debugging: Check if notifications update
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

onMounted(() => {
  getNotifications();
});
</script>

<template>
  <v-card>
    <p>This is where the bar will go</p>
  </v-card>
  <v-row>
    <v-card color="backgroundDarken" class="adminItem">
      <strong style="font-size: 20px; padding-bottom: 5px">Flight Plan</strong>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem">
      <strong style="font-size: 20px; padding-bottom: 5px"
        >Notifications</strong
      >
      <NotificationCard
        v-for="(item, index) in notifications.splice(0, 5)"
        :key="index"
        :to="{ name: 'student-notifications' }"
        :notification="item"
        :class="{ unread: !item.read, read: item.read }"
        style="height: 10vh; border-color: white"
        @click="editItem(item)"
      />
    </v-card>
    <v-card color="backgroundDarken" class="adminItem">
      <strong style="font-size: 20px; padding-bottom: 5px">Calendar</strong>
    </v-card>
  </v-row>
</template>

<style>
.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 1%;
  height: 60vh;
  padding: 15px 0px 5px 0px;
  width: 25vw;
  text-align: center;

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
