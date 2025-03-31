<script setup>
import { computed, ref } from "vue";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import eventServices from "../../services/eventServices";

dayjs.extend(advancedFormat);

const emit = defineEmits(["attendance-updated"]);

const isHovered = ref(false);

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
});

const timeRecorded = computed(() => {
  if (!props.student.timeRecorded) {
    return "Not recorded";
  }
  return dayjs(props.student.timeRecorded).format("h:mm a [on] MM/DD/YYYY");
});

const handleCardClick = () => {
  const newAttendedStatus = !props.student.attendedStatus;

  eventServices
    .markAttendance(props.student.eventId, [props.student.studentId])
    .then(() => {
      props.student.attendedStatus = newAttendedStatus;
      emit("attendance-updated", props.student.studentId);
    })
    .catch((err) => {
      console.error("Error marking attendance:", err);
    });
};
</script>

<template>
  <v-card
    :class="{ hovered: isHovered, attended: props.student.attendedStatus }"
    color="backgroundDarken"
    class="fullWidthCard pa-3 ma-2"
    @click="handleCardClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    role="button"
    aria-label="Attendance card for {{ props.student.user?.fullName ?? 'Unknown' }} with ID {{ props.student.studentId ?? 'N/A' }}"
  >
    <v-container>
      <v-row>
        <v-sheet
          :color="'info'"
          class="accentChip ml-0 mr-2"
          width="15"
        ></v-sheet>

        <v-col>
          <v-card-text class="pa-0">
            <p class="text-h6 font-weight-bold">
              {{ props.student.user?.fullName ?? "Unknown" }}
              <span
                v-if="props.student.attendedStatus"
                class="status-indicator"
              >
                ✔
              </span>
            </p>
            <p class="text-body-2">
              Student ID: {{ props.student.studentId ?? "N/A" }}
            </p>
            <p class="text-body-2">Recorded Time: {{ timeRecorded }}</p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.fullWidthCard {
  max-height: auto; /* Allow the card to expand based on content */
  width: 100%; /* Full width of the row */
  border-radius: 25px;
  transition:
    box-shadow 0.3s,
    background-color 0.3s;
  margin: 10px 0; /* Vertical spacing */
}

.accentChip {
  border-radius: 25px 0 0 25px;
}

.hovered {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.attended {
  background-color: #d4edda; /* Green background for attended */
}

.status-indicator {
  color: #28a745; /* Green color for attendance indication */
  font-weight: bold;
}
</style>
