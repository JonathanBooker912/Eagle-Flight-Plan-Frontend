<script setup>
import { computed, watch, onMounted, ref } from "vue";
import QRCodeGenerationModal from "../../components/modals/QRCodeGenerationModal.vue";
import { useEventCheckIn } from "../../utils/useEventCheckin";

const props = defineProps({
  modelValue: Boolean,
  event: {
    type: Object,
    default: () => ({}),
  },
  isAdmin: Boolean,
});

const emit = defineEmits([
  "update:modelValue",
  "record-attendance",
  "generate-qr",
  "register",
  "unregister",
  "checkin",
]);

// Composable for shared event logic
const {
  eventToShow,
  setEvent,
  generatedToken,
  getCurrentToken,
  generateToken: handleGenerateQRCode,
  downloadQRCode,
  generatingToken,
  generatingPDF,
  checkingToken,
  successMessage,
  isEventInFuture,
  checkIfStudentIsRegistered,
  registered,
  attending,
} = useEventCheckIn();

const showQRCodeModal = ref(false);

// Sync dialog visibility with parent
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Local event-specific actions
const recordAttendance = () => {
  emit("record-attendance", props.event);
  showSuccess("Attendance recorded!");
};

const register = () => {
  emit("register", props.event);
  showSuccess("Successfully registered!");
};

const unregister = () => {
  emit("unregister", props.event);
  showSuccess("Unregistered successfully!");
};

const checkin = () => {
  emit("checkin", props.event);
  showSuccess("Checked in successfully!");
};

const showSuccess = (msg) => {
  successMessage.value = msg;
  setTimeout(() => {
    successMessage.value = "";
    internalValue.value = false;
  }, 2000);
};

// Watch for event prop changes
watch(
  () => props.event,
  async (newEvent) => {
    setEvent(newEvent);
    await getCurrentToken();
    await checkIfStudentIsRegistered();
  },
  { immediate: true }
);

// Initial mount
onMounted(() => {
  setEvent(props.event);
  getCurrentToken();
});
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
                  :class="{
                    'button-half': generatedToken?.token,
                    'button-full': !generatedToken?.token && !isEventInFuture,
                  }"
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
                <v-btn
                  v-if="!generatedToken?.token && isEventInFuture"
                  color="primary"
                  rounded="xl"
                  class="button-half"
                  :loading="generatingToken"
                  :disabled="checkingToken"
                  @click="showQRCodeModal = true"
                >
                  Generate Check-In Code
                </v-btn>
              </div>

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
