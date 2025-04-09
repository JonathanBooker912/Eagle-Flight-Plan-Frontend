<script setup>
import { onMounted, ref, watch } from "vue";
import NotificationCard from "../components/cards/NotificationCard.vue";
import notificationServices from "../services/notificationServices";
import apiClient from "../services/services";
import moment from "moment";
import { userStore } from "../stores/userStore";
import { useNotificationStore } from "../stores/notificationStore";

const notifications = ref([]);
const selectedNotif = ref({});
const showsidebar = ref(false);
const noNotifications = ref(false);

const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);
const store = userStore();
const notifStore = useNotificationStore();

const getNotifications = async (page = 1) => {
  try {
    const res = await notificationServices.getAllNotificationsForUser(
      store.user.userId,
      page,
      pageSize.value,
    );

    if (!res.data.notifications || res.data.notifications.length === 0) {
      noNotifications.value = true;
      return;
    }
    notifications.value = res.data.notifications;
    // Update the notifications array
    totalPages.value = Math.ceil(res.data.total / pageSize.value);
    currentPage.value = page; // Ensure currentPage updates correctly
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

// Watcher for pagination changes
watch(currentPage, (newPage) => {
  getNotifications(newPage);
});

onMounted(async () => {
  await getNotifications();

  // Check if a notification was set in the store
  if (notifStore.activeNotification) {
    var chosenNotif = null;
    for (const notif of notifications.value) {
      if (notif.id === notifStore.activeNotification) {
        chosenNotif = notif;
        break;
      }
    }

    if (chosenNotif) {
      chosenNotif.read = true;
      selectedNotif.value = chosenNotif;
      showsidebar.value = true;
    } else {
    }
  } else {
  }
});

const formattedDateTime = (item) => {
  return moment(item.dateTime).format("MM/DD/YYYY hh:mm A");
};

const editItem = async (item) => {
  try {
    const response = await apiClient.put(
      `/notification/user/${store.user.userId}/notification/${item.id}`,
      { read: true },
    );

    if (response.status === 200) {
      item.read = true; // Update the notification locally after successful API call
    } else {
      console.error("Failed to update notification:", response);
    }
  } catch (error) {
    console.error("Error updating notification:", error);
  }

  selectedNotif.value = item;
  showsidebar.value = true;
};
</script>

<template>
  <div class="container">
    <div class="notifContainer">
      <h1>Notifications</h1>
      <v-card
        class="adminItem"
        color="background"
        v-if="!noNotifications"
        id="notifList"
      >
        <NotificationCard
          v-for="(item, index) in notifications"
          :key="index"
          :to="{ name: 'admin-notifications' }"
          :notification="item"
          :class="{ unread: !item.read, read: item.read }"
          @click="editItem(item)"
        />
      </v-card>
      <div v-else class="adminItem" color="background">
        <h3>No Notifications!</h3>
        <p>Complete some flight plan items to be notified!</p>
      </div>
    </div>

    <v-card v-if="showsidebar" class="infoSidebar" color="backgroundDarken">
      <strong class="header">{{ selectedNotif.header }}</strong>
      <v-btn
        icon
        class="close-btn"
        aria-label="Close Sidebar"
        @click="showsidebar = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <p>
        Sent By: {{ selectedNotif.user.fName }} {{ selectedNotif.user.lName }}
      </p>
      <p>Sent On: {{ formattedDateTime(selectedNotif.createdAt) }}</p>
      <p>
        ------------------------------------------------------------------------
      </p>
      <p class="description">{{ selectedNotif.description }}</p>
    </v-card>
  </div>

  <v-row justify="center" align="center" class="pagination">
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      :total-visible="5"
    ></v-pagination>
  </v-row>
</template>

<style>
.container {
  display: flex;
  height: 90vh;
  margin-top: 2%;
  overflow-y: auto;
  overflow-x: auto;
}

.notifContainer {
  flex: 1;
  padding-left: 2vw;
  padding-right: 2vw;
  overflow-y: auto;
  overflow-x: auto;
}

.header {
  font-size: 24px;
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
