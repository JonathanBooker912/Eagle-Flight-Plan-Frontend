<script setup>
import { onMounted, ref } from "vue";
import notificationServices from "../../services/notificationServices";
import flightPlanServices from "../../services/flightPlanServices";
import eventServices from "../../services/eventServices";
import studentServices from "../../services/studentServices";
import NotificationCard from "../../components/cards/NotificationCard.vue";
import FlightPlanItemCard from "../../components/cards/FlightPlanItemCard.vue";
import EventCard from "../../components/cards/EventCard.vue";
import { userStore } from "../../stores/userStore";
import { useNotificationStore } from "../../stores/notificationStore";
import { useFlightPlanStore } from "../../stores/flightPlanStore";

const notifications = ref([]);
const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);
const store = userStore();
const notifStore = useNotificationStore();
const flightPlanStore = useFlightPlanStore();
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

    flightPlans.value = response.data.map((flightPlan) => {
      if (!flightPlan.semester) {
        return {
          label: "Unknown Semester",
          value: flightPlan.id,
        };
      }
      return {
        label: `${flightPlan.semester.term.charAt(0).toUpperCase() + flightPlan.semester.term.slice(1)} ${flightPlan.semester.year}`,
        value: flightPlan.id,
      };
    });

    if (flightPlans.value.length > 0) {
      selectedFlightPlan.value = flightPlans.value[0];
      flightPlanItems.value = response.data[0].flightPlanItems
        .filter((item) => item.status === "Incomplete")
        .slice(0, 3);
      await fetchFlightPlanProgress();
    }
  } catch (err) {
    console.error("Error fetching flight plan:", err);
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
  } catch (err) {
    console.error("Error fetching flight plan progress:", err);
  }
};

const getEvents = async () => {
  await eventServices
    .getAllEvents()
    .then((res) => {
      events.value = res.data.events.slice(0, 3);
      isLoaded.value = true;
    })
    .catch((err) => console.error(err));
};

const openNotification = (x) => {
  notifStore.setActiveNotification(x);
};

const openFlightPlanItem = (item) => {
  flightPlanStore.setActiveFlightPlanItem(item);
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
  <div class="dashboard-container">
    <h1 class="mt-1">Welcome, {{ store.user.fullName }}!</h1>
    <v-row justify="center" class="mr-2">
      <v-col cols="12">
        <v-card color="backgroundDarken">
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

    <div class="dashboard-grid">
      <v-card color="backgroundDarken" class="dashboard-cell">
        <strong style="font-size: 24px; text-align:center; margin-left: 10px">Flight Plan</strong>
        <div id="flightPlanList">
          <FlightPlanItemCard
            v-for="(item, index) in flightPlanItems"
            :key="index"
            :flight-plan-item="item"
            class="flightPlanItem"
            color="background"
            :to="{ name: 'student-flightPlan' }"
            :is-flight-plan-view="false"
            @click="openFlightPlanItem(item)"
          />
        </div>
        <v-btn
          class="see-more-btn"
          variant="text"
          :to="{ name: 'student-flightPlan' }"
        >
          See More Flight Plan Items
        </v-btn>
      </v-card>
      <v-card color="backgroundDarken" class="dashboard-cell">
        <strong style="font-size: 24px; text-align:center; margin-left: 10px">
          Notifications
        </strong>
        <div id="notifList">
          <NotificationCard
            v-for="(item, index) in notifications.slice(0, 5)"
            :key="index"
            :to="{ name: 'student-notifications' }"
            :notification="item"
            class="notification"
            @click="openNotification(item.id)"
          />
        </div>
        <v-btn
          class="see-more-btn"
          variant="text"
          :to="{ name: 'student-notifications' }"
        >
          See More Notifications
        </v-btn>
      </v-card>
      <v-card color="backgroundDarken" class="dashboard-cell">
        <strong style="font-size: 24px; text-align:center; margin-left: 10px">Calendar</strong>
        <div id="eventList">
          <EventCard
            v-for="(event, index) in events"
            :key="index"
            :event="event"
            class="event"
            :to="{ name: 'student-calendar' }"
          />
        </div>
        <v-btn
          class="see-more-btn"
          variant="text"
          :to="{ name: 'student-calendar' }"
        >
          See More Events
        </v-btn>
      </v-card>
    </div>
  </div>
</template>

<style>
.dashboard-container {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding: 0vh 1vw;
}

.dashboard-grid {
  display: flex;
  gap: 10px;
  padding: 0 20px 0 0;
  flex: 1;
  margin-top: 10px;
}

.dashboard-cell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 10px 5px 5px 5px;
  border-radius: 25px;
}

.dashboard-cell:first-child {
  padding-left: 0;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.see-more-btn {
  margin-top: auto;
  text-align: center;
  width: 100%;
}

#notifList,
#flightPlanList,
#calendarList {
  flex: 1;
  overflow: hidden;
  margin-bottom: 10px;
}

.notification {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}

.flightPlanItem {
  margin: 0px 10px 0px 10px;
  height: 17vh;
  width: 100%;
}

.calendarItem {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}
</style>
