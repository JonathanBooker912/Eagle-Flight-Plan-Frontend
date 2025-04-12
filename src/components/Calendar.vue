<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from "vue";
import EventCard from "./cards/EventCard.vue";
import EventDialog from "./dialogs/EventDialog.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const dialogVisible = ref(false);
const selectedEvent = ref(null);

const openDialog = (event) => {
  selectedEvent.value = event;
  dialogVisible.value = true;
};

const handleRecordAttendance = (event) => {
  router.push({
    name: "attendanceEvent",
    params: { id: event.id, eventName: event.name },
  });
};

const handleGenerateQRCode = (event) => {
  console.log("Generating QR for:", event.name);
};

const handleRegister = (event) => {
  console.log("Registering for event:", event.id);
};

const today = new Date();
const selectedDates = ref([today]);
const lastSelectedDate = ref(null);

const interactiveAttribute = ref({
  highlight: "primary",
  dates: selectedDates.value,
});

const eventDots = ref([]);
const attributes = ref([]);

const eventsGroupedByDate = computed(() => {
  if (!props.events || selectedDates.value.length === 0) return {};

  const grouped = {};
  [...selectedDates.value]
    .sort((a, b) => a - b)
    .forEach((selectedDate) => {
      const dateStr = selectedDate.toDateString();
      grouped[dateStr] = props.events
        .filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === dateStr;
        })
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    });

  return grouped;
});

const filteredEventsGroupedByDate = computed(() => {
  if (selectedDates.value.length === 1) return eventsGroupedByDate.value;

  const filtered = {};
  for (const [date, events] of Object.entries(eventsGroupedByDate.value)) {
    if (events.length > 0) {
      filtered[date] = events;
    }
  }
  return filtered;
});

function groupByStartTime(events) {
  const map = {};
  events.forEach((event) => {
    const label = new Date(event.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (!map[label]) map[label] = [];
    map[label].push(event);
  });
  return map;
}

const updateAttributes = () => {
  interactiveAttribute.value.dates = [...selectedDates.value];
  attributes.value = [];

  if (interactiveAttribute.value.dates.length > 0) {
    attributes.value.push({ ...interactiveAttribute.value });
  }

  if (eventDots.value.length > 0) {
    attributes.value.push(...eventDots.value);
  }
};

const generateEventDots = (eventList) => {
  if (!Array.isArray(eventList) || eventList.length === 0) {
    eventDots.value = [];
    updateAttributes();
    return;
  }

  eventDots.value = eventList.map((event, index) => ({
    key: `event-${index}`,
    dot: { color: "orange" },
    dates: new Date(event.date),
    popover: { label: event.name },
  }));

  updateAttributes();
};

watch(selectedDates, updateAttributes, { deep: true });

watch(
  () => JSON.stringify(props.events),
  (json) => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed) && parsed.length > 0) {
        generateEventDots(parsed);
      }
    } catch (e) {
      console.error("Failed to parse event JSON:", e);
    }
  },
  { immediate: true }
);

function handleDayClick(day, event) {
  const isCtrl = event.ctrlKey || event.metaKey;
  const isShift = event.shiftKey;
  onDayClick(day, isCtrl, isShift);
}

function onDayClick(day, isCtrlPressed = false, isShiftPressed = false) {
  const clickedDate = new Date(day.date);
  let newDates = [];

  if (isShiftPressed && lastSelectedDate.value) {
    const start = new Date(Math.min(lastSelectedDate.value, clickedDate));
    const end = new Date(Math.max(lastSelectedDate.value, clickedDate));
    const tempDate = new Date(start);

    while (tempDate <= end) {
      newDates.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }
    selectedDates.value = newDates;
  } else if (isCtrlPressed) {
    const exists = selectedDates.value.find(
      (d) => d.toDateString() === clickedDate.toDateString()
    );

    if (exists) {
      selectedDates.value = selectedDates.value.filter(
        (d) => d.toDateString() !== clickedDate.toDateString()
      );
    } else {
      selectedDates.value.push(clickedDate);
    }
  } else {
    selectedDates.value = [clickedDate];
  }

  lastSelectedDate.value = clickedDate;
  updateAttributes();
}

const selectedDateRangeLabel = computed(() => {
  if (selectedDates.value.length === 0) return "";

  const sorted = [...selectedDates.value].sort((a, b) => a - b);
  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  const options = { month: "short", day: "numeric", year: "numeric" };
  const startLabel = start.toLocaleDateString(undefined, options);
  const endLabel = end.toLocaleDateString(undefined, options);

  return startLabel === endLabel
    ? `(${startLabel})`
    : `(${startLabel} – ${endLabel})`;
});

// Responsive calendar row setting based on screen height
const calendarRows = ref(window.innerHeight < 700 ? 1 : 2);
const updateRows = () => {
  calendarRows.value = window.innerHeight < 700 ? 1 : 2;
};

onMounted(() => {
  updateRows();
  window.addEventListener("resize", updateRows);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateRows);
});
</script>

<template>
  <div class="calendar-container mt-4 pa-6">
    <div class="calendar-row">
      <!-- Left card: Calendar -->
      <v-card class="calendar-card pa-4 bg-backgroundDarken" flat>
        <VCalendar
          :rows="calendarRows"
          :attributes="attributes"
          isDark="system"
          view="monthly"
          borderless
          title-position="left"
          expanded
          class="fill-height bg-backgroundDarken"
          @dayclick="handleDayClick"
        />
      </v-card>

      <!-- Right card: Multi-Date Timeline -->
      <v-card class="calendarDetails-card pa-4" color="backgroundDarken">
        <div class="timeline-header">
          <strong class="timeline-title">Event Timeline</strong>
          <span class="timeline-range">{{ selectedDateRangeLabel }}</span>
        </div>

        <div v-if="Object.keys(filteredEventsGroupedByDate).length > 0">
          <div
            v-for="(events, dateLabel) in filteredEventsGroupedByDate"
            :key="dateLabel"
            class="timeline-day"
          >
            <h3 class="timeline-day-label">{{ dateLabel }}</h3>

            <div v-if="events.length > 0" class="timeline">
              <div
                v-for="(group, time) in groupByStartTime(events)"
                :key="time"
                class="timeline-item"
              >
                <div class="timeline-time">{{ time }}</div>
                <div class="timeline-group">
                  <EventCard
                    v-for="(event, idx) in group"
                    :key="idx"
                    :event="event"
                    :view-only="true"
                    color="background"
                    :isEventViewing="false"
                    @click="openDialog(event)"
                  />
                </div>
              </div>
            </div>

            <div v-else>
              <p class="no-events-text">No events for this date.</p>
            </div>
          </div>

          <!-- Event Dialog -->
          <EventDialog
            v-model="dialogVisible"
            :event="selectedEvent"
            :is-admin="props.isAdmin"
            @record-attendance="handleRecordAttendance"
            @generate-qr="handleGenerateQRCode"
            @register="handleRegister"
          />
        </div>

        <div v-else>
          <p>Click a date to view or manage events here.</p>
        </div>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.timeline-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 20px;
}

.timeline-range {
  font-size: 16px;
  color: rgb(var(--v-theme-secondary));
}

.calendar-container {
  width: 100%;
  max-width: 150vw;
  overflow: hidden;
}

.calendar-row {
  display: flex;
  justify-content: stretch;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

.calendar-card {
  flex-shrink: 0;
  width: 500px;
  border-radius: 25px;
}

.calendarDetails-card {
  flex-grow: 1;
  max-height: 610px;
  overflow-y: auto;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  scrollbar-width: thin;
}

.calendarDetails-card::-webkit-scrollbar {
  width: 8px;
}
.calendarDetails-card::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 4px;
}

.fill-height {
  height: 100%;
  flex: 1;
}

.timeline-day {
  margin-bottom: 30px;
}

.timeline-day-label {
  font-size: 15px;
  font-weight: bold;
  color: rgb(var(--v-theme-text));
  margin-bottom: 10px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding-left: 10px;
  border-left: 3px solid rgb(var(--v-theme-text));
}

.timeline-time {
  min-width: 65px;
  color: rgb(var(--v-theme-text));
}

.timeline-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.no-events-text {
  font-style: italic;
  color: rgb(var(--v-theme-secondary));
}
</style>
