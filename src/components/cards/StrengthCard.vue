<script setup>
import { ref } from "vue";

const isAdmin = ref(false);

const props = defineProps({
  strength: {
    type: Object,
    required: true,
  },
});


</script>

<template>
  <v-card color="backgroundDarken" class="cardContainer">
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
          <v-btn
            color="warning"
            class="mr-2 cardButton elevation-0"
            @click="editEvent"
          >
            <v-icon icon="mdi-pencil" color="text" size="x-large"></v-icon>
          </v-btn>
          <v-btn
            color="danger"
            class="cardButton elevation-0"
            @click="emit('delete', props.event.id)"
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
