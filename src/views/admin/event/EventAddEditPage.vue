<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import eventServices from "../../../services/eventServices";
import {
  validateEndTime,
  validateTime,
  formatTimeOptions,
  formatTime,
  parseTimeString,
  generateTimeOptions,
} from "../../../utils/dateTimeHelpers";
import { required } from "../../../utils/formValidators";
import DatePickerFieldForModal from "../../../components/DatePickerFieldForModal.vue";

const props = defineProps({ isAdd: Boolean });

const form = ref(null);
const formData = ref({});
const selectedDate = ref();
const registrationTypes = ref([]);
const attendanceTypes = ref([]);
const eventTypes = ref([]);
const completionTypes = ref([]);
const timeOptions = ref(generateTimeOptions());

const isAllDay = ref(false);

const tempStartTime = ref();
const tempEndTime = ref();

const route = useRoute();
const router = useRouter();

const onAllDayToggle = () => {
  if (isAllDay.value) {
    tempStartTime.value = formData.value.startTime;
    tempEndTime.value = formData.value.endTime;
    formData.value.startTime = "12:00 AM";
    formData.value.endTime = "11:59 PM";
  } else {
    formData.value.startTime = tempStartTime.value;
    formData.value.endTime = tempEndTime.value;
  }
  console.log("All day toggled:", isAllDay.value);
};

const handleCancel = () => router.push({ name: "event" });

const handleSubmit = async () => {
  const isValid = (await form.value?.validate())?.valid;
  if (!isValid || !selectedDate.value) return;

  const date = new Date(selectedDate.value); // Ensure it's a valid Date object
  if (isNaN(date.getTime())) {
    console.error("Invalid date selected:", selectedDate.value);
    return;
  }

  // Convert startTime and endTime to ISO format
  const startTime = parseTimeString(formData.value.startTime, date);
  const endTime = parseTimeString(formData.value.endTime, date);

  if (!startTime || !endTime) {
    console.error(
      "Invalid time values:",
      formData.value.startTime,
      formData.value.endTime,
    );
    return;
  }

  // Update formData with ISO formatted values
  formData.value.date = date.toISOString();
  formData.value.startTime = startTime.toISOString();
  formData.value.endTime = endTime.toISOString();

  try {
    if (props.isAdd) {
      await eventServices.createEvent(formData.value);
    } else {
      await eventServices.updateEvent(route.params.id, formData.value);
    }
    router.push({ name: "event" });
  } catch (error) {
    console.error("Error saving event:", error);
  }
};

onMounted(async () => {
  try {
    const [completionTypesRes, attendanceTypesRes, registrationTypesRes] =
      await Promise.all([
        eventServices.getCompletionTypes(),
        eventServices.getAttendanceTypes(),
        eventServices.getRegistrationTypes(),
      ]);

    completionTypes.value = completionTypesRes.data;
    attendanceTypes.value = attendanceTypesRes.data;
    registrationTypes.value = registrationTypesRes.data;

    if (!props.isAdd) {
      formData.value = (await eventServices.getEvent(route.params.id)).data;
      formData.value.startTime = formatTime(new Date(formData.value.startTime));
      formData.value.endTime = formatTime(new Date(formData.value.endTime));
      selectedDate.value = new Date(formData.value.date);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  console.log(formData.value.startTime);
  console.log(formData.value.endTime);

  if (
    formData.value.startTime == "12:00 AM" &&
    formData.value.endTime == "11:59 PM"
  ) {
    isAllDay.value = true;
    onAllDayToggle();
  }
});

const filteredEndTimeOptions = computed(() => {
  if (!formData.value.startTime) return timeOptions.value;
  const start = parseTimeString(formData.value.startTime, "01/01/2000");
  return timeOptions.value.filter(
    (time) => parseTimeString(time, "01/01/2000") > start,
  );
});

const validateEndTimeWrapper = (value) => {
  return validateEndTime(value, formData.value);
};
</script>

<template>
  <h1 class="text-center ma-5">
    {{ props.isAdd ? "Add Event" : "Edit Event" }}
  </h1>
  <v-form ref="form" @submit.prevent>
    <v-container class="bg-backgroundDarken rounded-t-xl">
      <v-text-field
        v-model="formData.name"
        variant="solo"
        rounded="lg"
        label="Name"
        :rules="[required]"
      ></v-text-field>
      <v-text-field
        v-model="formData.location"
        variant="solo"
        rounded="lg"
        label="Location"
      ></v-text-field>

      <v-row no-gutters>
        <v-col size="6">
          <DatePickerFieldForModal v-model="selectedDate" :rules="[required]" />
        </v-col>
      </v-row>

      <v-row no-gutters v-if="selectedDate">
        <v-col cols="5" class="mr-2">
          <v-combobox
            v-model="formData.startTime"
            :items="timeOptions"
            label="Start Time"
            variant="solo"
            rounded="lg"
            :rules="[validateTime]"
            :disabled="isAllDay"
            @update:modelValue="
              (value) => (formData.startTime = formatTimeOptions(value))
            "
          />
        </v-col>
        <v-col cols="5" class="mr-2">
          <v-combobox
            v-model="formData.endTime"
            :items="filteredEndTimeOptions"
            label="End Time"
            variant="solo"
            rounded="lg"
            :rules="[validateTime, validateEndTimeWrapper]"
            :disabled="isAllDay"
            @update:modelValue="
              (value) => (formData.endTime = formatTimeOptions(value))
            "
          />
        </v-col>
        <v-col cols="1" class="ml-5">
          <v-checkbox
            v-model="isAllDay"
            label="All day"
            @change="onAllDayToggle"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col size="6" class="mr-4">
          <v-select
            v-model="formData.registration"
            variant="solo"
            rounded="lg"
            clearable
            label="Registration Type"
            :items="registrationTypes"
            :rules="[required]"
          />
        </v-col>
        <v-col size="6">
          <v-select
            v-model="formData.eventType"
            variant="solo"
            rounded="lg"
            clearable
            label="Event Type"
            :items="eventTypes"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col size="6" class="mr-4">
          <v-select
            v-model="formData.completionType"
            variant="solo"
            rounded="lg"
            clearable
            label="Completion Type"
            :items="completionTypes"
            :rules="[required]"
          />
        </v-col>
        <v-col size="6">
          <v-select
            v-model="formData.attendanceType"
            variant="solo"
            rounded="lg"
            clearable
            label="Attendance Type"
            :items="attendanceTypes"
            :rules="[required]"
          />
        </v-col>
      </v-row>

      <v-textarea
        v-model="formData.description"
        variant="solo"
        rounded="lg"
        label="Description"
      ></v-textarea>

      <v-row class="justify-center mb-1">
        <v-btn
          class="mr-2"
          variant="outlined"
          rounded="xl"
          @click="handleCancel"
          >Cancel</v-btn
        >
        <v-btn rounded="xl" color="primary" @click="handleSubmit">Submit</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
