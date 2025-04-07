<script setup>
import { ref, onMounted, computed } from "vue";
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
const searchQuery = ref("");
const students = ref([]);
const page = ref(1);
const itemsPerPage = 5;

const count = computed(() => Math.ceil(students.value.length / itemsPerPage));

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;

  const query = searchQuery.value.toLowerCase();

  return students.value.filter((student) => {
    const fullName = `${student.fName} ${student.lName}`.toLowerCase();
    return fullName.includes(query);
  });
});

const pagedStudents = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const currentPageStudents = filteredStudents.value.slice(
    start,
    start + itemsPerPage,
  );

  const missingCount = itemsPerPage - currentPageStudents.length;
  const placeholders = Array(missingCount).fill(null);

  return [...currentPageStudents, ...placeholders];
});

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

onMounted(async () => {
  selectedStudentsStore.clearSelection();
  await getData();
  label.value = `${event.value.name}'s Attendance`;
});

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1;
  getRegisteredStudents(page.value);
};
</script>

<template>
  <v-container fluid>
    <CardHeader
      :label="label"
      :add-button="false"
      :filter-button="false"
      @changed="handleSearchChange"
    />
    <ListTable :items="pagedStudents" :show-filters="showFilters">
      <template #header>
        <ListTableHeader
          :headers="headers"
          :students="filteredStudents.filter((s) => s !== null)"
          @attendance-updated="getData"
        />
      </template>

      <template #default="{ item }">
        <AttendanceStudentRow
          v-if="item"
          :student="item"
          @update-student="getData"
        />
        <div v-else class="empty-card" />
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
