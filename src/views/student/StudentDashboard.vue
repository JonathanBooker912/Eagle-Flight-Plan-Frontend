<script setup>
import { onMounted, ref } from "vue";
import notificationServices from "../../services/notificationServices";
import flightPlanServices from "../../services/flightPlanServices";
import flightPlanItemServices from "../../services/flightPlanItemServices";
import eventServices from "../../services/eventServices";
import studentServices from "../../services/studentServices";
import NotificationCard from "../../components/cards/NotificationCard.vue";
import FlightPlanItemCard from "../../components/cards/FlightPlanItemCard.vue";
import EventCard from "../../components/cards/EventCard.vue";
import { userStore } from "../../stores/userStore";
import { useNotificationStore } from "../../stores/notificationStore";

const notifications = ref([]);
const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);
const store = userStore();
const notifStore = useNotificationStore();
const progress = ref(0);
const points = ref(0);
const selectedFlightPlan = ref(null);
const flightPlans = ref([]);
const flightPlanItems = ref([]);
const events = ref([]);
const isLoaded = ref(false);

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
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

const fetchStudent = async () => {
  try {
    const studentResponse = await studentServices.getStudentForUserId(
      store.user.userId,
    );
    const pointsResponse = await studentServices.getPoints(
      studentResponse.data.id,
    );
    points.value = pointsResponse.data.points;
  } catch (err) {
    console.error("Error fetching student data:", err);
  }
};

const fetchFlightPlan = async () => {
  try {
    const studentResponse = await studentServices.getStudentForUserId(
      store.user.userId,
    );
    const response = await flightPlanServices.getFlightPlanForStudent(
      studentResponse.data.id,
    );

    flightPlans.value = response.data.map((flightPlan) => ({
      label: `${flightPlan.semester.term.charAt(0).toUpperCase() + flightPlan.semester.term.slice(1)} ${flightPlan.semester.year}`,
      value: flightPlan.id,
    }));

    if (flightPlans.value.length > 0) {
      selectedFlightPlan.value = flightPlans.value[0];
      await fetchFlightPlanProgress();
    }
  } catch (err) {
    console.error("Error fetching flight plan:", err);
  }
};

const fetchFlightPlanItems = async () => {
  if (!selectedFlightPlan.value) return;

  try {
    const response =
      await flightPlanItemServices.getAllFlightPlanItemsForFlightPlan(
        selectedFlightPlan.value.value,
        {
          page: 1,
          pageSize: 3,
          searchQuery: "",
          filters: {},
        },
      );
    flightPlanItems.value = response.data.flightPlanItems;
  } catch (err) {
    console.error("Error fetching flight plan items:", err);
  }
};

const fetchFlightPlanProgress = async () => {
  if (!selectedFlightPlan.value) return;

  try {
    const response =
      await flightPlanServices.getFlightPlanProgressForFlightPlan(
        selectedFlightPlan.value.value,
      );
    progress.value = response.data.progress;
    await fetchFlightPlanItems();
  } catch (err) {
    console.error("Error fetching flight plan progress:", err);
  }
};

const getEvents = async () => {
  await eventServices
    .getAllEvents()
    .then((res) => {
      events.value = res.data.events;
      isLoaded.value = true;
    })
    .catch((err) => console.error(err));
};
const openNotification = (x) => {
  notifStore.setActiveNotification(x);
};

onMounted(async () => {
  await Promise.all([
    getNotifications(),
    fetchStudent(),
    fetchFlightPlan(),
    getEvents(),
  ]);
});
</script>

<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card color="backgroundDarken" class="mb-4">
        <v-card-title class="text-h5">Flight Plan Progress</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedFlightPlan"
            :items="flightPlans"
            :item-title="(item) => item.label"
            :item-value="(item) => item.value"
            variant="solo"
            bg-color="background"
            return-object
            class="mb-4"
            density="comfortable"
            flat
            @update:model-value="fetchFlightPlanProgress"
          ></v-select>
          <v-progress-linear
            v-model="progress"
            color="primary"
            bg-color="backgroundLighten"
            height="20"
            rounded
          >
            <strong>{{ progress }}%</strong>
          </v-progress-linear>
          <div class="text-center mt-2">
            <span class="text-subtitle-1">Available Points: {{ points }}</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-row>
    <v-card color="backgroundDarken" class="adminItem">
      <strong style="font-size: 20px; padding-bottom: 5px">Flight Plan</strong>
      <div id="flightPlanList">
        <FlightPlanItemCard
          v-for="(item, index) in flightPlanItems"
          :key="index"
          :flight-plan-item="item"
          class="flightPlanItem"
          color="background"
        />
      </div>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem">
      <strong style="font-size: 20px; padding-bottom: 5px">
        Notifications
      </strong>
      <div id="notifList">
        <NotificationCard
          v-for="(item, index) in notifications.slice(0, 5)"
          :key="index"
          :to="{ name: 'student-notifications' }"
          :notification="item"
          class="notification"
          color="background"
          @click="openNotification(item.id)"
        />
      </div>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem">
      <strong style="font-size: 20px; padding-bottom: 5px">Calendar</strong>
      <div id="eventList">
        <EventCard
          v-for="(item, index) in events.splice(0, 3)"
          :key="index"
          :event="item"
          :isEventViewing="false"
          :to="{ name: 'student-calendar' }"
        ></EventCard>
      </div>
    </v-card>
  </v-row>
</template>

<style>
.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 1%;
  height: 65vh;
  padding: 15px 0px 5px 0px;
  width: 29vw;
  text-align: center;
  border-radius: 25px;
}

.notification {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 10vh;
  width: 100%;
}

.flightPlanItem {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}

.event {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}

#flightPlanList {
  overflow-y: auto;
  height: 100%;
  padding: 0 10px;
}

#eventList {
  overflow-y: auto;
  height: 100%;
  padding: 0 10px;
}
</style>
