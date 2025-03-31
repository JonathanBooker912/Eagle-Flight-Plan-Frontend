<script setup>
import { computed, ref, onMounted } from "vue";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import eventServices from "../services/eventServices";

dayjs.extend(advancedFormat);

const emit = defineEmits(["attendance-updated"]);

const isHovered = ref(false);
const confirmDelete = ref(false);
const confirmRecord = ref(false);

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
});

onMounted(() => {
  console.log("Props received in ListTableRow:", props.student);
});

const timeRecorded = computed(() => {
  if (!props.student.timeRecorded) {
    return null;
  }
  return dayjs(props.student.timeRecorded).format("h:mm a [on] MM/DD/YYYY");
});

const confirmationDialog = (isDelete) => {
  console.log(isDelete);

  if (isDelete) {
    confirmDelete.value = true;
    console.log(confirmDelete);
  } else {
    confirmRecord.value = true;
  }
};

const handleCardClick = () => {
  const newAttendedStatus = !props.student.attendedStatus;

  eventServices
    .markAttendance(props.student.eventId, [props.student.studentId])
    .then(() => {
      props.student.attendedStatus = newAttendedStatus;

      if (newAttendedStatus) {
        props.student.timeRecorded = dayjs().toISOString();
      } else {
        props.student.timeRecorded = null;
      }

      emit("attendance-updated", props.student.studentId);
    })
    .catch((err) => {
      console.error("Error marking attendance:", err);
    });

  closeDialogs();
};

const closeDialogs = () => {
  confirmRecord.value = false;
  confirmDelete.value = false;
};
</script>

<template>
  <v-card
    :class="{ hovered: isHovered, attended: props.student.attendedStatus }"
    color="backgroundDarken"
    class="roundedCard"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    role="button"
    aria-label="Attendance card for {{ props.student.fName ?? 'Unknown' }} with ID {{ props.student.studentId ?? 'N/A' }}"
  >
    <v-container class="row-container">
      <v-row class="align-center">
        <v-col :cols="1" class="accentChip-container">
          <v-sheet
            :color="props.student.attendedStatus ? 'success' : 'info'"
            class="accentChip"
          ></v-sheet>
        </v-col>
        <!-- <v-sheet
          v-if="props.student.attendedStatus"
          color="success"
          class="half-circle"
        ></v-sheet>
        <v-sheet
          v-if="!props.student.attendedStatus"
          color="danger"
          class="half-circle"
        ></v-sheet> -->

        <!-- <v-col>
          <v-card-text class="pa-0 ml-8">
            <p class="text-h6 font-weight-bold">
              {{ props.student.studentId ?? "N/A" }}
            </p>
          </v-card-text>
        </v-col> -->

        <v-col>
          <v-card-text class="pa-0">
            <p class="text-h6 font-weight-bold">1564998</p>
          </v-card-text>
        </v-col>

        <v-col>
          <v-card-text class="pa-0">
            <p class="text-h6 font-weight-bold">
              {{
                props.student.lName + ", " + props.student.fName ?? "Unknown"
              }}
            </p>
          </v-card-text>
        </v-col>

        <v-col>
          <v-card-text class="pa-0">
            <p class="text-h6 font-weight-bold">
              {{ timeRecorded }}
            </p>
          </v-card-text>
        </v-col>

        <v-col>
          <v-card-text class="pa-0">
            <v-icon
              v-if="!props.student.attendedStatus"
              icon="mdi-account-multiple-plus"
              @click="confirmationDialog(false)"
              color="success"
              size="x-large"
            ></v-icon>

            <v-icon
              v-if="props.student.attendedStatus"
              @click="confirmationDialog(true)"
              icon="mdi-delete"
              color="danger"
              size="x-large"
            ></v-icon>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-dialog v-model="confirmDelete" width="300px"
    ><v-card color="backgroundDarken rounded-lg">
      <v-card-text>
        <div style="text-align: center">
          <h3>Are you sure?</h3>
        </div>
        <div class="mt-5" style="display: flex; justify-content: center">
          <v-btn
            class="mr-2"
            variant="outlined"
            rounded="xl"
            @click="closeDialogs"
            >Cancel</v-btn
          >
          <v-btn rounded="xl" color="danger" @click="handleCardClick"
            >Delete</v-btn
          >
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="confirmRecord" width="300px"
    ><v-card color="backgroundDarken rounded-lg">
      <v-card-text>
        <div style="text-align: center">
          <h3>Are you sure?</h3>
          <div class="mt-5" style="display: flex; justify-content: center">
            <v-btn
              class="mr-2"
              variant="outlined"
              rounded="xl"
              @click="closeDialogs"
              >Cancel</v-btn
            >
            <v-btn rounded="xl" color="success" @click="handleCardClick"
              >Record</v-btn
            >
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.hovered {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.status-indicator {
  color: #28a745; /* Green color for attendance indication */
  font-weight: bold;
}

.roundedCard {
  border-radius: 20px;
  margin: 5px 0;
  transition:
    box-shadow 0.3s,
    background-color 0.3s;
  overflow: hidden;
}

.row-container {
  text-align: left;
  height: 44px;
  padding: 0;
}

.accentChip {
  width: 15px;
  height: 25px;
  border-radius: 25px 0px 0px 25px;
}

.accentChip-container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 15px;
}
</style>
