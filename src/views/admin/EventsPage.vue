<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import EventServices from "../../services/eventServices.js";
import EventCard from "../../components/cards/EventCard.vue";
import CardTable from "../../components/CardTable.vue";
import CardHeader from "../../components/CardHeader.vue";
import DatePickerField from "../../components/DatePickerField.vue";

// Constants
const PAGE_SIZE = 8;
const label = "Events";

// Reactive states
const router = useRouter();
const events = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);

const showFilters = ref(false);
const filters = ref({
  startDate: null,
  endDate: null,
});

// Fetch events
const getEvents = async (pageNumber = page.value) => {
  try {
    const result = await EventServices.getAllEvents(
      pageNumber,
      PAGE_SIZE,
      searchQuery.value
    );
    events.value = result.data.events;
    count.value = result.data.count;
  } catch (error) {
    console.error("Error fetching events:", error);
  }
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

// Initial fetch
onMounted(() => getEvents());
</script>
<template>
  <v-container fluid>
    <CardHeader
      :label="label"
      @changed="handleSearchChange"
      @add="handleAdd"
      @toggle-filters="showFilters = !showFilters"
    ></CardHeader>
    <v-row v-if="events.length === 0" class="justify-center">
      <v-col>
        <v-alert color="danger" class="text-center"> No results found </v-alert>
      </v-col>
    </v-row>
    <CardTable
      v-else
      :items="events"
      :per-row-lg="4"
      :per-row-md="3"
      :per-row-sm="2"
      :show-filters="showFilters"
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
        <v-combobox label="Strengths"></v-combobox>
        <v-text-field label="Location"></v-text-field>
        <v-select label="Sort By"></v-select>
      </template>
    </CardTable>
    <v-pagination
      v-model="page"
      :length="count"
      :total-visible="$vuetify.display.smAndDown ? 3 : 5"
      class="m-2"
      @next="getEvents"
      @prev="getEvents"
      @update:model-value="getEvents"
    >
    </v-pagination>
  </v-container>
</template>
