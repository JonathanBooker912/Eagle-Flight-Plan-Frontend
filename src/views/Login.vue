<script setup>
import { ref, onMounted, computed } from "vue";
import eagle from "/Birb.png";
import { useDisplay } from "vuetify";
import SocialLogin from "../components/SocialLogin.vue";

const eagleSrc = ref("");

onMounted(() => {
  eagleSrc.value = eagle;
});

// Get the display settings from Vuetify
const { smAndDown } = useDisplay();

// Computed property that returns true if the screen is mobile-sized
const isMobile = computed(() => smAndDown.value);
</script>

<template>
  <v-container fluid class="fill-height mx-auto">
    <v-row class="fill-height justify-center">
      <!-- First Column -->
      <v-col v-if="!isMobile" class="d-flex flex-column" cols="5">
        <v-card
          class="elevation-0 flex-grow-1 rounded-xl"
          color="backgroundDarken"
        >
          <v-col class="fill-height d-flex flex-column">
            <v-spacer></v-spacer>
            <v-img class="mb-n16 ml-n16" :src="eagleSrc" />
          </v-col>
        </v-card>
      </v-col>

      <!-- Second Column -->
      <v-col class="d-flex flex-column" cols="12" md="4">
        <v-card
          class="elevation-0 flex-grow-1 rounded-xl h-25 pa-3"
          color="backgroundDarken"
        >
          <v-col class="fill-height d-flex flex-column">
            <p class="text-h6">Career Services:</p>
            <p class="text-h2 font-weight-bold">
              Eagle <br />
              Flight Plan
            </p>
            <br />
            <v-spacer></v-spacer>
            <p class="text-h5">The World Awaits Your Story</p>
          </v-col>
        </v-card>
        <v-card
          class="elevation-0 flex-grow-1 mt-5 rounded-xl"
          color="backgroundDarken"
        >
          <v-col
            class="h-75 mt-6 d-flex flex-column align-center justify-center"
          >
            <v-spacer />
            <p class="text-center">Log in with Google to get started</p>
            <v-spacer />
            <v-card
              class="elevation-0 h-auto py-7 px-6 rounded-lg"
              color="#ffffff"
            >
              <SocialLogin />
            </v-card>
            <v-spacer />
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
