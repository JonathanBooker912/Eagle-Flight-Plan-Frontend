import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import AdminLanding from "../views/admin/AdminLanding.vue";
import StudentLanding from "../views/student/StudentLanding.vue";
import FacultyLanding from "../views/faculty/FacultyLanding.vue";
import TasksPage from "../views/admin/TasksPage.vue";
import { userStore } from "../stores/userStore";
import NotFound from "../views/NotFound.vue";
import Unauthorized from "../views/Unauthorized.vue";
import TaskAddEditPage from "../views/admin/task/TaskAddEditPage.vue";

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
      component: AdminLanding,
      beforeEnter: isAdmin,
      children: [
        {
          path: "task",
          name: "task",
          component: TasksPage,
        },
        {
          path: "task/edit/:id",
          name: "edit",
          component: TaskAddEditPage,
          props: { isAdd: false },
        },
        {
          path: "task/add",
          name: "add",
          component: TaskAddEditPage,
          props: { isAdd: true },
        },
        /** Put all further admin routes in here */
      ],
    },
    {
      path: "/faculty",
      name: "faculty",
      component: FacultyLanding,
      beforeEnter: isFaculty,
      children: [
        /** Put all further faculty routes in here */
      ],
    },
    {
      path: "/student",
      name: "student",
      component: StudentLanding,
      children: [
        /** Put all further student routes in here */
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
