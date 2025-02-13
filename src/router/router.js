import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";


import Admin from "../views/Admin.vue"
import AdminCalendar from "../views/admin/AdminCalendar.vue";
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import AdminFlightPlan from "../views/admin/AdminFlightPlan.vue";
import AdminNotification from "../views/admin/AdminNotification.vue";
import AdminProfile from "../views/admin/AdminProfile.vue";
import AdminSearch from "../views/admin/AdminSearch.vue";

import Student from "../views/Student.vue"
import StudentCalendar from "../views/student/StudentCalendar.vue";
import StudentDashboard from "../views/student/StudentDashboard.vue";
import StudentFlightPlan from "../views/student/StudentFlightPlan.vue";
import StudentNotification from "../views/student/StudentNotification.vue";
import StudentProfile from "../views/student/StudentProfile.vue";
import StudentSearch from "../views/student/StudentSearch.vue";

import Faculty from "../views/Faculty.vue"
import FacultyCalendar from "../views/faculty/FacultyCalendar.vue";
import FacultyDashboard from "../views/faculty/FacultyDashboard.vue";
import FacultyFlightPlan from "../views/faculty/FacultyFlightPlan.vue";
import FacultyNotification from "../views/faculty/FacultyNotification.vue";
import FacultyProfile from "../views/faculty/FacultyProfile.vue";
import FacultySearch from "../views/faculty/FacultySearch.vue";



import { userStore } from "../stores/userStore";




const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            alias: "/login",
            name: "login",
            component: Login,
            beforeEnter: loginRedirect
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
                    component: AdminDashboard
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
                    component: AdminSearch
                },
            ],
        },
        {
            path: "/faculty",
            name: "faculty",
            component: Faculty,
            beforeEnter: isFaculty,
            redirect: '/faculty/dashboard',
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
            redirect: '/student/dashboard',
            children: [
                {
                    path: "calendar",
                    name: "student-calendar",
                    component: StudentCalendar,
                },
                {
                    path: "dashboard",
                    name: "student-dashboard",
                    component: StudentDashboard
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
            ]
        },
    ]
});

router.beforeEach(async (to, from, next) => {
  const store = userStore();
  const isAuthenticated = await store.isAuthenticated();
  if (!isAuthenticated) {
    if (to.path !== "/login") {
      next({ path: "/login" });
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      next({ path: "/" });
    } else {
      next();
    }
  }
});

export async function loginRedirect() {
  const store = userStore();
  const isAuthenticated = await store.isAuthenticated();
  if (isAuthenticated) {
    const hasAdminPrivileges = await store.isAdmin();
    if (hasAdminPrivileges) {
      return { name: "admin" };
    }

    const hasFacultyPrivileges = await store.isFaculty();
    if (hasFacultyPrivileges) {
      return { name: "faculty" };
    }

    return { name: "student" };
  }
  return;
}

async function isAdmin() {
  const store = userStore();
  const admin = store.roles
    ? store.roles.some((role) => role.name.toLowerCase() == "admin")
    : false;
  return admin;
}
async function isFaculty() {
  const store = userStore();
  const faculty = store.roles
    ? store.roles.some((role) => role.name.toLowerCase() == "faculty")
    : false;
  return faculty;
}

export default router;
