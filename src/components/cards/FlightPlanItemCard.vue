<script setup>
import { computed } from "vue";

const props = defineProps({
  flightPlanItem: {
    type: Object,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isFlightPlanView: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "incomplete",
  "view",
  "register",
  "sign-in",
  "click",
]);

const color = computed(
  () =>
    ({
      Incomplete: "danger",
      Rejected: "danger",
      Pending: "warning",
      Registered: "warning",
    })[props.flightPlanItem.status] || "primary",
);

const points = computed(() => {
  console.log(props.flightPlanItem);
  return {
    Task: props.flightPlanItem.task?.points,
    Experience: props.flightPlanItem.experience?.points,
  }[props.flightPlanItem.flightPlanItemType];
});

const handleClick = () => {
  emit("click");
};
</script>
<template>
  <v-card
    color="backgroundDarken"
    class="cardContainer pa-0 ma-1"
    @click="handleClick"
  >
    <v-container class="pa-2">
      <v-row no-gutters>
        <v-col cols="1">
          <v-sheet :color="color" class="accentChip mr-2 h-100"></v-sheet>
        </v-col>

        <v-col cols="11">
          <v-card-text class="text-no-wrap">
            <v-tooltip bottom>
              <!-- eslint-disable-next-line vue/no-template-shadow -->
              <template v-slot:activator="{ props }">
                <p v-bind="props" class="text-h6 mb-2 truncate-text">
                  {{ flightPlanItem.name }}
                </p>
              </template>
              <span>{{ flightPlanItem.name }}</span>
            </v-tooltip>
            <p>{{ flightPlanItem.flightPlanItemType }}</p>
            <p>{{ flightPlanItem.status }}</p>
            <p
              v-if="
                flightPlanItem.status == 'Complete' ||
                flightPlanItem.status == 'Registered' ||
                isAdmin
              "
              class="mb-5"
            >
              Points: {{ points }}
            </p>
            <p v-else>Points: {{ points }}</p></v-card-text
          >

          <div v-if="!props.isAdmin">
            <!-- Incomplete Task -->
            <v-row
              v-if="
                flightPlanItem.status == 'Incomplete' &&
                flightPlanItem.flightPlanItemType == 'Task' &&
                isFlightPlanView
              "
              justify="end"
              ><v-btn
                v-if="!props.isAdmin"
                class="mr-4 mb-3"
                variant="outlined"
                rounded="xl"
                @click="emit('incomplete', props.flightPlanItem)"
              >
                Incomplete
                <v-icon right class="pl-1">mdi-upload</v-icon>
              </v-btn>
            </v-row>

            <!-- Rejected Task -->
            <v-row
              v-if="
                flightPlanItem.status == 'Rejected' &&
                flightPlanItem.flightPlanItemType == 'Task' &&
                isFlightPlanView
              "
              justify="end"
              ><v-btn
                class="mr-4 mb-3"
                variant="outlined"
                rounded="xl"
                @click="emit('incomplete', props.flightPlanItem)"
              >
                Rejected
                <v-icon right class="pl-1">mdi-upload</v-icon>
              </v-btn></v-row
            >

            <!-- Register for Experience -->
            <v-row
              v-if="
                flightPlanItem.status == 'Incomplete' &&
                flightPlanItem.flightPlanItemType == 'Experience' &&
                isFlightPlanView
              "
              justify="end"
              ><v-btn
                class="mr-4 mb-3"
                variant="outlined"
                rounded="xl"
                @click="emit('register', props.flightPlanItem)"
              >
                Register
                <v-icon right class="pl-1">mdi-account-plus</v-icon>
              </v-btn></v-row
            >

            <!-- Pending Task -->
            <v-row v-else-if="flightPlanItem.status == 'Pending'" justify="end"
              ><v-btn
                class="mr-4 mb-3"
                rounded="xl"
                variant="outlined"
                @click="emit('view', props.flightPlanItem)"
              >
                View Submission<v-icon right class="pl-1">mdi-eye</v-icon>
              </v-btn></v-row
            >
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
.cardContainer {
  border-radius: 25px;
}
.accentChip {
  border-radius: 20px 0px 0px 20px;
}
.truncate-text {
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflowing text */
  text-overflow: ellipsis; /* Adds '...' when text overflows */
  max-width: 80%; /* Adjust based on your layout */
  display: block; /* Ensures it works properly */
}
</style>
