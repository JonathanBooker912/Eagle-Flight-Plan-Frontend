import { createRouter, createWebHistory } from "vue-router";

import Login from "../views/Login.vue";
import LandingPage from "../views/LandingPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      alias: "/login",
      name: "login",
      component: Login,
    },
  ],
});

// router.beforeEach(async (to, from, next) => {
//   const isAuthenticated = await routerState.isAuthenticated();
//   if (!isAuthenticated) {
//     if (to.path !== "/login") {
//       next({ path: "/login" });
//     } else {
//       next();
//     }
//   } else {
//     if (to.path == "/login") {
//       next({ path: "/" });
//     } else {
//       next();
//     }
//   }
// });

// function isAdmin(to) {
//   const hasAdminPrivileges = routerState.isAdmin();
//   if (!hasAdminPrivileges) {
//     return { path: "/resume" };
//   }
// }

export default router;
