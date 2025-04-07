import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import TasksPage from "../views/admin/task/TasksPage.vue";
import EventCardPage from "../views/admin/EventsPage.vue";
import EventAddEditPage from "../views/admin/event/EventAddEditPage.vue";
import { userStore } from "../stores/userStore";
import NotFound from "../views/NotFound.vue";
import Unauthorized from "../views/Unauthorized.vue";
import TaskAddEditPage from "../views/admin/task/TaskAddEditPage.vue";
import BadgesPage from "../views/admin/badge/BadgesPage.vue";
import BadgeAddEditPage from "../views/admin/badge/BadgeAddEditPage.vue";
import ExperienceAddEditPage from "../views/admin/experience/ExperienceAddEditPage.vue";
import ExperiencesPage from "../views/admin/ExperiencesPage.vue";
import RewardPage from "../views/admin/reward/RewardPage.vue";
import RewardAddEditPage from "../views/admin/reward/RewardAddEditPage.vue";
import RewardRedemptionPage from "../views/admin/reward/RewardRedemptionPage.vue";
import MaintenanceLandingPage from "../views/admin/MaintenanceLandingPage.vue";
import Profile from "../views/Profile.vue";
import Notifications from "../views/Notification.vue";

import AdminLanding from "../views/admin/AdminLanding.vue";
import AdminCalendar from "../views/admin/AdminCalendar.vue";
import AdminProfile from "../views/admin/AdminProfile.vue";
import AdminSearch from "../views/admin/AdminSearch.vue";
import AdminUserPage from "../views/admin/user/AdminUserPage.vue";
import Approvals from "../views/admin/Approvals.vue";

import StudentLanding from "../views/student/StudentLanding.vue";
import StudentCalendar from "../views/student/StudentCalendar.vue";
import StudentSearch from "../views/student/StudentSearch.vue";

import FacultyLanding from "../views/faculty/FacultyLanding.vue";
import FacultyCalendar from "../views/faculty/FacultyCalendar.vue";
import FacultyFlightPlan from "../views/faculty/FacultyFlightPlan.vue";
import FacultySearch from "../views/faculty/FacultySearch.vue";
import FlightPlan from "../views/FlightPlan.vue";
import AddFlightPlanItem from "../views/admin/flightPlan/AddFlightPlanItem.vue";
import EventAttendancePage from "../views/admin/event/EventAttendancePage.vue";

const adminRoutes = [
  {
    path: "calendar",
    name: "admin-calendar",
    component: AdminCalendar,
  },
  {
    path: "notifications",
    name: "admin-notifications",
    component: Notifications,
  },
  {
    path: "profile",
    name: "admin-profile",
    component: Profile,
  },
  {
    path: "search",
    name: "admin-search",
    component: AdminSearch,
  },
  {
    path: "approvals",
    name: "admin-approvals",
    component: Approvals,
  },
];

const adminTaskRoutes = [
  {
    path: "maintenance/task",
    name: "task",
    component: TasksPage,
  },
  {
    path: "maintenance/task/edit/:id",
    name: "editTask",
    component: TaskAddEditPage,
    props: { isAdd: false },
  },
  {
    path: "maintenance/task/add",
    name: "addTask",
    component: TaskAddEditPage,
    props: { isAdd: true },
  },
];

const adminRewardRoutes = [
  {
    path: "maintenance/reward",
    name: "reward",
    component: RewardPage,
  },
  {
    path: "maintenance/reward/edit/:id",
    name: "editReward",
    component: RewardAddEditPage,
    props: { isAdd: false },
  },
  {
    path: "maintenance/reward/add",
    name: "addReward",
    component: RewardAddEditPage,
    props: { isAdd: true },
  },
  {
    path: "maintenance/reward/redeem/:id",
    name: "redeemReward",
    component: RewardRedemptionPage,
  },
];

const adminExperienceRoutes = [
  {
    path: "maintenance/experience",
    name: "experience",
    component: ExperiencesPage,
  },
  {
    path: "maintenance/experience/edit/:id",
    name: "editExperience",
    component: ExperienceAddEditPage,
    props: { isAdd: false },
  },
  {
    path: "maintenance/experience/add",
    name: "addExperience",
    component: ExperienceAddEditPage,
    props: { isAdd: true },
  },
];

const adminEventRoutes = [
  {
    path: "maintenance/event",
    name: "event",
    component: EventCardPage,
  },
  {
    path: "maintenance/event/edit/:id",
    name: "editEvent",
    component: EventAddEditPage,
    props: { isAdd: false },
  },
  {
    path: "maintenance/event/add",
    name: "addEvent",
    component: EventAddEditPage,
    props: { isAdd: true },
  },
  {
    path: "maintenance/event/attendance/:id",
    name: "attendanceEvent",
    component: EventAttendancePage,
  },
];

const adminBadgeRoutes = [
  {
    path: "maintenance/badge",
    name: "badge",
    component: BadgesPage,
  },
  {
    path: "maintenance/badge/edit/:id",
    name: "editBadge",
    component: BadgeAddEditPage,
    props: { isAdd: false },
  },
  {
    path: "maintenance/badge/add",
    name: "addBadge",
    component: BadgeAddEditPage,
    props: { isAdd: true },
  },
];

const adminFlightPlanRoutes = [
  {
    path: "maintenance/user/studentFlightPlan/:id",
    name: "adminStudentFlightPlan",
    component: FlightPlan,
    props: { isAdmin: true },
  },
  {
    path: "user/:studentName/flightPlan/:id/add",
    name: "addItemToFlightPlan",
    component: AddFlightPlanItem,
  },
];

const adminMaintenanceRoutes = [
  {
    path: "maintenance",
    name: "maintenance",
    component: MaintenanceLandingPage,
  },
  {
    path: "maintenance/user",
    name: "user",
    component: AdminUserPage,
  },

  {
    path: "user/profile/:userId",
    name: "adminProfile",
    component: AdminProfile,
    props: { isAdmin: true },
  },
  ...adminTaskRoutes,
  ...adminRewardRoutes,
  ...adminExperienceRoutes,
  ...adminEventRoutes,
  ...adminBadgeRoutes,
  ...adminFlightPlanRoutes,
];

const facultyRoutes = [
  {
    path: "calendar",
    name: "faculty-calendar",
    component: FacultyCalendar,
  },
  {
    path: "flightPlan",
    name: "faculty-flightPlan",
    component: FacultyFlightPlan,
  },
  {
    path: "notifications",
    name: "faculty-notifications",
    component: Notifications,
  },
  {
    path: "profile",
    name: "faculty-profile/:userId",
    component: Profile,
  },
  {
    path: "search",
    name: "faculty-search",
    component: FacultySearch,
  },
];

const studentRoutes = [
  {
    path: "calendar",
    name: "student-calendar",
    component: StudentCalendar,
  },
  {
    path: "flightPlan",
    name: "student-flightPlan",
    component: FlightPlan,
    props: { isAdmin: false },
  },
  {
    path: "notifications",
    name: "student-notifications",
    component: Notifications,
  },
  {
    path: "profile/:userId",
    name: "student-profile",
    component: Profile,
  },
  {
    path: "search",
    name: "student-search",
    component: StudentSearch,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Authentication Routes
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },

    // Admin Routes
    {
      path: "/admin",
      name: "admin",
      component: AdminLanding,
      beforeEnter: isAdmin,
      children: [...adminRoutes, ...adminMaintenanceRoutes],
    },

    // Faculty Routes
    {
      path: "/faculty",
      name: "faculty",
      component: FacultyLanding,
      beforeEnter: isFaculty,
      children: [...facultyRoutes],
    },

    // Student Routes
    {
      path: "/student",
      name: "student",
      component: StudentLanding,
      children: [...studentRoutes],
    },

    // Error Routes
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
    },
    {
      path: "/Unauthorized",
      name: "unauthorized",
      component: Unauthorized,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const store = userStore();
  const isAuthenticated = await store.isAuthenticated();
  if (!isAuthenticated) {
    if (to.path !== "/login" && to.path !== "/") {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    if (to.path == "/login" || to.path == "/") {
      next(await loginRedirect());
    } else {
      next();
    }
  }
});

export async function loginRedirect() {
  const store = userStore();
  if (await store.isAdmin()) {
    return { name: "admin" };
  } else if (await store.isFaculty()) {
    return { name: "faculty" };
  } else {
    return { name: "student" };
  }
}

async function isAdmin() {
  const store = userStore();
  const response = (await store.isAdmin()) ? true : { name: "unauthorized" };
  return response;
}
async function isFaculty() {
  const store = userStore();
  const response = (await store.isFaculty()) ? true : { name: "unauthorized" };
  return response;
}

export default router;
