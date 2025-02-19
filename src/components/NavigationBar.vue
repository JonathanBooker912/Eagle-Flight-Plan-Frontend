<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "../stores/userStore"; // Adjust this import based on your store path

const admin = [
  { "route-name": "admin-profile", "link-text": "profile" },
  { "route-name": "admin-dashboard", "link-text": "dashboard" },
  { "route-name": "admin-flightPlan", "link-text": "flightPlan" },
  { "route-name": "admin-calendar", "link-text": "calendar" },
  { "route-name": "admin-notifications", "link-text": "notifications" },
  { "route-name": "admin-search", "link-text": "search" },
];

const faculty = [
  { "route-name": "faculty-profile", "link-text": "profile" },
  { "route-name": "faculty-dashboard", "link-text": "dashboard" },
  { "route-name": "faculty-flightPlan", "link-text": "flightPlan" },
  { "route-name": "faculty-calendar", "link-text": "calendar" },
  { "route-name": "faculty-notifications", "link-text": "notifications" },
  { "route-name": "faculty-search", "link-text": "search" },
];

const student = [
  { "route-name": "student-profile", "link-text": "profile" },
  { "route-name": "student-dashboard", "link-text": "dashboard" },
  { "route-name": "student-flightPlan", "link-text": "flightPlan" },
  { "route-name": "student-calendar", "link-text": "calendar" },
  { "route-name": "student-notifications", "link-text": "notifications" },
  { "route-name": "student-search", "link-text": "search" },
];

const role = ref("");

onMounted(async () => {
  const store = userStore();

  // Await role checks
  const isAdmin = await store.isAdmin();
  const isFaculty = await store.isFaculty();

  role.value = isAdmin ? "admin" : isFaculty ? "faculty" : "student";

  console.log(role.value);
});

const getIcon = (linkText) => {
  const icons = {
    profile: "pi pi-user",
    dashboard: "pi pi-home",
    flightPlan: "pi pi-plane",
    calendar: "pi pi-calendar",
    notifications: "pi pi-bell",
    search: "pi pi-search",
  };
  return icons[linkText] || "pi pi-circle"; // Default icon if none matched
};
</script>

<template>
  <v-container class="d-flex flex-column pa-2 userNav" color="secondary">
    <v-list v-if="role === 'admin'" class="pa-0">
      <v-list-item-group v-for="(item, index) in admin" :key="index">
        <v-list-item :to="{ name: item['route-name'] }" color="secondary">
          <v-list-item-avatar>
            <v-icon color="text">{{ getIcon(item["link-text"]) }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="text-body-1 font-weight-bold"
              color="text"
            >
              <p>{{ item["link-text"] }}</p>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list v-if="role === 'faculty'" class="pa-0">
      <v-list-item-group v-for="(item, index) in faculty" :key="index">
        <v-list-item :to="{ name: item['route-name'] }" color="secondary">
          <v-list-item-avatar>
            <v-icon color="text">{{ getIcon(item["link-text"]) }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="text-body-1 font-weight-bold"
              color="text"
            >
              <p>{{ item["link-text"] }}</p>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list v-if="role === 'student'" class="pa-0" color="primary">
      <v-list-item-group v-for="(item, index) in student" :key="index">
        <v-list-item :to="{ name: item['route-name'] }" color="secondary">
          <v-list-item-avatar>
            <v-icon color="text">{{ getIcon(item["link-text"]) }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              class="text-body-1 font-weight-bold"
              color="text"
            >
              <p>{{ item["link-text"] }}</p>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<style scoped>
.userNav {
  width: 60px;
  height: 98vh;
  transition: width 0.5s;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
}

.userNav:hover {
  width: 250px;
}

.navOption {
  display: flex;
  align-items: center;
  padding: 10px;
  white-space: nowrap;
}

.navOption p {
  font-size: 20px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.5s;
}

.userNav:hover .navOption p {
  opacity: 1;
}

.pi {
  padding-left: 5px;
  font-weight: 700;
  font-size: 30px;
  margin: 5px 15px 10px 0px;
}

/*
.active {
  background-color: #ccc !important;
}

.active p {
  color: #294965 !important;
}
.active i {
  color: #294965 !important;
}

.pi.active {
  color: #294965 !important;
} */

@media screen and (max-width: 500px) {
  .userNav {
    width: 100vh;
    height: 60px;
    flex-direction: row;
  }
}
</style>
