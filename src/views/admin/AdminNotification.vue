<script setup>
import NotificationCard from "../../components/cards/NotificationCard.vue";
import notificationServices from "../../services/notificationServices";
import apiClient from "../../services/services";
import { onMounted, ref } from "vue";
import moment from "moment";

const notifications = ref([]);
const selectedNotif = ref({});
const isLoaded = ref(false);
const showsidebar = ref(false);

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

const formattedDateTime = (item) => {
  return moment(item.dateTime).format("MM/DD/YYYY hh:mm A");
};

onMounted(() => {
  getNotifications();
});

const editItem = async (item) => {
  item.read = true;
  selectedNotif.value = item;
  showsidebar.value = true;
  const response = await apiClient.put(`/notification/${item.id}`, {
    read: true,
  });
};
</script>

<template>
  <v-card class="background" color="backgroundDarken">
    <div class="container">
      <div class="notifContainer">
        <h1>Notifications</h1>
        <div id="notifList">
          <NotificationCard
            v-for="(item, index) in notifications"
            :key="index"
            :to="{ name: 'admin-notifications' }"
            :notification="item"
            :class="{ unread: !item.read, read: item.read }"
            @click="editItem(item)"
          >
          </NotificationCard>
        </div>
      </div>
      <v-card v-if="showsidebar" class="infoSidebar" color="background">
        <strong class="header">{{ selectedNotif.header }}</strong>
        <v-btn
          icon
          @click="showsidebar = false"
          class="close-btn"
          aria-label="Close Sidebar"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <p>
          Sent By: {{ selectedNotif.user.fName }} {{ selectedNotif.user.lName }}
        </p>
        <p>Sent On: {{ formattedDateTime(selectedNotif.createdAt) }}</p>
        <p></p>
        <p>
          ------------------------------------------------------------------------
        </p>
        <p class="description">{{ selectedNotif.description }}</p>
      </v-card>
    </div>
  </v-card>
</template>

<style>
.container {
  display: flex;
  height: 90vh;
  margin-top: 2%;
}

.notifContainer {
  flex: 1;
  padding-left: 2vw;
  padding-right: 2vw;
}

.header {
  font-size: 24px;
}

.description {
  font-size: 18px;
}
.infoSidebar {
  width: 40vw;
  margin: 2vh 2vw 2vh 2vw;
  flex-shrink: 0;
  padding: 10px 15px;
  border-radius: 25px;
}

.close-btn {
  position: fixed;
  top: 50px; /* Adjust as needed */
  right: 40px; /* Right-aligned */
  z-index: 9999; /* Make sure it stays above the content */
}
</style>
