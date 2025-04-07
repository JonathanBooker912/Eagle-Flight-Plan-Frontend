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

import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminCalendar from "../views/admin/AdminCalendar.vue";
import AdminProfile from "../views/admin/AdminProfile.vue";
import AdminSearch from "../views/admin/AdminSearch.vue";
import AdminUserPage from "../views/admin/user/AdminUserPage.vue";

import StudentDashboard from "../views/student/StudentDashboard.vue";
import StudentCalendar from "../views/student/StudentCalendar.vue";
import StudentFlightPlan from "../views/student/StudentFlightPlan.vue";
import StudentSearch from "../views/student/StudentSearch.vue";

import FacultyDashboard from "../views/faculty/FacultyDashboard.vue";
import FacultyCalendar from "../views/faculty/FacultyCalendar.vue";
import FacultyFlightPlan from "../views/faculty/FacultyFlightPlan.vue";
import FacultySearch from "../views/faculty/FacultySearch.vue";
import FlightPlan from "../views/FlightPlan.vue";
import AddFlightPlanItem from "../views/admin/flightPlan/AddFlightPlanItem.vue";
import EventAttendancePage from "../views/admin/event/EventAttendancePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/admin",
      name: "admin",
      beforeEnter: isAdmin,
      children: [
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
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboard,
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
          path: "maintenance",
          name: "maintenance",
          component: MaintenanceLandingPage,
        },
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
        {
          path: "/maintenance/reward",
          name: "reward",
          component: RewardPage,
        },
        {
          path: "/maintenance/reward/edit/:id",
          name: "editReward",
          component: RewardAddEditPage,
          props: { isAdd: false },
        },
        {
          path: "/maintenance/reward/add",
          name: "addReward",
          component: RewardAddEditPage,
          props: { isAdd: true },
        },
        {
          path: "/maintenance/reward/redeem/:id",
          name: "redeemReward",
          component: RewardRedemptionPage,
        },
        {
          path: "maintenance/experience",
          name: "experience",
          component: ExperiencesPage,
        },
        {
          path: "maintenance/experience/edit/:id",
          name: "edit",
          component: ExperienceAddEditPage,
          props: { isAdd: false },
        },
        {
          path: "maintenance/experience/add",
          name: "add",
          component: ExperienceAddEditPage,
          props: { isAdd: true },
        },
        {
          path: "maintenance/badge",
          name: "badge",
          component: BadgesPage,
        },
        {
          path: "maintenance/badge/edit/:id",
          name: "edit",
          component: BadgeAddEditPage,
          props: { isAdd: false },
        },
        {
          path: "maintenance/badge/add",
          name: "add",
          component: BadgeAddEditPage,
          props: { isAdd: true },
        },
        {
          path: "maintenance/user",
          name: "user",
          component: AdminUserPage,
        },
        {
          path: "maintenance/user/:studentName/studentFlightPlan/:id",
          name: "adminStudentFlightPlan",
          component: FlightPlan,
          props: { isAdmin: true },
        },
        {
          path: "user/:studentName/flightPlan/:id/add",
          name: "addItemToFlightPlan",
          component: AddFlightPlanItem,
        },
        {
          path: "user/profile/:userId",
          name: "adminProfile",
          component: AdminProfile,
          props: { isAdmin: true },
        },
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
          path: "maintenance/event/attendance/:id/",
          name: "attendanceEvent",
          component: EventAttendancePage,
        },
        {
          path: "maintenance/user",
          name: "user",
          component: AdminUserPage,
        },
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
        /** Put all further admin routes in here */
      ],
    },
    {
      path: "/faculty",
      name: "faculty",
      component: FacultyDashboard,
      beforeEnter: isFaculty,
      children: [
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
      ],
    },
    {
      path: "/student",
      name: "student",
      component: StudentDashboard,
      children: [
        {
          path: "calendar",
          name: "student-calendar",
          component: StudentCalendar,
        },
        {
          path: "flightPlan",
          name: "student-flightPlan",
          component: StudentFlightPlan,
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
      ],
    },
    { path: "/:pathMatch(.*)*", component: NotFound },
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
