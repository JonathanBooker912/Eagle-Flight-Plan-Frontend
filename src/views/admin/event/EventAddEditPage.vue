<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { required } from "../../../utils/formValidators";
import eventServices from "../../../services/eventServices";
import DatePickerFieldForModal from "../../../components/DatePickerFieldForModal.vue";
import DatePickerField from "../../../components/DatePickerField.vue";

const props = defineProps({ isAdd: Boolean });

const form = ref(null);
const formData = ref({});
const registrationTypes = ref([]);
const attendanceTypes = ref([]);
const eventTypes = ref([]);
const completionTypes = ref([]);

const route = useRoute();
const router = useRouter();

const handleCancel = () => {
  router.push({ name: "event" });
};

const handleSubmit = async () => {
  const isValid = (await form.value?.validate())?.valid;
  if (!isValid) return;

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
    const [
      completionTypesRes,
      attendanceTypesRes,
      eventTypesRes,
      registrationTypesRes,
    ] = await Promise.all([
      eventServices.getCompletionTypes(),
      eventServices.getAttendanceTypes(),
      eventServices.getEventTypes(),
      eventServices.getRegistrationTypes(),
    ]);

    completionTypes.value = completionTypesRes.data;
    attendanceTypes.value = attendanceTypesRes.data;
    eventTypes.value = eventTypesRes.data;
    registrationTypes.value = registrationTypesRes.data;

    if (!props.isAdd) {
      formData.value = (await eventServices.getEvent(route.params.id)).data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Format hours and minutes with leading zeros
const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);
const amPm = ["AM", "PM"];
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

      <v-row>
        <v-col>
          <h3>Start Time</h3>
        </v-col>
        <v-col> <h3>End Time</h3> </v-col>
      </v-row>

      <v-row no-gutters>
        <v-row no-gutters>
          <v-col>
            <v-select
              v-model="formData.startTimeHour"
              variant="solo"
              rounded="lg"
              label="Hour"
              clearable
              :items="hours"
              :rules="[required]"
              class="pa-2"
            ></v-select>
          </v-col>
          <h2 style="padding-top: 17px">:</h2>
          <v-col>
            <v-select
              v-model="formData.startTimeMinute"
              variant="solo"
              rounded="lg"
              label="Minute"
              clearable
              :items="minutes"
              :rules="[required]"
              class="pa-2"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="formData.startTimeAmPm"
              variant="solo"
              rounded="lg"
              label="AM/PM"
              clearable
              :items="amPm"
              :rules="[required]"
              class="pa-2"
            ></v-select>
          </v-col>
        </v-row>
        <h1 style="padding-top: 10px">-</h1>

        <v-row no-gutters>
          <v-col>
            <v-select
              v-model="formData.endTimeHour"
              variant="solo"
              rounded="lg"
              label="Hour"
              clearable
              :items="hours"
              :rules="[required]"
              class="pa-2"
            ></v-select>
          </v-col>
          <h2 style="padding-top: 17px">:</h2>
          <v-col>
            <v-select
              v-model="formData.endTimeMinute"
              variant="solo"
              rounded="lg"
              label="Minute"
              clearable
              :items="minutes"
              :rules="[required]"
              class="pa-2"
            ></v-select>
          </v-col>
          <v-col>
            <v-select
              v-model="formData.endTimeAmPm"
              variant="solo"
              rounded="lg"
              label="AM/PM"
              clearable
              :items="amPm"
              :rules="[required]"
              class="pa-2"
            ></v-select>
          </v-col>
        </v-row>
      </v-row>

      <v-row no-gutters>
        <v-col size="6" class="mr-4">
          <DatePickerFieldForModal></DatePickerFieldForModal>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col size="6" class="mr-4">
          <v-select
            v-model="formData.registrationTypes"
            variant="solo"
            rounded="lg"
            label="Registration Type"
            :items="registrationTypes"
            :rules="[required]"
            class="pa-2"
          ></v-select>
        </v-col>
        <v-col size="6">
          <v-select
            v-model="formData.eventTypes"
            variant="solo"
            rounded="lg"
            label="Event Type"
            :items="eventTypes"
            :rules="[required]"
            class="pa-2"
          ></v-select>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col size="6" class="mr-4">
          <v-select
            v-model="formData.completionTypes"
            variant="solo"
            rounded="lg"
            label="Completion Types"
            :items="completionTypes"
            :rules="[required]"
            class="pa-2"
          ></v-select>
        </v-col>
        <v-col size="6">
          <v-select
            v-model="formData.attendanceTypes"
            variant="solo"
            rounded="lg"
            label="Attendance Type"
            :items="attendanceTypes"
            :rules="[required]"
            class="pa-2"
          ></v-select>
        </v-col>
      </v-row>

      <v-textarea
        v-model="formData.description"
        variant="solo"
        rounded="lg"
        label="Description"
        :rules="[required]"
        class="pa-2"
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
