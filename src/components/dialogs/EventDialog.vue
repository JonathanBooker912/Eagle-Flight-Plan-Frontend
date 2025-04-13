<script setup>
import { watch, computed, ref, onMounted } from "vue";
import dayjs from "dayjs";
import eventServices from "../../services/eventServices";
import { generateEventQRCodePDF } from "../../utils/pdfGenerator.js";
import QRCodeGenerationModal from "../../components/modals/QRCodeGenerationModal.vue";
import { userStore } from "../../stores/userStore.js";
import studentServices from "../../services/studentServices.js";

const store = userStore();

// Props
const props = defineProps({
  modelValue: Boolean,
  event: {
    type: Object,
    default: () => ({}),
  },
  isAdmin: Boolean,
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "record-attendance",
  "generate-qr",
  "register",
  "unregister",
  "checkin",
]);

// Local refs & state
const eventToShow = ref({});
const generatingToken = ref(false);
const generatingPDF = ref(false);
const generatedToken = ref(null);
const showQRCodeModal = ref(false);
const checkingToken = ref(false);

const registered = ref(false);
const attending = ref(false);
const successMessage = ref("");

// Internal dialog model
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Check if event is in the future
const isEventInFuture = computed(() => {
  if (!eventToShow.value?.date) return false;
  return dayjs(eventToShow.value.date).isAfter(dayjs());
});

const checkIfStudentIsRegistered = async () => {
  try {
    const userId = store.user?.userId;
    if (!userId || !props.event?.id) return;

    const studentRes = await studentServices.getStudentForUserId(userId);
    const studentId = studentRes.data.id;

    const registeredRes = await eventServices.getRegisteredStudents(
      props.event.id,
    );
    registered.value = registeredRes.data.some(
      (s) => s.studentId === studentId,
    );

    const attendingRes = await eventServices.getAttendingStudents(
      props.event.id,
    );
    attending.value = attendingRes.data.some((s) => s.studentId === studentId);
  } catch (err) {
    console.error("Error checking registration:", err);
  }
};

// Methods
const recordAttendance = () => {
  emit("record-attendance", props.event);
  successMessage.value = "Attendance recorded!";
  setTimeout(() => {
    successMessage.value = "";
    internalValue.value = false;
  }, 2000);
};

const register = () => {
  emit("register", props.event);
  successMessage.value = "Successfully registered!";
  setTimeout(() => {
    successMessage.value = "";
    internalValue.value = false;
  }, 2000);
};

const unregister = () => {
  emit("unregister", props.event);
  successMessage.value = "Unregistered successfully!";
  setTimeout(() => {
    successMessage.value = "";
    internalValue.value = false;
  }, 2000);
};

const checkin = () => {
  emit("checkin", props.event);
  successMessage.value = "Checked in successfully!";
  setTimeout(() => {
    successMessage.value = "";
    internalValue.value = false;
  }, 2000);
};

const getCurrentToken = async () => {
  if (!eventToShow.value?.id) return;

  checkingToken.value = true;
  try {
    const response = await eventServices.getCheckInToken(eventToShow.value.id);
    generatedToken.value = response.data;
  } catch (error) {
    console.error("Error getting check-in token:", error);
    generatedToken.value = null;
  } finally {
    checkingToken.value = false;
  }
};

const handleGenerateQRCode = async (expirationTimestamp) => {
  generatingToken.value = true;
  try {
    const response = await eventServices.generateCheckInToken(
      eventToShow.value.id,
      expirationTimestamp,
    );
    generatedToken.value = response.data;
  } catch (error) {
    console.error("Error generating check-in token:", error);
  } finally {
    generatingToken.value = false;
  }
};

const downloadQRCode = async () => {
  if (!generatedToken.value) return;

  generatingPDF.value = true;
  try {
    await generateEventQRCodePDF(eventToShow.value, generatedToken.value);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    generatingPDF.value = false;
  }
};

// On mount/load
onMounted(() => {
  eventToShow.value = props.event;
  getCurrentToken();
});

watch(
  () => props.event,
  (newEvent) => {
    eventToShow.value = newEvent;
    getCurrentToken();
    checkIfStudentIsRegistered();
  },
  { immediate: true },
);
</script>

<template>
  <v-dialog v-model="internalValue" max-width="500px">
    <v-card color="backgroundDarken" class="rounded-xl pa-4">
      <v-card-title
        class="text-h6 text-center justify-center d-flex align-center"
      >
        <span class="flex-grow-1 text-center">{{ event.name }}</span>
        <v-icon class="cursor-pointer" @click="internalValue = false"
          >mdi-close</v-icon
        >
      </v-card-title>

      <v-card-text>
        <p>{{ event.description }}</p>
        <br />
        <p><strong>Attendance:</strong> {{ event.attendanceType }}</p>
        <p><strong>Registration:</strong> {{ event.registration }}</p>

        <v-fade-transition mode="out-in">
          <div v-if="successMessage">
            <v-alert type="success" variant="tonal" class="mt-4 text-center">
              {{ successMessage }}
            </v-alert>
          </div>
          <div v-else>
            <template v-if="props.isAdmin">
              <div class="button-row mt-5">
                <v-btn
                  color="primary"
                  rounded="xl"
                  :class="generatedToken?.token ? 'button-half' : 'button-full'"
                  @click="recordAttendance"
                >
                  Record Attendance
                </v-btn>

                <v-btn
                  v-if="generatedToken?.token"
                  color="primary"
                  rounded="xl"
                  class="button-half"
                  :loading="generatingPDF"
                  @click="downloadQRCode"
                >
                  Download QR Code PDF
                </v-btn>
              </div>

              <!-- Generate Token (separate full-width button if no token yet) -->
              <v-btn
                v-if="!generatedToken?.token && isEventInFuture"
                color="primary"
                rounded="xl"
                class="mt-2 button-full"
                :loading="generatingToken"
                :disabled="checkingToken"
                @click="showQRCodeModal = true"
              >
                Generate Check-In Code
              </v-btn>

              <QRCodeGenerationModal
                v-model:show="showQRCodeModal"
                :event="eventToShow"
                @generate="handleGenerateQRCode"
              />
            </template>

            <template v-else-if="!registered">
              <v-btn color="primary mt-5" rounded="xl" block @click="register">
                Register
              </v-btn>
            </template>

            <template v-else>
              <div class="button-row mt-5">
                <v-btn
                  color="danger"
                  rounded="xl"
                  :class="attending ? 'button-full' : 'button-half'"
                  @click="unregister"
                >
                  Unregister
                </v-btn>

                <v-btn
                  v-if="!attending"
                  color="success"
                  rounded="xl"
                  class="button-half"
                  @click="checkin"
                >
                  Check-In
                </v-btn>
              </div>
            </template>
          </div>
        </v-fade-transition>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.mt-5 {
  margin-top: 20px;
}

.button-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.button-half {
  width: 50%;
}

.button-full {
  width: 100%;
}
</style>
