<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import CardHeader from "../components/CardHeader.vue";
import CardTable from "../components/CardTable.vue";
import SortSelect from "../components/SortSelect.vue";
import flightPlanServices from "../services/flightPlanServices";
import flightPlanItemServices from "../services/flightPlanItemServices";
import FlightPlanItemCard from "../components/cards/FlightPlanItemCard.vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const sortProperties = [
  {
    title: "Status",
    value: "status",
  },
  {
    title: "Type",
    value: "flightPlanItemType",
  },
  {
    title: "Name",
    value: "name",
  },
];

const route = useRoute();
const router = useRouter();
const flightPlan = ref(null);
const flightPlanItems = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);
const progress = ref(0);
const flightPlanItemTypes = ref([]);
const flightPlanItemStatuses = ref([]);

const showFilters = ref(false);
const filters = ref({
  status: null,
  flightPlanItemType: null,
});

const sortOptions = ref({
  sortAttribute: sortProperties[0].value,
  sortDirection: "asc",
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

const fetchFlightPlan = async () => {
  const response = await flightPlanServices.getFlightPlanForStudent(
    route.params.id,
  );
  flightPlan.value = response.data[0];
};

const fetchFlightPlanAndItems = async () => {
  const response =
    await flightPlanItemServices.getAllFlightPlanItemsForFlightPlan(
      flightPlan.value.id,
      page.value,
      pageSize.value,
      searchQuery.value,
      { ...filters.value, ...sortOptions.value },
    );
  flightPlanItems.value = response.data.flightPlanItems;
  count.value = response.data.count;
};

const fetchFlightPlanProgress = async () => {
  const response = await flightPlanServices.getFlightPlanProgressForFlightPlan(
    flightPlan.value.id,
  );
  progress.value = response.data.progress;
};

const fetchFlightPlanItemTypes = () => {
  flightPlanItemServices.getFlightPlanItemTypes().then((response) => {
    flightPlanItemTypes.value = response.data;
  });
};

const fetchFlightPlanItemStatuses = () => {
  flightPlanItemServices.getFlightPlanItemStatuses().then((response) => {
    flightPlanItemStatuses.value = response.data;
  });
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

onMounted(async () => {
  await fetchFlightPlan();
  await Promise.all([fetchFlightPlanAndItems(), fetchFlightPlanProgress()]);
  fetchFlightPlanItemStatuses();
  fetchFlightPlanItemTypes();
});

watch([page, searchQuery], fetchFlightPlanAndItems);
</script>
<template>
  <v-container fluid>
    <h1 class="text-center mt-2">
      {{ route.params.studentName || "No Name" }}
    </h1>
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
        ></FlightPlanItemCard>
      </template>
      <template #filters>
        <v-select
          v-model="filters.flightPlanpnItemType"
          :items="flightPlanItemTypes"
          label="Type"
        ></v-select>
        <v-select
          v-model="filters.status"
          :items="flightPlanItemStatuses"
          label="Status"
        ></v-select>
        <SortSelect
          v-model="sortOptions"
          :sort-options="sortProperties"
        ></SortSelect>
      </template>

      <template #pagination>
        <v-pagination
          v-model="page"
          :length="count"
          :total-visible="$vuetify.display.smAndDown ? 3 : 5"
          class="m-2"
          @next="fetchFlightPlanAndItems"
          @prev="fetchFlightPlanAndItems"
          @update:model-value="fetchFlightPlanAndItems"
        >
        </v-pagination>
      </template>
    </CardTable>
  </v-container>
</template>
