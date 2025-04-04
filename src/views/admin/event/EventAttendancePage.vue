<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import eventServices from "../../../services/eventServices";
import CardHeader from "../../../components/CardHeader.vue";
import ListTable from "../../../components/ListTable.vue";
import ListTableHeader from "../../../components/ListTableHeader.vue";
import { useSelectedStudentsStore } from "../../../stores/selectedStudents";
import AttendanceStudentRow from "../../../components/AttendanceStudentRow.vue";

const selectedStudentsStore = useSelectedStudentsStore();

const route = useRoute();
const event = ref();
const eventId = ref();
const label = ref("");
const showFilters = ref(false);
const students = ref([]);
const page = ref(1);
const count = ref(1); // Placeholder if pagination is needed later

const headers = [
  { name: "", cols: 1 },
  { name: "Student ID", cols: 2 },
  { name: "Name", cols: 2 },
  { name: "Status", cols: 2 },
  { name: "Recorded Time", cols: 3 },
  { name: "Actions", cols: 2 },
];

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

const updateStudent = (updatedStudent) => {
  const index = students.value.findIndex(
    (s) => s.studentId === updatedStudent.studentId
  );
  if (index !== -1) {
    students.value[index] = updatedStudent;
  }
};

onMounted(async () => {
  selectedStudentsStore.clearSelection();
  await getData();
  label.value = `${event.value.name}'s Attendance`;
});
</script>

<template>
  <v-container fluid>
    <CardHeader :label="label" @toggle-filters="showFilters = !showFilters" />

    <ListTable :items="students" :showFilters="showFilters">
      <template #header>
        <ListTableHeader
          :headers="headers"
          :students="students"
          @attendance-updated="getData"
        />
      </template>

      <template #default="{ item }">
        <AttendanceStudentRow :student="item" @update-student="getData" />
      </template>

      <template #pagination>
        <v-pagination
          v-model="page"
          :length="count"
          :total-visible="$vuetify.display.smAndDown ? 3 : 5"
          class="mt-4"
        />
      </template>
    </ListTable>
  </v-container>
</template>
