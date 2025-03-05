<script setup>
import NotificationCard from "../../components/cards/NotificationCard.vue";
import notificationServices from "../../services/notificationServices";
import { onMounted, ref } from "vue";

const notifications = ref([]);
const isLoaded = ref(false);

const getNotifications = async () => {
  await notificationServices
    .getAllNotificationsForUser(1)
    .then((res) => {
      notifications.value = res.data;
      isLoaded.value = true;
      console.log(notifications);
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  getNotifications();
});
</script>

<template>
  <div class="background">
    <div id="notifList">
      <NotificationCard
        v-for="(item, index) in notifications"
        :key="index"
        :to="{ name: 'admin-notifications' }"
        class="notification"
        :notification="item"
      >
      </NotificationCard>
    </div>
  </div>
</template>

<style>
.background {
  height: 90vh;
  padding-left: 2vw;
  padding-right: 2vw;
}
</style>
