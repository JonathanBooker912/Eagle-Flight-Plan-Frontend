<script setup>
import eventServices from "../../services/eventServices";
import notificationServices from "../../services/notificationServices";
import flightPlanServices from "../../services/flightPlanServices";
import studentServices from "../../services/studentServices";
import EventCard from "../../components/cards/EventCard.vue";
import { userStore } from "../../stores/userStore";
import { onMounted, ref } from "vue";
import { useNotificationStore } from "../../stores/notificationStore";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "vue-chartjs";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
);

const events = ref([]);
const notifications = ref([]);
const isLoaded = ref(false);
const store = userStore();
const notifStore = useNotificationStore();
const currentPage = ref(1);
const pageSize = ref(14);
const totalPages = ref(1);

// Chart data
const engagementData = ref({
  labels: ["Freshman", "Sophomore", "Junior", "Senior"],
  datasets: [
    {
      label: "Completed Flight Plan Items",
      data: [0, 0, 0, 0],
      backgroundColor: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderWidth: 1,
    },
  ],
});

const onTrackData = ref({
  labels: ["Freshman", "Sophomore", "Junior", "Senior"],
  datasets: [
    {
      label: "Students On Track (%)",
      data: [0, 0, 0, 0],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Engagement by Classification",
    },
  },
};

const onTrackOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Students On Track by Classification",
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.dataset.label || "";
          const value = context.raw;
          return `${label}: ${value}%`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: "Percentage",
      },
      ticks: {
        callback: function (value) {
          return value + "%";
        },
      },
    },
  },
};

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
  } catch (err) {
    console.error("Error fetching notifications:", err);
  }
};

const fetchEngagementData = async () => {
  try {
    const studentsResponse = await studentServices.getAllStudents();
    console.log("Students Response:", studentsResponse);
    const students = studentsResponse.data.rows || []; // Access the rows property

    // Initialize counters for each classification
    const classificationCounts = {
      Freshman: 0,
      Sophomore: 0,
      Junior: 0,
      Senior: 0,
    };

    // Count students in each classification based on semestersFromGrad
    students.forEach((student) => {
      console.log("Student:", student);
      if (student.semestersFromGrad >= 8) classificationCounts.Freshman++;
      else if (student.semestersFromGrad >= 6) classificationCounts.Sophomore++;
      else if (student.semestersFromGrad >= 4) classificationCounts.Junior++;
      else classificationCounts.Senior++;
    });

    console.log("Classification Counts:", classificationCounts);
    // Update chart data
    engagementData.value.datasets[0].data = Object.values(classificationCounts);
    console.log("Updated Engagement Data:", engagementData.value);
  } catch (err) {
    console.error("Error fetching engagement data:", err);
  }
};

const fetchOnTrackData = async () => {
  try {
    const studentsResponse = await studentServices.getAllStudents();
    console.log("Students Response for On Track:", studentsResponse);
    const students = studentsResponse.data.rows || []; // Access the rows property

    // Initialize counters for each classification
    const onTrackCounts = {
      Freshman: { total: 0, onTrack: 0 },
      Sophomore: { total: 0, onTrack: 0 },
      Junior: { total: 0, onTrack: 0 },
      Senior: { total: 0, onTrack: 0 },
    };

    // Process each student
    for (const student of students) {
      console.log("Processing Student:", student);
      let classification = "Senior";
      if (student.semestersFromGrad >= 8) classification = "Freshman";
      else if (student.semestersFromGrad >= 6) classification = "Sophomore";
      else if (student.semestersFromGrad >= 4) classification = "Junior";

      onTrackCounts[classification].total++;

      try {
        const flightPlanResponse =
          await flightPlanServices.getFlightPlanForStudent(student.id);
        console.log("Flight Plan Response:", flightPlanResponse);
        const flightPlans = flightPlanResponse.data;

        if (flightPlans.length > 0) {
          const progressResponse =
            await flightPlanServices.getFlightPlanProgressForFlightPlan(
              flightPlans[0].id,
            );
          console.log("Progress Response:", progressResponse);
          const progress = progressResponse.data.progress;
          console.log(`Student ${student.id} progress: ${progress}%`);
          console.log("Full Progress Data:", progressResponse.data);
          if (progress >= 70) {
            // Consider 70% or above as on track
            onTrackCounts[classification].onTrack++;
          }
        }
      } catch (err) {
        console.error(`Error processing student ${student.id}:`, err);
      }
    }

    console.log("On Track Counts:", onTrackCounts);
    // Calculate percentages and update chart data
    onTrackData.value.datasets[0].data = Object.entries(onTrackCounts).map(
      ([_, counts]) =>
        counts.total > 0
          ? Math.round((counts.onTrack / counts.total) * 100)
          : 0,
    );
    console.log("Updated On Track Data:", onTrackData.value);
  } catch (err) {
    console.error("Error fetching on-track data:", err);
  }
};

const openNotification = (x) => {
  notifStore.setActiveNotification(x);
};

onMounted(() => {
  getEvents();
  getNotifications();
  fetchEngagementData();
  fetchOnTrackData();
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
          <Pie
            :data="engagementData"
            :options="chartOptions"
            style="height: 100%; width: 100%"
          />
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
          <Bar
            :data="onTrackData"
            :options="onTrackOptions"
            style="height: 100%; width: 100%"
          />
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
