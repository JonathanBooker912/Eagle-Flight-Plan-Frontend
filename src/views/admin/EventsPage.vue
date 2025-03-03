<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import EventServices from "../../services/eventServices.js";
import StrengthServices from "../../services/strengthServices.js";
import EventCard from "../../components/cards/EventCard.vue";
import CardTable from "../../components/CardTable.vue";
import CardHeader from "../../components/CardHeader.vue";
import DatePickerField from "../../components/DatePickerField.vue";
import SortSelect from "../../components/SortSelect.vue";

// Constants
const label = "Events";

const sortProperties = [
  {
    title: "Start Date",
    value: "startTime",
  },
  {
    title: "Name",
    value: "name",
  },
  {
    title: "Location",
    value: "location",
  },
];

// Reactive states
const router = useRouter();
const events = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);

const strengths = ref([]);

const showFilters = ref(false);
const filters = ref({
  startDate: null,
  endDate: null,
  location: null,
  strengths: null,
});

const sortOptions = ref({
  sortAttribute: sortProperties[0].value,
  sortDirection: "asc",
});

const display = useDisplay();

const numCardColumns = computed(() => {
  if (display.xl.value) return showFilters.value ? 3 : 4;
  if (display.lg.value) return showFilters.value ? 3 : 4;
  if (display.md.value) return showFilters.value ? 2 : 3;
  if (display.sm.value) return showFilters.value ? 1 : 2;
  return 1; // Default for xs
});
const pageSize = computed(() => numCardColumns.value * 2);

watch(showFilters, () => getEvents());

// Fetch events
const getEvents = async (pageNumber = page.value) => {
  try {
    const result = await EventServices.getAllEvents(
      pageNumber,
      pageSize.value,
      searchQuery.value,
      { ...filters.value, ...sortOptions.value }
    );
    events.value = result.data.events;
    count.value = result.data.count;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

const getStrengths = () => {
  StrengthServices.getAllStrengths().then((response) => {
    strengths.value = response.data;
  });
};

// Handlers
const handleAdd = () => router.push({ name: "addEvent" });
const handleEdit = (eventId) =>
  router.push({ name: "editEvent", params: { id: eventId } });

const handleDelete = async (eventId) => {
  try {
    await EventServices.deleteTask(eventId);
    await getEvents(); // Re-fetch events after delete
  } catch (error) {
    console.error("Error deleting Event:", error);
  }
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1; // Reset to first page on search change
  getEvents(page.value);
};

const handleChangeFilters = () => {
  if (filters.value.strengths && filters.value.strengths.length > 0) {
    filters.value.strengths = filters.value.strengths.map(
      (strength) => strength.id
    );
  }
  getEvents();
};
const handleClearFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
    location: null,
  };
  getEvents();
};

// Initial fetch
onMounted(() => {
  getEvents();
  getStrengths();
});
</script>
<template>
  <v-container fluid>
    <CardHeader
      :label="label"
      @changed="handleSearchChange"
      @add="handleAdd"
      @toggle-filters="showFilters = !showFilters"
    ></CardHeader>
    <CardTable
      :items="events"
      :per-row-lg="showFilters ? 3 : 4"
      :per-row-md="showFilters ? 2 : 3"
      :per-row-sm="showFilters ? 1 : 2"
      :show-filters="showFilters"
      @update-filters="handleChangeFilters"
      @clear-filters="handleClearFilters"
      @close-filter-menu="showFilters = false"
    >
      <template #item="{ item }">
        <EventCard
          :event="item"
          @edit="handleEdit"
          @delete="handleDelete"
        ></EventCard>
      </template>
      <template #filters>
        <DatePickerField label="Start Date" v-model="filters.startDate" />
        <DatePickerField label="End Date" v-model="filters.endDate" />
        <v-combobox
          v-model="filters.strengths"
          :items="strengths"
          item-title="name"
          item-value="id"
          label="Strengths"
          multiple
          chips
          clearable
        ></v-combobox>
        <v-text-field
          v-model="filters.location"
          label="Location"
        ></v-text-field>
        <SortSelect
          v-model="sortOptions"
          :sortOptions="sortProperties"
        ></SortSelect>
      </template>
      <template #pagination>
        <v-pagination
          v-model="page"
          :length="count"
          :total-visible="$vuetify.display.smAndDown ? 3 : 5"
          class="mt-4"
          @next="getEvents"
          @prev="getEvents"
          @update:model-value="getEvents"
        >
        </v-pagination>
      </template>
    </CardTable>
  </v-container>
</template>
