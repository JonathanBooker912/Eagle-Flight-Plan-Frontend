<script setup>
import { onMounted, ref } from "vue";
import linkServices from "../services/linkServices";
import strengthServices from "../services/strengthServices";
import badgeServices from "../services/badgeServices";
import StrengthCard from "../components/cards/StrengthCard.vue";
import BadgeCard from "../components/cards/BadgeCard.vue";
import { userStore } from "../stores/userStore";

const store = userStore();
const user = store.user;

const links = ref([]);
const strengths = ref([]);
const badges = ref([]);

const getLinks = async () => {
  console.log(store.user.userId); // Check if userId is correctly populated
  try {
    const res = await linkServices.getAllLinksForUser(store.user.userId); // API call
    links.value = res.data; // Update links
    console.log(links.value); // Check if links are returned
  } catch (err) {
    console.error("Error fetching links:", err); // Error handling
  }
};

const getStrengths = async () => {
  try {
    const res = await strengthServices.getStrengthsForStudent(store.user.userId); // API call
    console.log(res);
    strengths.value = res.data; // Update strengths
    console.log(strengths.value); // Check if strengths are returned
  } catch (err) {
    console.error("Error fetching strengths:", err); // Error handling
  }
};

const getBadges = async () => {
  try {
    const res = await badgeServices.getBadgesForStudent(store.user.userId); // API call
    console.log(res);
    badges.value = res.data.badges; // Update badges
    console.log(badges.value); // Check if badges are returned
  } catch (err) {
    console.error("Error fetching badges:", err); // Error handling
  }
};

onMounted(() => {
  getLinks(); // Fetch links on component mount
  getStrengths();
  getBadges();
});
</script>

<template>
  <v-row justify="center" class="background">
    <!-- Profile Section -->
    <v-card color="backgroundDarken" class="topBar">
      <v-container>
        <v-row no-gutters justify="space-evenly">
          <v-col class="text-center" style="position: relative">
            <v-img
              src="../../public/Birb.png"
              height="150"
              width="150"
              class="profile-pic"
              style="position: absolute; top: -20px; z-index: 10000; left: 50%; transform: translateX(-50%); border-radius: 50%;"
            />
            <div style="margin-top: 90px">
              <p class="text-h5 font-weight-bold">{{ user.fullName }}</p>
              <p class="text-subtitle-1">{{ user.major }}</p>
            </div>
          </v-col>
          <v-col class="text-center">
            <p style="text-align: left">
             {{ user.profileDescription }}
            </p>
          </v-col>
          <v-col class="text-center">
            <p>{{ user.email }}</p>
            <p>{{ user.address }}</p>
          </v-col>
          <v-col class="text-center">
            <p v-for="(link, index) in links.slice(0, 3)" :key="index">
              {{ link.websiteName }} - <a :href="link.link" target="_blank">{{ link.link }}</a>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>

    <!-- Strengths and Badges Section (Both in a Row) -->
    <v-row>
      <!-- Badges Section -->
      <v-col cols="12" md="6">
        <div class="adminItem">
          <v-card color="backgroundDarken">
            <h2>Awards</h2>
          </v-card>
          <v-row>
            <v-col v-for="(item, index) in badges.slice(0, 6)" :key="index" cols="12" md="4">
              <BadgeCard :badge="item" :isProfilePage="true" />
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- Strengths Section (Stacked Vertically, Stretching Full Width) -->
      <v-col cols="12" md="6">
        <div class="adminItem">
          <v-card color="backgroundDarken" style="margin-bottom: 5px">
            <h2>Clifton Strengths</h2>
          </v-card>
          <!-- Stacked Strengths (Stretching Full Width) -->
          <v-row class="strengths-list">
            <v-col v-for="(item, index) in strengths.slice(0, 5)" :key="index" cols="12" style="padding: 0px 10px;">
              <StrengthCard :strength="item" />
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-row>
</template>

<style scoped>
.background {
  margin: 5vh 2vw 5vh 2vw;
  width: 85vw;
}

.topBar {
  display: flex;
  flex-direction: column;
  width: 90vw;
  height: 20vh;
}

.adminItem {
  display: flex;
  flex-direction: column;
  margin: 1%;
  padding: 15px 0px 5px 0px;
  border-radius: 25px;
}

</style>
