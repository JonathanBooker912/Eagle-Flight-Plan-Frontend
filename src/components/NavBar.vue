<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { userStore } from "../stores/userStore"; // Adjust this import based on your store path

const admin = [
  { "route-name": "admin-profile", "link-text": "Profile" },
  { "route-name": "admin", "link-text": "Dashboard" },
  { "route-name": "admin-calendar", "link-text": "Calendar" },
  { "route-name": "admin-notifications", "link-text": "Notifications" },
  { "route-name": "maintenance", "link-text": "Maintenance" },
  { "route-name": "admin-search", "link-text": "Search" },
];

const faculty = [
  { "route-name": "faculty-profile", "link-text": "Profile" },
  { "route-name": "faculty", "link-text": "Dashboard" },
  { "route-name": "faculty-flightPlan", "link-text": "Flight Plan" },
  { "route-name": "faculty-calendar", "link-text": "Calendar" },
  { "route-name": "faculty-notifications", "link-text": "Notifications" },
  { "route-name": "faculty-search", "link-text": "Search" },
];

const student = [
  { "route-name": "student-profile", "link-text": "Profile" },
  { "route-name": "student", "link-text": "Dashboard" },
  { "route-name": "student-flightPlan", "link-text": "Flight Plan" },
  { "route-name": "student-calendar", "link-text": "Calendar" },
  { "route-name": "student-notifications", "link-text": "Notifications" },
  { "route-name": "student-search", "link-text": "Search" },
];

const role = ref("");
const route = useRoute();
const userId = ref(null);

onMounted(async () => {
  const store = userStore();

  const isAdmin = await store.isAdmin();
  const isFaculty = await store.isFaculty();

  // Set the initial role based on authentication and role checks
  role.value = isAdmin ? "admin" : isFaculty ? "faculty" : "student";

  // Get the user ID from the store (assuming it's available)
  userId.value = store.user.userId; // Replace with the actual method to get user ID from store

  // Override role if the path explicitly starts with '/admin', '/faculty', or '/student'
  if (route.path.startsWith("/admin")) {
    role.value = "admin";
  } else if (route.path.startsWith("/faculty")) {
    role.value = "faculty";
  } else if (route.path.startsWith("/student")) {
    role.value = "student";
  }
});

const getIcon = (linkText) => {
  const icons = {
    Profile: "mdi-account",
    Dashboard: "mdi-view-dashboard",
    "Flight Plan": "mdi-airplane",
    Calendar: "mdi-calendar",
    Notifications: "mdi-bell",
    Search: "mdi-magnify",
    Maintenance: "mdi-cog",
  };

  return icons[linkText] || "mdi-circle"; // Default if not found
};
</script>

<template>
  <v-container class="d-flex flex-column pa-2 userNav bg-secondary">
    <v-list v-if="role === 'admin'" class="pa-0">
      <v-list-item-group v-for="(item, index) in admin" :key="index">
        <v-list-item
          :to="
            item.link - text === 'Profile'
              ? { name: item['route-name'], params: { id: userId } }
              : { name: item['route-name'] }
          "
          class="bg-secondary"
          exact
        >
          <v-list-item-content>
            <v-list-item-title
              class="text-body-1 font-weight-bold"
              color="text"
            >
              <div class="nav-item-content">
                <v-icon :size="32" color="backgroundDarken" class="mr-2">
                  {{ getIcon(item["link-text"]) }}
                </v-icon>
                <span class="nav-text" color="backgroundDarken">{{
                  item["link-text"]
                }}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list v-if="role === 'faculty'" class="pa-0">
      <v-list-item-group v-for="(item, index) in faculty" :key="index">
        <v-list-item
          :to="
            item.link - text === 'Profile'
              ? { name: item['route-name'], params: { id: userId } }
              : { name: item['route-name'] }
          "
          class="bg-secondary"
          exact
        >
          <v-list-item-content>
            <v-list-item-title
              class="text-body-1 font-weight-bold"
              color="text"
            >
              <div class="nav-item-content">
                <v-icon :size="32" :color="text" class="mr-2">
                  {{ getIcon(item["link-text"]) }}
                </v-icon>
                <span class="nav-text" :color="text">{{
                  item["link-text"]
                }}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <v-list v-if="role === 'student'" class="pa-0">
      <v-list-item-group v-for="(item, index) in student" :key="index">
        <v-list-item
          :to="
            item.link - text === 'Profile'
              ? { name: item['route-name'], params: { id: userId } }
              : { name: item['route-name'] }
          "
          class="bg-secondary"
          exact
        >
          <v-list-item-content>
            <v-list-item-title
              class="text-body-1 font-weight-bold"
              color="text"
            >
              <div class="nav-item-content">
                <v-icon :size="32" :color="text" class="mr-2">
                  {{ getIcon(item["link-text"]) }}
                </v-icon>
                <span class="nav-text" :color="text">{{
                  item["link-text"]
                }}</span>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<style>
/* Styling for the navigation bar */
.userNav .nav-item-content {
  display: flex;
  align-items: center;
}

.userNav .nav-text {
  display: none;
}

.userNav:hover .nav-text {
  display: inline;
}

.userNav {
  width: 80px;
  height: 98vh;
  transition: width 0.5s;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
  margin: 2vh 2vh 0vh 2vh;
}

.userNav:hover {
  width: 200px;
  align-items: left;
}

.navOption {
  display: flex;
  align-items: center;
  margin: 3vh;
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

@media screen and (max-width: 500px) {
  .userNav {
    width: 100vh;
    height: 60px;
    flex-direction: row;
  }
}
</style>
