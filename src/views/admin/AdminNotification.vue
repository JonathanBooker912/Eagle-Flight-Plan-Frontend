<script setup>
import NotificationCard from "../../components/cards/NotificationCard.vue";
import notificationServices from "../../services/notificationServices";
import apiClient from "../../services/services";
import { onMounted, ref } from "vue";
import moment from "moment";

const notifications = ref([]);
const selectedNotif = ref({});
const showsidebar = ref(false);

const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);

const getNotifications = async (page = 1) => {
  try {
    const res = await notificationServices.getAllNotificationsForUser(
      11,
      page,
      pageSize.value,
    );

    notifications.value.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    notifications.value = res.data.notifications; // Update the notifications array
    totalPages.value = Math.ceil(res.data.total / pageSize.value);
    currentPage.value = page; // Ensure currentPage updates correctly

    console.log("Updated Notifications:", notifications.value); // Debugging: Check if notifications update
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

const nextPage = () => {
  console.log("Page going next");
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    getNotifications(currentPage.value);
  }
};

const prevPage = () => {
  console.log("Page going back");
  if (currentPage.value > 1) {
    currentPage.value--;
    getNotifications(currentPage.value);
  }
};

const formattedDateTime = (item) => {
  return moment(item.dateTime).format("MM/DD/YYYY hh:mm A");
};

onMounted(() => {
  getNotifications();
});
const editItem = async (item) => {
  try {
    const response = await apiClient.put(
      `/notification/user/${item.userId}/notification/${item.id}`,
      {
        read: true, // or other data you want to update
      },
    );

    console.log("API Response:", response);

    if (response.status === 200) {
      item.read = true; // Update the notification locally after successful API call
      console.log("Notification marked as read:", item);
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

    <v-row justify="center" align="center" class="pagination">
      <v-btn
        @click="prevPage"
        :disabled="currentPage === 1"
        color="primary"
        class="mx-2"
      >
        Prev
      </v-btn>
      <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
      <v-btn
        @click="nextPage"
        :disabled="currentPage === totalPages"
        color="primary"
        class="mx-2"
      >
        Next
      </v-btn>
    </v-row>
  </v-card>
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
