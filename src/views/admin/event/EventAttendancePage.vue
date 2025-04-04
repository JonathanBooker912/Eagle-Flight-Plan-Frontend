<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

import eventServices from "../../../services/eventServices";
import CardHeader from "../../../components/CardHeader.vue";
import ListTableRow from "../../../components/ListTableRow.vue";
import ListTableHeader from "../../../components/ListTableHeader.vue";

const route = useRoute();

const event = ref();
const eventId = ref();
const label = ref("");
const headers = [
  { name: "", cols: 1 },
  { name: "Student ID", cols: 2 },
  { name: "Name", cols: 2 },
  { name: "Status", cols: 2 },
  { name: "Recorded Time", cols: 3 },
  { name: "Actions", cols: 2 },
];
const students = ref([]);
const showFilters = ref(false);

const getRegisteredStudents = async () => {
  const response = await eventServices.getRegisteredStudents(eventId.value);
  return response.data;
};

const getData = async () => {
  event.value = (await eventServices.getEvent(route.params.id)).data;
  eventId.value = event.value.id;

  const registeredStudents = await getRegisteredStudents();
  students.value = registeredStudents.map((student) => ({
    fName: student.user?.fName ?? "Unknown",
    lName: student.user?.lName ?? "Unknown",
    studentId: student.studentId ?? "N/A",
    recordedTime: student.recordedTime ?? null,
    attendedStatus: student.attendedStatus,
    eventId: eventId.value,
  }));
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1;
  getEvents(page.value);
};

onMounted(async () => {
  await getData();

  console.log(students.value);
  label.value = `${event.value.name}'s Attendance`;
});
</script>

<template>
  <v-container fluid>
    <CardHeader :label="label" @toggle-filters="showFilters = !showFilters" />

    <!-- Header -->
    <ListTableHeader
      :headers="headers"
      :students="students"
      @attendance-updated="getData()"
    />

    <!-- Rows -->
    <v-row class="ma-0 pa-0">
      <v-col
        cols="12"
        v-for="(student, index) in students"
        :key="student.studentId"
        class="pa-0"
      >
        <ListTableRow :student="student" :headers="headers" />
      </v-col>
    </v-row>

    <template #pagination>
      <v-pagination
        v-model="page"
        :length="count"
        :total-visible="$vuetify.display.smAndDown ? 3 : 5"
        class="mt-4"
        @next="getEvents"
        @prev="getEvents"
        @update:model-value="getEvents"
      >
      </v-pagination>
    </template>
  </v-container>
</template>
