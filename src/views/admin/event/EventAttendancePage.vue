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
import userServices from "../../../services/userServices";
import studentServices from "../../../services/studentServices";

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
const csvData = ref([]);
const snackbar = ref({
  show: false,
  message: "",
  color: "success",
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
  try {
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
      id: student.id, // Add the student ID to the mapped data
    }));

    // Show success message if we have students
    if (students.value.length > 0) {
      snackbar.value = {
        show: true,
        message: `Successfully loaded ${students.value.length} students`,
        color: "success",
      };
    }
  } catch (error) {
    console.error("Error loading students:", error);
    snackbar.value = {
      show: true,
      message: "Error loading students. Please try again.",
      color: "error",
    };
  }
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
        const requiredHeaders = [
          "First Name",
          "Last Name",
          "Email Address",
          "Checked In",
        ];
        const missingHeaders = requiredHeaders.filter(
          (header) => !results.meta.fields.includes(header),
        );

        if (missingHeaders.length > 0) {
          alert(`Missing required headers: ${missingHeaders.join(", ")}`);
          return;
        }

        csvData.value = results.data;
      },
    });
  }
};

const handleImport = () => {
  showImportDialog.value = true;
};

const submitImport = async () => {
  try {
    // Transform and validate data
    const transformedData = csvData.value
      .filter((row) => row["Checked In"]) // Only include rows with a Checked In value
      .map((row) => {
        if (!row["First Name"] || !row["Last Name"] || !row["Email Address"]) {
          throw new Error(
            `Missing required fields for row: ${JSON.stringify(row)}`,
          );
        }

        return {
          email: row["Email Address"],
          checkedIn: row["Checked In"],
          eventId: eventId.value,
          fullName: `${row["First Name"]} ${row["Last Name"]}`,
          fName: row["First Name"],
          lName: row["Last Name"],
        };
      });

    if (transformedData.length === 0) {
      throw new Error(
        "No valid records to import. Please ensure at least one record has a Checked In value.",
      );
    }

    // Remove duplicates by keeping only the first occurrence of each email
    const uniqueData = transformedData.reduce((acc, current) => {
      const exists = acc.find((item) => item.email === current.email);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // For each unique record, check if user exists and create if needed
    for (const record of uniqueData) {
      try {
        let userId;
        try {
          // Check if user exists
          const userResponse = await userServices.getUserByEmail(record.email);
          userId = userResponse.data?.id;
        } catch (error) {
          if (error.response?.status === 404) {
            // User not found, create new user
            const newUserResponse = await userServices.createUser({
              email: record.email,
              fName: record.fName,
              lName: record.lName,
              fullName: record.fullName,
            });
            userId = newUserResponse.data.id;

            // Create new student for the user
            try {
              console.log("Creating student for user:", userId);
              const studentResponse = await studentServices.createStudent({
                userId: userId,
                graduationDate: new Date(new Date().getFullYear() + 4, 0, 1), // Default to 4 years from now
                pointsAwarded: 0,
                pointsUsed: 0,
              });

              console.log("Student creation response:", studentResponse);

              if (!studentResponse.data?.id) {
                throw new Error(
                  "Failed to create student record - no student ID returned",
                );
              }

              // Add student ID to the record
              record.studentId = studentResponse.data.id;
            } catch (studentError) {
              console.error("Error creating student:", studentError);
              throw new Error(
                `Failed to create student: ${studentError.message}`,
              );
            }
          } else {
            throw error;
          }
        }

        // Add userId to the record for attendance
        record.userId = userId;
      } catch (error) {
        console.error(`Error processing user ${record.email}:`, error);
        snackbar.value = {
          show: true,
          message: `Error processing user ${record.email}: ${error.message}`,
          color: "error",
        };
        continue; // Skip this record but continue with others
      }
    }

    // Send to backend
    await eventServices.importAttendance(uniqueData);

    // Refresh the data and close dialog
    await getData();
    showImportDialog.value = false;
    csvFile.value = null;
    csvData.value = [];

    // Show success message
    snackbar.value = {
      show: true,
      message: "Attendance imported successfully!",
      color: "success",
    };
  } catch (error) {
    console.error("Import error:", error);
    snackbar.value = {
      show: true,
      message: `Import failed: ${error.message}`,
      color: "error",
    };
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
    <v-btn color="primary" prepend-icon="mdi-import" @click="handleImport">
      Import
    </v-btn>

    <v-dialog v-model="showImportDialog" max-width="400">
      <v-card color="backgroundDarken" class="rounded-lg">
        <v-card-text>
          <div style="text-align: center">
            <h3>Import Attendance</h3>
          </div>
          <v-file-input
            v-model="csvFile"
            accept=".csv"
            label="CSV File"
            prepend-icon="mdi-file-document"
            variant="outlined"
            density="comfortable"
            class="mt-4"
            @change="handleFileUpload"
          />
          <div class="mt-5" style="display: flex; justify-content: center">
            <v-btn
              class="mr-2"
              variant="outlined"
              rounded="xl"
              @click="showImportDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              rounded="xl"
              color="primary"
              :disabled="!csvData.length"
              @click="submitImport"
            >
              Import
            </v-btn>
          </div>
        </v-card-text>
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

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    location="top"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>
