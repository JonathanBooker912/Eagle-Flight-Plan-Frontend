<script setup>
import { onMounted, ref } from "vue";
import notificationServices from "../../services/notificationServices";
import NotificationCard from "../../components/cards/NotificationCard.vue";
import { userStore } from "../../stores/userStore";

const notifications = ref([]);
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

    notifications.value = res.data.notifications;
    console.log(notifications.value);
    totalPages.value = Math.ceil(res.data.total / pageSize.value);
    currentPage.value = page;
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
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <strong style="font-size: 20px; padding-bottom: 5px">
        Notifications
      </strong>
      <div id="notifList">
        <NotificationCard
          v-for="(item, index) in notifications.slice(0, 4)"
          :key="index"
          :to="{ name: 'student-notifications' }"
          class="notification"
          color="background"
          @click="openNotification(item.id)"
        />
      </div>
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
