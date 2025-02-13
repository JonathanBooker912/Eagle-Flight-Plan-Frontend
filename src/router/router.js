import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import AdminLanding from "../views/admin/AdminLanding.vue";
import StudentLanding from "../views/student/StudentLanding.vue";
import FacultyLanding from "../views/faculty/FacultyLanding.vue";
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
      alias: "/admin",
      name: "admin",
      component: AdminLanding,
      beforeEnter: isAdmin,
      children: [
        /** Put all further admin routes in here */
      ],
    },
    {
      path: "/faculty",
      alias: "/faculty",
      name: "faculty",
      component: FacultyLanding,
      beforeEnter: isFaculty,
      children: [
        /** Put all further faculty routes in here */
      ],
    },
    {
      path: "/student",
      alias: "/student",
      name: "student",
      component: StudentLanding,
      children: [
        /** Put all further student routes in here */
      ],
    },
  ],
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
