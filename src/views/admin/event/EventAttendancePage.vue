<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import Papa from "papaparse";

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
const showImportDialog = ref(false);
const csvFile = ref(null);
const csvHeaders = ref([]);
const csvData = ref([]);
const mapping = ref({
  attendeeId: "Attendee ID",
  fName: "First Name",
  lName: "Last Name",
  email: "Email",
  institution: "Institution",
  registered: "Registered",
  checkedIn: "Checked In",
  username: "Username",
  college: "Collge",
  major: "Major",
  schoolYear: "School Year",
  totalCheckIns: "Total Check Ins"
});

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

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Validate required headers
        const requiredHeaders = ["First Name", "Last Name", "Email", "Checked In"];
        const missingHeaders = requiredHeaders.filter(header => !results.meta.fields.includes(header));
        
        if (missingHeaders.length > 0) {
          alert(`Missing required headers: ${missingHeaders.join(", ")}`);
          return;
        }
        
        csvData.value = results.data;
      }
    });
  }
};

const handleImport = () => {
  showImportDialog.value = true;
};

const submitImport = async () => {
  try {
    // Transform and validate data
    const transformedData = csvData.value.map(row => {
      if (!row["First Name"] || !row["Last Name"] || !row["Email"] || !row["Checked In"]) {
        throw new Error(`Missing required fields for row: ${JSON.stringify(row)}`);
      }

      return {
        email: row["Email"],
        checkedIn: row["Checked In"],
        eventId: eventId.value
      };
    });

    // Send to backend
    const response = await eventServices.importAttendance(transformedData);
    
    if (response.success) {
      // Refresh the data
      await getData();
      showImportDialog.value = false;
    } else {
      throw new Error(response.message || "Import failed");
    }
  } catch (error) {
    console.error("Import error:", error);
    alert(`Import failed: ${error.message}`);
  }
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
    <v-btn
      color="primary"
      prepend-icon="mdi-import"
      @click="handleImport"
    >
      Import
    </v-btn>

    <v-dialog v-model="showImportDialog" max-width="800">
      <v-card>
        <v-card-title>Import Attendance</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="csvFile"
            accept=".csv"
            label="CSV File"
            @change="handleFileUpload"
          />

          <v-divider class="my-4" />

          <div v-if="csvData.length > 0">
            <h3 class="mb-4">Preview</h3>
            <v-table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Checked In</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in csvData.slice(0, 5)" :key="index">
                  <td>{{ row["First Name"] }} {{ row["Last Name"] }}</td>
                  <td>{{ row["Email"] }}</td>
                  <td>{{ row["Checked In"] }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submitImport" :disabled="!csvData.length">Import</v-btn>
          <v-btn @click="showImportDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
