<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import studentServices from "../../services/studentServices";
import { userStore } from "../../stores/userStore";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStoreInstance = userStore();
const { user } = storeToRefs(userStoreInstance);

const graduationDate = ref("");
const semestersFromGrad = ref(0);
const profileDescription = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    const studentData = {
      graduationDate: graduationDate.value,
      semestersFromGrad: semestersFromGrad.value,
      pointsAwarded: 0,
      pointsUsed: 0,
    };

    await studentServices.createStudent(studentData);
    router.push("/student/profile"); // Redirect to profile after successful submission
  } catch (error) {
    errorMessage.value =
      error.response?.data?.message ||
      "An error occurred while saving student information";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    // Check if student already exists
    const response = await studentServices.getStudentForUserId(
      user.value.userId
    );
    if (response.data?.graduationDate && response.data?.semestersFromGrad) {
      router.push("/student/profile"); // Redirect if already completed onboarding
    }
  } catch (error) {
    // If student doesn't exist, stay on the onboarding page
    console.log("Student not found, showing onboarding page");
  }
});
</script>

<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="6">
        <v-card class="pa-4 rounded-card" color="backgroundDarken">
          <v-card-title class="text-center text-h4 mb-4">
            Welcome to Eagle Flight Plan
          </v-card-title>

          <v-card-subtitle class="text-center mb-6">
            Please complete your profile to get started
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="graduationDate"
                label="Expected Graduation Date"
                type="date"
                class="mb-4"
                required
                :rules="[(v) => !!v || 'Graduation date is required']"
              ></v-text-field>

              <v-text-field
                v-model="semestersFromGrad"
                label="Semesters Until Graduation"
                type="number"
                class="mb-4"
                required
                :rules="[
                  (v) => v > 0 || 'Please enter a valid number of semesters',
                ]"
              ></v-text-field>

              <v-text-field
                v-model="profileDescription"
                label="Profile Description"
                type="string"
                class="mb-4"
                required
                :rules="[(v) => v.length > 0 || 'Please enter a description']"
              ></v-text-field>

              <div v-if="errorMessage">
                <v-alert type="error" variant="tonal" class="mb-4">
                  {{ errorMessage }}
                </v-alert>
              </div>

              <div class="d-flex justify-center">
                <v-btn
                  type="submit"
                  color="primary"
                  rounded="xl"
                  size="large"
                  :loading="isLoading"
                  :disabled="!graduationDate || !semestersFromGrad || isLoading"
                >
                  Complete Profile
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.rounded-card {
  border-radius: 25px;
}
</style>
