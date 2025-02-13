<script setup>
import { useRouter } from "vue-router";
import { userStore } from "../stores/userStore";

import "primeicons/primeicons.css";

const router = useRouter();
const store = userStore();

var admin = [
  {
    "route-name": "admin-profile",
    "link-text": "profile",
  },
  {
    "route-name": "admin-dash",
    "link-text": "dashboard",
  },
  {
    "route-name": "admin-flightPlan",
    "link-text": "flightPlan",
  },
  {
    "route-name": "admin-calendar",
    "link-text": "calendar",
  },
  {
    "route-name": "admin-notifications",
    "link-text": "notifications",
  },
  {
    "route-name": "admin-search",
    "link-text": "search",
  },
];

var faculty = [
  {
    "route-name": "faculty-profile",
    "link-text": "profile",
  },
  {
    "route-name": "faculty-dash",
    "link-text": "dashboard",
  },
  {
    "route-name": "faculty-flightPlan",
    "link-text": "flightPlan",
  },
  {
    "route-name": "faculty-calendar",
    "link-text": "calendar",
  },
  {
    "route-name": "faculty-notifications",
    "link-text": "notifications",
  },
  {
    "route-name": "faculty-search",
    "link-text": "search",
  },
];

var student = [
  {
    "route-name": "student-profile",
    "link-text": "profile",
  },
  {
    "route-name": "student-dash",
    "link-text": "dashboard",
  },
  {
    "route-name": "student-flightPlan",
    "link-text": "flightPlan",
  },
  {
    "route-name": "student-calendar",
    "link-text": "calendar",
  },
  {
    "route-name": "student-notifications",
    "link-text": "notifications",
  },
  {
    "route-name": "student-search",
    "link-text": "search",
  },
];

async function newNavSection(linkText) {
  unactive();

  const roleRoutes = {
    admin: admin,
    faculty: faculty,
    student: student,
  };

  // Await role checks
  const isAdmin = await store.isAdmin();
  const isFaculty = await store.isFaculty();

  const role = isAdmin ? "admin" : isFaculty ? "faculty" : "student";

  console.log("Determined role:", role);
  let baseRoute = `/${role}`;
  let routeToPush = roleRoutes[role].find(
    (route) => route["link-text"] === linkText,
  )?.["route-name"];

  if (routeToPush) {
    router.push({ name: routeToPush });
  } else {
    console.error("No matching route found for linkText:", linkText);
    router.push({ path: baseRoute });
  }

  //document.getElementById('profile').classList.add('active');
  //document.getElementById('profile').style = 'border-top-right-radius: 25px; border-top-left-radius: 25px;'
}

async function unactive() {
  let x = document.getElementsByClassName("active"); // Find nav bar active item
  for (let item of x) {
    item.classList.remove("active");
  }
}
</script>

<template>
  <div class="userNav">
    <div
      id="profile"
      class="navOption profile"
      @click="newNavSection('profile')"
    >
      <i class="pi pi-user"></i>
      <p>Profile</p>
    </div>
    <div id="dash" class="navOption dash" @click="newNavSection('dash')">
      <i class="pi pi-th-large"></i>
      <p>Dashboard</p>
    </div>
    <div
      id="flightPlan"
      class="navOption flightPlan"
      @click="newNavSection('flightPlan')"
    >
      <i class="pi pi-telegram"></i>
      <p>Flight Plan</p>
    </div>
    <div
      id="calendar"
      class="navOption calendar"
      @click="newNavSection('calendar')"
    >
      <i class="pi pi-calendar"></i>
      <p>Calendar</p>
    </div>
    <div
      id="notifs"
      class="navOption notifs"
      @click="newNavSection('notifications')"
    >
      <i class="pi pi-bell"></i>
      <p>Notifications</p>
    </div>
    <div id="search" class="navOption search" @click="newNavSection('search')">
      <i class="pi pi-search"></i>
      <p>Search</p>
    </div>
    <div
      id="logout"
      class="navOption logout"
      style="margin-top: auto"
      @click="newNavSection()"
    >
      <i class="pi pi-sign-out"></i>
      <p>Logout</p>
    </div>
  </div>
</template>

<style>
.userNav {
  width: 60px; /* Default collapsed width */
  margin: 2% 0% 4% 1%;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;

  background-color: #ddd;
  transition: width 0.5s;
  display: flex;
  flex-direction: column;
  height: 98vh;
}

.userNav:hover {
  width: 250px; /* Expanded width */
}

.navOption {
  display: flex;
  align-items: center;
  padding: 10px;
  white-space: nowrap; /* Prevents text wrapping */
}

.navOption p {
  color: #242424;
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
  color: #000;
}

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
}

@media screen and (min-width: 1px) and (max-width: 500px) {
  .userNav {
    width: 100vh; /* Default collapsed width */
    height: 60px;
    margin: 2% 0% 4% 1%;
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;

    background-color: #ddd;
    transition: width 0.5s;
    display: flex;
    flex-direction: row;
  }
}
</style>
