import StudentOnboarding from "../views/student/StudentOnboarding.vue";

const routes = [
  {
    path: "/student/onboarding",
    name: "StudentOnboarding",
    component: StudentOnboarding,
    meta: { requiresAuth: true, requiresStudent: true },
  },
];

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  const userStoreInstance = userStore();
  const { user } = storeToRefs(userStoreInstance);

  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!user.value) {
      next({ name: "Login" });
      return;
    }

    // Check if route requires student role
    if (to.matched.some((record) => record.meta.requiresStudent)) {
      if (user.value.role !== "student") {
        next({ name: "Home" });
        return;
      }

      // Check if student has completed onboarding
      try {
        const response = await studentServices.getStudentForUserId(
          user.value.userId
        );
        const student = response.data;

        // If student hasn't completed onboarding and isn't on the onboarding page
        if (
          (!student?.graduationDate || !student?.semestersFromGrad) &&
          to.name !== "StudentOnboarding"
        ) {
          next({ name: "StudentOnboarding" });
          return;
        }

        // If student has completed onboarding and is on the onboarding page
        if (
          student?.graduationDate &&
          student?.semestersFromGrad &&
          to.name === "StudentOnboarding"
        ) {
          next({ name: "StudentProfile" });
          return;
        }
      } catch (error) {
        // If student doesn't exist and isn't on the onboarding page
        if (to.name !== "StudentOnboarding") {
          next({ name: "StudentOnboarding" });
          return;
        }
      }
    }
  }

  next();
});
