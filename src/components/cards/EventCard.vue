<script setup>
import { ref, computed, onMounted } from "vue";
import { userStore } from "../../stores/userStore";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

const store = userStore();
const isAdmin = ref(false);

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
});

const eventDate = computed(() => {
  const dateString = dayjs(props.event.date).format("dddd, MMMM Do");
  return dateString;
});

const eventTime = computed(() => {
  const startTime = dayjs(props.event.startTime).format("h:mma");
  const endTime = dayjs(props.event.endTime).format("h:mma");

  return `${startTime} - ${endTime}`;
});

const viewCard = () => {};

onMounted(async () => {
  isAdmin.value = await store.isAdmin();
});
</script>
<template>
  <v-card v-if="isAdmin" color="backgroundDarken" class="cardContainer">
    <v-row no-gutters>
      <v-col>
        <v-card-text>
          <p class="text-h5 text-no-wrap text-truncate">
            {{ props.event.name }}
          </p>
          <p
            class="text-subtitle-1 font-weight-regular text-no-wrap text-truncate"
          >
            {{ props.event.location || "No Location" }}
          </p>
          <p class="text-subtitle-1 font-weight-regular">
            {{ eventDate }}
          </p>
          <p class="text-subtitle-1 font-weight-regular">
            {{ eventTime }}
          </p>
        </v-card-text>
        <v-row class="ma-2 float-right">
          <v-btn color="warning" class="mr-2 cardButton elevation-0">
            <v-icon icon="mdi-pencil" color="text" size="x-large"></v-icon>
          </v-btn>
          <v-btn color="danger" class="cardButton elevation-0"
            ><v-icon icon="mdi-delete" color="text" size="x-large"></v-icon
          ></v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
  <v-card
    v-else
    color="backgroundDarken"
    class="cardContainer"
    @click="viewCard"
  >
    <v-row no-gutters>
      <div class="h-fill left-accent my-2 ml-2 bg-primary"></div>
      <v-col>
        <v-card-text>
          <p class="text-h5 text-truncate w-100">
            {{ props.event.name }}
          </p>
          <p class="text-subtitle-1 font-weight-regular">
            {{ props.event.location }}
          </p>
          <p class="text-subtitle-1 font-weight-regular">
            {{ eventDate }}
          </p>
          <p class="text-subtitle-1 font-weight-regular">
            {{ eventTime }}
          </p>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<style scoped>
.left-accent {
  width: 20px;
  border-radius: 20px 0px 0px 20px;
}
.cardContainer {
  min-width: 250px;
  border-radius: 25px;
}
.cardButton {
  border-radius: 13px;
}
</style>
