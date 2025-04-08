<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import dayjs from "dayjs";
import EventServices from "../../services/eventServices.js";
import StrengthServices from "../../services/strengthServices.js";
import EventCard from "../../components/cards/EventCard.vue";
import CardTable from "../../components/CardTable.vue";
import CardHeader from "../../components/CardHeader.vue";
import DatePickerField from "../../components/DatePickerField.vue";
import SortSelect from "../../components/SortSelect.vue";
import { generateEventQRCodePDF } from "../../utils/pdfGenerator.js";
import QRCodeGenerationModal from "../../components/modals/QRCodeGenerationModal.vue";

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

const showInfo = ref(false);
const eventToShow = ref({});

// Token generation states
const generatingToken = ref(false);
const generatingPDF = ref(false);
const generatedToken = ref(null);
const showQRCodeModal = ref(false);
const checkingToken = ref(false);

const sortOptions = ref({
  sortAttribute: sortProperties[0].value,
  sortDirection: "asc",
});

const display = useDisplay();

const numCardColumns = computed(() => {
  if (display.xxl.value) return 4;
  if (display.xl.value) return showInfo.value ? 3 : 4;
  if (display.lg.value) return showFilters.value || showInfo.value ? 3 : 4;
  if (display.md.value) return showFilters.value || showInfo.value ? 2 : 3;
  if (display.sm.value) return showFilters.value || showInfo.value ? 1 : 2;
  return 1; // Default for xs
});
const pageSize = computed(() => numCardColumns.value * 2);

watch(showFilters, () => getEvents());
watch(showInfo, () => getEvents());

// Add this computed property after the other computed properties
const isEventInFuture = computed(() => {
  if (!eventToShow.value?.date) return false;
  return dayjs(eventToShow.value.date).isAfter(dayjs());
});

// Fetch events
const getEvents = async (pageNumber = page.value) => {
  try {
    const result = await EventServices.getAllEvents(
      pageNumber,
      pageSize.value,
      searchQuery.value,
      { ...filters.value, ...sortOptions.value },
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
    await EventServices.deleteEvent(eventId);
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
      (strength) => strength.id,
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

const getCurrentToken = async () => {
  if (!eventToShow.value?.id) return;

  checkingToken.value = true;
  try {
    const response = await EventServices.getCheckInToken(eventToShow.value.id);
    generatedToken.value = response.data;
  } catch (error) {
    console.error("Error getting check-in token:", error);
    generatedToken.value = null;
  } finally {
    checkingToken.value = false;
  }
};

const handleShowInfo = async (eventId) => {
  eventToShow.value = events.value.find((event) => event.id == eventId);
  showInfo.value = true;
  await getCurrentToken();
};

const handleGenerateQRCode = async (expirationTimestamp) => {
  generatingToken.value = true;
  try {
    const response = await EventServices.generateCheckInToken(
      eventToShow.value.id,
      expirationTimestamp,
    );
    generatedToken.value = response.data;
  } catch (error) {
    console.error("Error generating check-in token:", error);
  } finally {
    generatingToken.value = false;
  }
};

const downloadQRCode = async () => {
  if (!generatedToken.value) return;

  generatingPDF.value = true;
  try {
    await generateEventQRCodePDF(eventToShow.value, generatedToken.value);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    generatingPDF.value = false;
  }
};

const handleAttendance = (eventId, eventName) => {
  console.log(eventName);
  router.push({
    name: "attendanceEvent",
    params: { id: eventId, eventName: eventName },
  });
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
      :per-row-lg="showFilters || showInfo ? 3 : 4"
      :per-row-md="showFilters || showInfo ? 2 : 3"
      :per-row-sm="showFilters || showInfo ? 1 : 2"
      :show-filters="showFilters"
      :show-info="showInfo"
      :info-label="eventToShow.name"
      @update-filters="handleChangeFilters"
      @close-filter-menu="showFilters = false"
      @close-info="showInfo = false"
      @clear-filters="handleClearFilters"
    >
      <template #item="{ item }">
        <EventCard
          :event="item"
          @edit="handleEdit"
          @delete="handleDelete"
          @show-info="handleShowInfo"
        ></EventCard>
      </template>
      <template #filters>
        <DatePickerField v-model="filters.startDate" label="Start Date" />
        <DatePickerField v-model="filters.endDate" label="End Date" />
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
          :sort-options="sortProperties"
        ></SortSelect>
      </template>
      <template #info>
        <br />
        <h3>{{ eventToShow.description }}</h3>
        <br />
        <h4>Attendance: {{ eventToShow.attendanceType }}</h4>
        <h4>Registration Type: {{ eventToShow.registration }}</h4>
        <v-btn
          class="mt-5 mb-0 full-width"
          rounded="xl"
          color="primary"
          block
          @click="handleAttendance(eventToShow.id, eventToShow.name)"
        >
          Record Attendance
        </v-btn>
        <br />

        <v-btn
          v-if="generatedToken?.token"
          color="primary"
          class="full-width"
          rounded="xl"
          block
          :loading="generatingPDF"
          @click="downloadQRCode"
        >
          Download QR Code PDF
        </v-btn>
        <v-btn
          v-else-if="isEventInFuture"
          color="primary"
          rounded="xl"
          class="full-width"
          :loading="generatingToken"
          :disabled="checkingToken"
          block
          @click="showQRCodeModal = true"
        >
          Generate Check-In Code
        </v-btn>

        <QRCodeGenerationModal
          v-model:show="showQRCodeModal"
          :event="eventToShow"
          @generate="handleGenerateQRCode"
        />
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
