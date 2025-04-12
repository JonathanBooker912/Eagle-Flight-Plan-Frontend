<script setup>
import { watch, computed, ref, onMounted } from "vue";
import dayjs from "dayjs";
import eventServices from "../../services/eventServices";
import { generateEventQRCodePDF } from "../../utils/pdfGenerator.js";
import QRCodeGenerationModal from "../../components/modals/QRCodeGenerationModal.vue";

// Props
const props = defineProps({
  modelValue: Boolean,
  event: Object,
  isAdmin: Boolean, // ✅ NEW
});

// Emits
const emit = defineEmits([
  "update:modelValue",
  "record-attendance",
  "generate-qr",
  "register", // ✅ NEW
]);

// Local refs & state
const eventToShow = ref({});
const generatingToken = ref(false);
const generatingPDF = ref(false);
const generatedToken = ref(null);
const showQRCodeModal = ref(false);
const checkingToken = ref(false);

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

// Methods
const recordAttendance = () => {
  emit("record-attendance", props.event);
  internalValue.value = false;
};

const register = () => {
  emit("register", props.event);
  internalValue.value = false;
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
      expirationTimestamp
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
  },
  { immediate: true }
);
</script>

<template>
  <v-dialog v-model="internalValue" max-width="500px">
    <v-card color="backgroundDarken" class="rounded-xl pa-4">
      <v-card-title class="text-h4 text-center justify-center">
        {{ event.name }}
      </v-card-title>
      <v-card-text>
        <p>{{ event.description }}</p>
        <br />
        <p><strong>Attendance:</strong> {{ event.attendanceType }}</p>
        <p><strong>Registration:</strong> {{ event.registration }}</p>
      </v-card-text>

      <!-- ✅ Admin Buttons -->
      <template v-if="props.isAdmin">
        <v-btn
          color="primary"
          rounded="xl"
          class="mb-2"
          @click="recordAttendance"
        >
          Record Attendance
        </v-btn>

        <v-btn
          v-if="generatedToken?.token"
          color="primary"
          rounded="xl"
          class="mb-2"
          :loading="generatingPDF"
          @click="downloadQRCode"
        >
          Download QR Code PDF
        </v-btn>

        <v-btn
          v-else-if="isEventInFuture"
          color="primary"
          rounded="xl"
          class="mb-2"
          :loading="generatingToken"
          :disabled="checkingToken"
          block
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

      <template v-else>
        <v-btn color="primary" rounded="xl" block @click="register">
          Register
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>
