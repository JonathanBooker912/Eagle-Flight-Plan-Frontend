<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import eventServices from "../../../services/eventServices";
import CardHeader from "../../../components/CardHeader.vue";
import ListTableRow from "../../../components/ListTableRow.vue";
import ListTableHeader from "../../../components/ListTableHeader.vue";

const route = useRoute();

const event = ref();
const eventId = ref();
const label = ref("");
const headers = ["", "Student ID", "Name", "Recorded Time", "Actions"]; // Define the headers for the table
const students = ref([]); // Single list of students
const showFilters = ref(false);

// Function to get registered students for the event
const getRegisteredStudents = async () => {
  const response = await eventServices.getRegisteredStudents(eventId.value);
  return response.data;
};

onMounted(async () => {
  event.value = (await eventServices.getEvent(route.params.id)).data;
  eventId.value = event.value.id;

  const registeredStudents = await getRegisteredStudents();
  students.value = registeredStudents.map((student) => ({
    fName: student.user?.fName ?? "Unknown",
    lName: student.user?.lName ?? "Unknown",
    studentId: student.studentId ?? "N/A",
    timeRecorded: student.timeRecorded
      ? dayjs(student.timeRecorded).format("h:mm a [on] MM/DD/YYYY")
      : null,
    attendedStatus: student.attendedStatus,
    eventId: eventId.value,
  }));

  console.log(students.value);
  label.value = `${event.value.name}'s Attendance`;
});
</script>

<template>
  <v-container fluid>
    <CardHeader :label="label" @toggle-filters="showFilters = !showFilters" />

    <v-container fluid class="table-container">
      <!-- Header -->
      <ListTableHeader :headers="headers" />

      <!-- Rows -->
      <v-row class="ma-0 pa-0 no-gutters" dense>
        <v-col
          cols="12"
          v-for="(student, index) in students"
          :key="student.studentId"
          class="pa-0"
        >
          <ListTableRow :student="student" :headers="headers" />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.table-container {
  max-width: 100%; /* Ensure the table spans the full width */
  margin: 0 auto; /* Center the table on larger screens */
  padding: 0; /* Remove padding */
}
</style>
