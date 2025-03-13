<script setup>
import { onMounted, ref } from "vue";
import linkServices from "../services/linkServices";
import strengthServices from "../services/strengthServices";
import StrengthCard from "../components/cards/StrengthCard.vue";
import { userStore } from "../stores/userStore";

const store = userStore();
const user = store.user;

const links = ref([]);
const strengths = ref([]);

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
    const res = await strengthServices.getStrengthsForStudent(
      store.user.userId,
    ); // API call
    console.log(res);
    strengths.value = res.data; // Update links
    console.log(strengths.value); // Check if links are returned
  } catch (err) {
    console.error("Error fetching strengths:", err); // Error handling
  }
};

onMounted(() => {
  getLinks(); // Fetch links on component mount
  getStrengths();
});
</script>

<template>
  <v-row justify="center" class="thing">
    <v-card color="backgroundDarken" class="topBar">
      <v-container>
        <v-row no-gutters justify="space-evenly">
          <v-col class="text-center" style="position: relative">
            <v-img
              src="../../public/Birb.png"
              height="150"
              width="150"
              class="profile-pic"
              style="
                position: absolute;
                top: -50px;
                z-index: 10000;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 50%;
              "
            />
            <div style="margin-top: 80px; padding-bottom: 20px">
              <p class="text-h5 font-weight-bold">{{ user.fullName }}</p>
              <p class="text-subtitle-1">{{ user.major }}</p>
            </div>
          </v-col>
          <v-col class="text-center">
            <p style="text-align: left">
              I am currently a Software Development Engineer In Test (SDET)
              Intern for Paycom during the Fall 2024 semester working part-time.
            </p>
          </v-col>
          <v-col class="text-center">
            <p>{ MAJOR }</p>
            <p>{{ user.email }}</p>
            <p>{ PO BOX }</p>
          </v-col>
          <v-col class="text-center">
            <p v-for="(link, index) in links.slice(0, 3)" :key="index">
              {{ link.websiteName }} -
              <a :href="link.link" target="_blank">{{ link.link }}</a>
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <p>Awards</p>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemBig">
      <h2>Clifton Strengths</h2>
      <p v-for="(strength, index) in strengths.slice(0, 5)" :key="index">
        {{ strength.domain }} - {{ strength.name }} - {{ strength.number }}
      </p>
    </v-card>
  </v-row>
</template>

<style>
.thing {
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
  text-align: left;
  margin: 1%;
  height: 45vh;
  padding: 15px 0px 5px 0px;

  border-radius: 25px;
}

.adminItemSmall {
  width: 35vw;
}

.adminItemBig {
  width: 45vw;
}

.notification {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}
</style>
