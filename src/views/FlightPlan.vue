<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardHeader from "../components/CardHeader.vue";
import CardTable from "../components/CardTable.vue";
import flightPlanServices from "../services/flightPlanServices";
import flightPlanItemServices from "../services/flightPlanItemServices";
import FlightPlanItemCard from "../components/cards/FlightPlanItemCard.vue";
import { useDisplay } from "vuetify";
import { userStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import studentServices from "../services/studentServices";
import StudentApprovalDialog from "../components/dialogs/StudentApprovalDialog.vue";
import { studentApprovalDialogStore } from "../stores/studentApprovalDialogStore";
import ViewSubmissionDialog from "../components/dialogs/ViewSubmissionDialog.vue";
import { studentViewSubmissionDialogStore } from "../stores/studentViewSubmissionDialogStore";
import userServices from "../services/userServices";
const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

let student = null;

const route = useRoute();
const router = useRouter();
const flightPlan = ref(null);
const selectedFlightPlan = ref(null);
const flightPlans = ref([]);
const flightPlanItems = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);
const progress = ref(0);
const flightPlanItemTypes = ref([]);
const flightPlanItemStatuses = ref([]);
const points = ref(0);
const userName = ref(null);

const useStudentApprovalDialogStore = studentApprovalDialogStore();
const useStudentViewSubmissionDialogStore = studentViewSubmissionDialogStore();
const useUserStore = userStore();
const { user } = storeToRefs(useUserStore);

const showFilters = ref(false);
const filters = ref({
  status: null,
  flightPlanItemType: null,
});

const display = useDisplay();

const numCardColumns = computed(() => {
  if (display.xxl.value) return 4;
  if (display.xl.value) return 3;
  if (display.lg.value) return 3;
  if (display.md.value) return showFilters.value ? 1 : 2;
  if (display.sm.value) return 1;
  return 1; // Default for xs
});
const pageSize = computed(() => numCardColumns.value * 2);

const fetchStudent = async () => {
  let studentResponse;

  if (props.isAdmin) {
    studentResponse = await studentServices.getStudent(route.params.id);
    const userResponse = await userServices.getOneUser(
      studentResponse.data.userId,
    );
    userName.value = userResponse.data.fullName;
  } else {
    studentResponse = await studentServices.getStudentForUserId(
      user.value.userId,
    );
  }

  student = studentResponse.data;
  const pointsResponse = await studentServices.getPoints(student.id);
  points.value = pointsResponse.data.points;
};

const fetchFlightPlan = async () => {
  const formatFlightPlanLabel = (flightPlan) => {
    const term =
      flightPlan.semester?.term?.charAt(0).toUpperCase() +
      flightPlan.semester?.term?.slice(1);
    return `${term} ${flightPlan.semester?.year}`;
  };

  const response = await flightPlanServices.getFlightPlanForStudent(student.id);

  flightPlans.value = response.data.map((flightPlan) => ({
    label: formatFlightPlanLabel(flightPlan),
    value: flightPlan.id,
  }));

  selectedFlightPlan.value = flightPlans.value[0];
  flightPlan.value = response.data[0];
};

const fetchFlightPlanAndItems = async () => {
  const params = {
    page: page.value,
    pageSize: pageSize.value,
    searchQuery: searchQuery.value,
    filters: filters.value,
  };

  const response =
    await flightPlanItemServices.getAllFlightPlanItemsForFlightPlan(
      selectedFlightPlan.value.value,
      params,
    );

  flightPlanItems.value = response.data.flightPlanItems;
  count.value = response.data.count;
};

const fetchFlightPlanProgress = async () => {
  const response = await flightPlanServices.getFlightPlanProgressForFlightPlan(
    selectedFlightPlan.value.value,
  );
  progress.value = response.data.progress;
};

const fetchFlightPlanItemTypes = async () => {
  const response = await flightPlanItemServices.getFlightPlanItemTypes();
  flightPlanItemTypes.value = response.data;
};

const fetchFlightPlanItemStatuses = async () => {
  const response = await flightPlanItemServices.getFlightPlanItemStatuses();
  flightPlanItemStatuses.value = response.data;
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1; // Reset to first page on search change
};

const handleAdd = () => {
  router.push({ name: "addItemToFlightPlan" });
};

const handleChangeFilters = () => {
  fetchFlightPlanAndItems();
};

const handleClearFilters = () => {
  filters.value = {
    status: null,
    flightPlanItemType: null,
  };
  fetchFlightPlanAndItems();
};

const handleIncompleteButtonClick = (flightPlanItem) => {
  useStudentApprovalDialogStore.toggleVisibility();
  useStudentApprovalDialogStore.setFlightPlanItem(flightPlanItem);
};

const handlePendingButtonClick = (flightPlanItem) => {
  useStudentViewSubmissionDialogStore.setFlightPlanItem(flightPlanItem);
  useStudentViewSubmissionDialogStore.toggleVisibility();
};

onMounted(async () => {
  await fetchStudent();
  await fetchFlightPlan();
  if (flightPlan.value) {
    await Promise.all([
      fetchFlightPlanAndItems(),
      fetchFlightPlanProgress(),
      fetchFlightPlanItemStatuses(),
      fetchFlightPlanItemTypes(),
    ]);
  }
});

watch(selectedFlightPlan, () => {
  fetchFlightPlanAndItems();
  fetchFlightPlanProgress();
});

watch([page, searchQuery], fetchFlightPlanAndItems);
</script>
<template>
  <v-container fluid>
    <div v-if="props.isAdmin">
      <div class="mt-2 d-flex justify-center">
        <div class="mr-4 mb-5 text-h5">{{ userName }}</div>
      </div>
      <v-row>
        <v-col :cols="6" class="d-flex justify-end">
          <v-select
            v-model="selectedFlightPlan"
            :items="flightPlans"
            :item-title="(item) => item.label"
            :item-value="(item) => item.value"
            variant="solo"
            bg-color="background"
            return-object
            flat
            class="flex-grow-0"
            density="comfortable"
          ></v-select
        ></v-col>
        <v-col :cols="6" class="d-flex justify-start align-center mb-6">
          <span class="text-subtitle-1"> Available Points: {{ points }} </span>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <div class="mt-2 d-flex justify-center">
        <v-select
          v-model="selectedFlightPlan"
          :items="flightPlans"
          :item-title="(item) => item.label"
          :item-value="(item) => item.value"
          variant="solo"
          bg-color="background"
          return-object
          class="flex-grow-0"
          density="comfortable"
          flat
        ></v-select>
      </div>
      <div class="mt-2 d-flex align-center">
        <span class="flex-grow-1 text-center text-subtitle-1">
          Available Points: {{ points }}
        </span>
      </div>
    </div>

    <v-container>
      <v-progress-linear
        v-model="progress"
        color="primary"
        bg-color="backgroundLighten"
        height="20"
        rounded
      >
        <strong>{{ progress }}%</strong></v-progress-linear
      >
    </v-container>
    <CardHeader
      :add-button="props.isAdmin ? true : false"
      @add="handleAdd"
      @changed="handleSearchChange"
      @toggle-filters="showFilters = !showfilters"
    ></CardHeader>
    <CardTable
      :items="flightPlanItems"
      :per-row-lg="3"
      :per-row-md="2"
      :per-row-sm="1"
      :show-filters="showFilters"
      @update-filters="handleChangeFilters"
      @clear-filters="handleClearFilters"
      @close-filter-menu="showFilters = false"
    >
      <template #item="{ item }">
        <FlightPlanItemCard
          :key="item.id"
          :flight-plan-item="item"
          :is-admin="props.isAdmin"
          @incomplete="handleIncompleteButtonClick"
          @view="handlePendingButtonClick"
        ></FlightPlanItemCard>
      </template>
      <template #filters>
        <v-select
          v-model="filters.flightPlanItemType"
          :items="flightPlanItemTypes"
          label="Type"
        ></v-select>
        <v-select
          v-model="filters.status"
          :items="flightPlanItemStatuses"
          label="Status"
        ></v-select>
      </template>

      <template #pagination>
        <v-pagination
          v-model="page"
          :length="count"
          :total-visible="$vuetify.display.smAndDown ? 3 : 5"
          class="mt-2"
          @next="fetchFlightPlanAndItems"
          @prev="fetchFlightPlanAndItems"
          @update:model-value="fetchFlightPlanAndItems"
        >
        </v-pagination>
      </template>
    </CardTable>
  </v-container>
  <StudentApprovalDialog
    @submit="fetchFlightPlanAndItems"
  ></StudentApprovalDialog>
  <ViewSubmissionDialog
    @discard="fetchFlightPlanAndItems"
  ></ViewSubmissionDialog>
</template>
