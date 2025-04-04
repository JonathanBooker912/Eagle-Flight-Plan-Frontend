<script setup>
import { computed, onMounted, ref } from "vue";
import { useSelectedStudentsStore } from "../../src/stores/selectedStudents";
import eventServices from "../services/eventServices";
import ConfirmDialog from "./dialogs/ConfirmDialog.vue";
const selectedStudentsStore = useSelectedStudentsStore();

const emit = defineEmits(["attendance-updated"]);

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  students: {
    type: Array,
    required: true,
  },
});

const confirmDelete = ref(false);
const confirmRecord = ref(false);

const closeDialogs = () => {
  confirmRecord.value = false;
  confirmDelete.value = false;
};

const confirmationDialog = (isDelete) => {
  console.log(isDelete);

  if (isDelete) {
    confirmDelete.value = true;
  } else {
    confirmRecord.value = true;
  }
};

const menuVisible = ref(false);

const checkedIn = ref(false);
const notCheckedIn = ref(false);

const hasAttendedSelected = computed(() => {
  return props.students.some(
    (student) =>
      selectedStudentsStore.selectedStudentIds.includes(student.studentId) &&
      student.attendedStatus
  );
});

const hasNotAttendedSelected = computed(() => {
  return props.students.some(
    (student) =>
      selectedStudentsStore.selectedStudentIds.includes(student.studentId) &&
      !student.attendedStatus
  );
});

const selectAllAttending = () => {
  checkedIn.value = true;
  notCheckedIn.value = false;
  const attendingStudentIds = props.students
    .filter((student) => student.attendedStatus)
    .map((student) => student.studentId);
  selectedStudentsStore.clearSelection();
  attendingStudentIds.forEach((id) => selectedStudentsStore.addStudent(id));

  if (attendingStudentIds.length == 0) {
    checkedIn.value = false;
  }
};

// Select all non-attending students
const selectAllNonAttending = () => {
  notCheckedIn.value = true;
  checkedIn.value = false;
  const nonAttendingStudentIds = props.students
    .filter((student) => !student.attendedStatus)
    .map((student) => student.studentId);
  selectedStudentsStore.clearSelection();
  nonAttendingStudentIds.forEach((id) => selectedStudentsStore.addStudent(id));

  if (nonAttendingStudentIds.length == 0) {
    notCheckedIn.value = false;
  }
};

const selectAll = () => {
  checkedIn.value = true;
  notCheckedIn.value = true;

  // Select all students
  const allStudentIds = props.students.map((student) => student.studentId);
  selectedStudentsStore.clearSelection();
  allStudentIds.forEach((id) => selectedStudentsStore.addStudent(id));
};

const resetSelection = () => {
  selectedStudentsStore.clearSelection();
  checkedIn.value = false;
  notCheckedIn.value = false;
};

const handleBatchDelete = async () => {
  const attendingStudentIds = props.students
    .filter(
      (student) =>
        student.attendedStatus &&
        selectedStudentsStore.selectedStudentIds.includes(student.studentId)
    )
    .map((student) => student.studentId);

  const attendingStudents = props.students.filter((student) =>
    attendingStudentIds.includes(student.studentId)
  );

  const deletePromises = attendingStudents.map((student) => {
    console.log(`Deleting attendance for student: ${student.studentId}`);
    return eventServices
      .markAttendance(student.eventId, [student.studentId])
      .then(() => {
        console.log(
          `Successfully deleted attendance for ${student.studentId} on event ${student.eventId}`
        );
      })
      .catch((err) => {
        console.error(
          `Error deleting attendance for ${student.studentId}:`,
          err
        );
      });
  });

  await Promise.all(deletePromises);

  emit("attendance-updated");
  resetSelection();
  closeDialogs();
};

const handleBatchCheckIn = async () => {
  const nonAttendingStudentIds = props.students
    .filter(
      (student) =>
        !student.attendedStatus &&
        selectedStudentsStore.selectedStudentIds.includes(student.studentId)
    )
    .map((student) => student.studentId);

  const nonAttendingStudents = props.students.filter((student) =>
    nonAttendingStudentIds.includes(student.studentId)
  );

  console.log("Students to mark attendance:", nonAttendingStudents);

  const attendancePromises = nonAttendingStudents.map((student) => {
    console.log(`Marking attendance for student: ${student.studentId}`);
    return eventServices
      .markAttendance(student.eventId, [student.studentId])
      .then(() => {
        console.log(
          `Successfully added attendance for ${student.studentId} on event ${student.eventId}`
        );
      })
      .catch((err) => {
        console.error(`Error adding attendance for ${student.studentId}:`, err);
      });
  });

  await Promise.all(attendancePromises);

  emit("attendance-updated");
  resetSelection();
  closeDialogs();
};

onMounted(() => {
  console.log(props.students);
});

const handleCheckboxToggle = () => {
  if (selectedStudentsStore.selectedStudentIds.length > 0) {
    checkedIn.value = false;
    notCheckedIn.value = false;
    selectedStudentsStore.clearSelection();
  } else if (checkedIn.value || notCheckedIn.value) {
    checkedIn.value = false;
    notCheckedIn.value = false;

    selectedStudentsStore.clearSelection();
  } else {
    selectAll();
  }
};
</script>

<template>
  <v-row class="pb-5 pl-4">
    <div class="button-container">
      <!-- Unified Styled Button Container -->
      <v-card
        color="primary"
        class="combined-button d-flex align-center rounded-lg px-2 py-1"
        @click.stop
      >
        <!-- Checkbox -->
        <v-checkbox
          hide-details
          density="compact"
          class="ma-0 pa-0"
          @click="handleCheckboxToggle"
          :model-value="hasAttendedSelected || hasNotAttendedSelected"
          color="white"
        ></v-checkbox>

        <!-- Dropdown Arrow -->
        <v-menu v-model="menuVisible" offset-y>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              size="small"
              class="dropdown-btn ma-0 pa-0"
              @click.stop
              variant="plain"
              style="
                min-width: 0;
                background-color: transparent;
                box-shadow: none;
              "
            >
              <v-icon color="white">mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="selectAll">
              <v-list-item-title>All</v-list-item-title>
            </v-list-item>
            <v-list-item @click="selectAllNonAttending">
              <v-list-item-title>Not Checked in</v-list-item-title>
            </v-list-item>
            <v-list-item @click="selectAllAttending">
              <v-list-item-title>Checked in</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card>

      <!-- Action Buttons -->
      <v-btn
        v-if="hasNotAttendedSelected"
        @click.stop="confirmationDialog(false)"
        color="success"
        class="rounded-lg"
        size="small"
      >
        <v-icon icon="mdi-check-circle" size="x-large" color="white"></v-icon>
      </v-btn>

      <v-btn
        v-if="hasAttendedSelected"
        @click.stop="confirmationDialog(true)"
        color="danger"
        class="rounded-lg"
        size="small"
      >
        <v-icon icon="mdi-delete" size="x-large" color="white"></v-icon>
      </v-btn>
    </div>
  </v-row>

  <v-card
    color="backgroundDarken"
    class="headerCard"
    role="row"
    aria-label="Table Header"
  >
    <v-container class="pa-0" fluid>
      <v-row>
        <v-col
          v-for="(header, index) in headers"
          :key="index"
          :cols="header.cols"
        >
          <v-card-text class="pa-0 text-center" v-if="index !== 0">
            <p class="text-h6 font-weight-bold">
              {{ header.name }}
            </p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <ConfirmDialog
    v-model="confirmDelete"
    title="Are you sure you want to batch delete?"
    confirmText="Delete"
    confirmColor="danger"
    @confirm="handleBatchDelete"
  />

  <!-- Confirm Record Dialog -->
  <ConfirmDialog
    v-model="confirmRecord"
    title="Are you sure you want to batch record?"
    confirmText="Record"
    confirmColor="success"
    @confirm="handleBatchCheckIn"
  />
</template>

<style scoped>
.headerCard {
  border-radius: 20px;
  height: 35px;
  margin: 5px 0;
  background-color: #333;
  color: #fff;
}

.button-container {
  display: flex;
  gap: 5%;
}

.combined-button {
  height: 30px;
  min-width: 50px;
}

.combined-button .v-checkbox {
  width: 24px;
  flex-shrink: 0;
}
</style>
