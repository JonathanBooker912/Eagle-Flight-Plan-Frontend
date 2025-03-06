import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import TasksPage from "../views/admin/TasksPage.vue";
// Admin, Faculty, and Student Imports
import { userStore } from "../stores/userStore";
import NotFound from "../views/NotFound.vue";
import Unauthorized from "../views/Unauthorized.vue";
import TaskAddEditPage from "../views/admin/task/TaskAddEditPage.vue";
import BadgeCardPage from "../views/admin/BadgeCardPage.vue";
import ExperienceAddEditPage from "../views/admin/experience/ExperienceAddEditPage.vue";
import ExperiencesPage from "../views/admin/ExperiencesPage.vue";
import RewardPage from "../views/admin/reward/RewardPage.vue";
import RewardAddEditPage from "../views/admin/reward/RewardAddEditPage.vue";
import RewardRedemptionPage from "../views/admin/reward/RewardRedemptionPage.vue";
import MaintenanceLandingPage from "../views/admin/MaintenanceLandingPage.vue";

import Admin from "../views/admin/Admin.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminCalendar from "../views/admin/AdminCalendar.vue";
import AdminFlightPlan from "../views/admin/AdminFlightPlan.vue";
import AdminNotification from "../views/admin/AdminNotification.vue";
import AdminProfile from "../views/admin/AdminProfile.vue";
import AdminSearch from "../views/admin/AdminSearch.vue";
import AdminUserPage from "../views/admin/user/AdminUserPage.vue";

import Student from "../views/student/StudentDashboard.vue";
import StudentCalendar from "../views/student/StudentCalendar.vue";
import StudentFlightPlan from "../views/student/StudentFlightPlan.vue";
import StudentNotification from "../views/student/StudentNotification.vue";
import StudentProfile from "../views/student/StudentProfile.vue";
import StudentSearch from "../views/student/StudentSearch.vue";

import Faculty from "../views/faculty/FacultyDashboard.vue";
import FacultyCalendar from "../views/faculty/FacultyCalendar.vue";
import FacultyFlightPlan from "../views/faculty/FacultyFlightPlan.vue";
import FacultyNotification from "../views/faculty/FacultyNotification.vue";
import FacultyProfile from "../views/faculty/FacultyProfile.vue";
import FacultySearch from "../views/faculty/FacultySearch.vue";
import AdminUserFlightPlan from "../views/admin/user/AdminUserFlightPlan.vue";

import { userStore } from "../stores/userStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
      beforeEnter: loginRedirect,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      beforeEnter: isAdmin,
      redirect: "/admin/dashboard",
      children: [
        { path: "calendar", name: "admin-calendar", component: AdminCalendar },
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboard,
        },
        {
          path: "flightPlan",
          name: "admin-flightPlan",
          component: AdminFlightPlan,
        },
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboard,
        },
        {
          path: "notifications",
          name: "admin-notifications",
          component: AdminNotification,
        },
        { path: "profile", name: "admin-profile", component: AdminProfile },
        { path: "search", name: "admin-search", component: AdminSearch },
      ],
    },
    {
      path: "/faculty",
      name: "faculty",
      component: Faculty,
      beforeEnter: isFaculty,
      redirect: "/faculty/dashboard",
      children: [
        {
          path: "calendar",
          name: "faculty-calendar",
          component: FacultyCalendar,
        },
        {
          path: "dashboard",
          name: "faculty-dashboard",
          component: FacultyDashboard,
        },
        {
          path: "flightPlan",
          name: "faculty-flightPlan",
          component: FacultyFlightPlan,
        },
        {
          path: "notifications",
          name: "faculty-notifications",
          component: FacultyNotification,
        },
        { path: "profile", name: "faculty-profile", component: FacultyProfile },
        { path: "search", name: "faculty-search", component: FacultySearch },
      ],
    },
    {
      path: "/student",
      alias: "/student",
      name: "student",
      component: Student,
      redirect: "/student/dashboard",
      children: [
        {
          path: "calendar",
          name: "student-calendar",
          component: StudentCalendar,
        },
        {
          path: "dashboard",
          name: "student-dashboard",
          component: StudentDashboard,
        },
        {
          path: "flightPlan",
          name: "student-flightPlan",
          component: StudentFlightPlan,
        },
        {
          path: "notifications",
          name: "student-notifications",
          component: StudentNotification,
        },
        { path: "profile", name: "student-profile", component: StudentProfile },
        { path: "search", name: "student-search", component: StudentSearch },
      ],
    },
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
      beforeEnter: loginRedirect,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      beforeEnter: isAdmin,
      redirect: "/admin/dashboard",
      children: [
        {
          path: "calendar",
          name: "admin-calendar",
          component: AdminCalendar,
        },
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboard,
        },
        {
          path: "/flightPlan",
          name: "admin-flightPlan",
          component: AdminFlightPlan,
        },
        {
          path: "notifications",
          name: "admin-notifications",
          component: AdminNotification,
        },
        {
          path: "profile",
          name: "admin-profile",
          component: AdminProfile,
        },
        {
          path: "search",
          name: "admin-search",
          component: AdminSearch,
        },
      ],
    },
    {
      path: "/faculty",
      name: "faculty",
      component: Faculty,
      beforeEnter: isFaculty,
      redirect: "/faculty/dashboard",
      children: [
        {
          path: "calendar",
          name: "faculty-calendar",
          component: FacultyCalendar,
        },
        {
          path: "dashboard",
          name: "faculty-dashboard",
          component: FacultyDashboard,
        },
        {
          path: "flightPlan",
          name: "faculty-flightPlan",
          component: FacultyFlightPlan,
        },
        {
          path: "notifications",
          name: "faculty-notifications",
          component: FacultyNotification,
        },
        {
          path: "profile",
          name: "faculty-profile",
          component: FacultyProfile,
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
      alias: "/student",
      name: "student",
      component: Student,
      redirect: "/student/dashboard",
      children: [
        {
          path: "calendar",
          name: "student-calendar",
          component: StudentCalendar,
        },
        {
          path: "dashboard",
          name: "student-dashboard",
          component: StudentDashboard,
        },
        {
          path: "flightPlan",
          name: "student-flightPlan",
          component: StudentFlightPlan,
        },
        {
          path: "notifications",
          name: "student-notifications",
          component: StudentNotification,
        },
        {
          path: "profile",
          name: "student-profile",
          component: StudentProfile,
        },
        {
          path: "search",
          name: "student-search",
          component: StudentSearch,
        },
      ],
    },
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
      beforeEnter: loginRedirect,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
      beforeEnter: isAdmin,
      redirect: "/admin/dashboard",
      children: [
        {
          path: "calendar",
          name: "admin-calendar",
          component: AdminCalendar,
        },
        {
          path: "dashboard",
          name: "admin-dashboard",
          component: AdminDashboard,
        },
        {
          path: "/flightPlan",
          name: "admin-flightPlan",
          component: AdminFlightPlan,
        },
        {
          path: "notifications",
          name: "admin-notifications",
          component: AdminNotification,
        },
        {
          path: "profile",
          name: "admin-profile",
          component: AdminProfile,
        },
        {
          path: "maintenance/user",
          name: "user",
          component: AdminUserPage,
        },
        {
          path: "maintenance/user/studentFlightPlan/:id",
          name: "adminStudentFlightPlan",
          component: AdminUserFlightPlan,
        },
        {
          path: "search",
          name: "admin-search",
          component: AdminSearch,
        },
      ],
    },
    {
      path: "/faculty",
      name: "faculty",
      component: Faculty,
      beforeEnter: isFaculty,
      redirect: "/faculty/dashboard",
      children: [
        {
          path: "calendar",
          name: "faculty-calendar",
          component: FacultyCalendar,
        },
        {
          path: "dashboard",
          name: "faculty-dashboard",
          component: FacultyDashboard,
        },
        {
          path: "flightPlan",
          name: "faculty-flightPlan",
          component: FacultyFlightPlan,
        },
        {
          path: "notifications",
          name: "faculty-notifications",
          component: FacultyNotification,
        },
        {
          path: "profile",
          name: "faculty-profile",
          component: FacultyProfile,
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
      alias: "/student",
      name: "student",
      component: Student,
      redirect: "/student/dashboard",
      children: [
        {
          path: "calendar",
          name: "student-calendar",
          component: StudentCalendar,
        },
        {
          path: "dashboard",
          name: "student-dashboard",
          component: StudentDashboard,
        },
        {
          path: "flightPlan",
          name: "student-flightPlan",
          component: StudentFlightPlan,
        },
        {
          path: "notifications",
          name: "student-notifications",
          component: StudentNotification,
        },
        {
          path: "profile",
          name: "student-profile",
          component: StudentProfile,
        },
        {
          path: "search",
          name: "student-search",
          component: StudentSearch,
        },
      ],
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

// Login Redirect
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

// Admin Check
async function isAdmin() {
  const store = userStore();
  const response = (await store.isAdmin()) ? true : { name: "unauthorized" };
  return response;
}

// Faculty Check
async function isFaculty() {
  const store = userStore();
  const response = (await store.isFaculty()) ? true : { name: "unauthorized" };
  return response;
}

export default router;
