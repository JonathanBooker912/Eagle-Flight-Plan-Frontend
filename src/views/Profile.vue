<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import linkServices from "../services/linkServices";
import strengthServices from "../services/strengthServices";
import badgeServices from "../services/badgeServices";
import userServices from "../services/userServices";
import StrengthCard from "../components/cards/StrengthCard.vue";
import BadgeCard from "../components/cards/BadgeCard.vue";
import { userStore } from "../stores/userStore";

const store = userStore();
const route = useRoute();
const user = store.user;

const noBadges = ref(false);
const noStrengths = ref(false);

const links = ref([]);
const strengths = ref([]);
const badges = ref([]);
const selectedUser = ref([]);
const isAdmin = ref(false);

const getUser = async (id) => {
  try {
    const res = await userServices.getOneUser(id); // PASS IN THE ID
    selectedUser.value = res.data; // Update links
    console.log("HEre");
    console.log(selectedUser.value);
  } catch (err) {
    console.error("Error fetching user:", err); // Error handling
  }
};

const getLinks = async (id) => {
  console.log(store.user.userId); // Check if userId is correctly populated
  try {
    const res = await linkServices.getAllLinksForUser(id); // API call
    links.value = res.data; // Update links
    console.log(links.value); // Check if links are returned
  } catch (err) {
    console.error("Error fetching links:", err); // Error handling
  }
};

const getStrengths = async (id) => {
  try {
    const res = await strengthServices.getStrengthsForStudent(id); // API call
    console.log(res);
    strengths.value = res.data; // Update strengths
    console.log(strengths.value); // Check if strengths are returned
    if (strengths.value == null) {
      noStrengths.value = true;
    }
  } catch (err) {
    console.error("Error fetching strengths:", err); // Error handling
  }
};

const getBadges = async (id) => {
  try {
    const res = await badgeServices.getBadgesForStudent(id); // API call
    console.log(res);
    badges.value = res.data.badges; // Update badges
    console.log(badges.value); // Check if badges are returned
    if (badges.value == null) {
      noBadges.value = true;
    }
  } catch (err) {
    console.error("Error fetching badges:", err); // Error handling
  }
};

onMounted(async () => {
  const passedId = route.params.userId;
  isAdmin.value = await store.isAdmin();

  getLinks(passedId); // Fetch links on component mount
  getStrengths(passedId);
  getBadges(passedId);
  getUser(passedId);
});
</script>

<template>
  <v-row class="background">
    <!-- Profile Section -->
    <v-card color="backgroundDarken" class="topBar">
      <v-row class="w-100">
        <v-col cols="2" class="d-flex flex-column align-center justify-center">
          <v-img
            src="../../public/Birb.png"
            height="200"
            width="200"
            class="profile-pic"
            style="
              position: absolute;
              top: -20px;
              z-index: 10000;
              border-radius: 50%;
            "
          />
          <div style="margin-top: 160px">
            <p class="text-h6 font-weight-bold">
              {{ selectedUser.fullName }}
            </p>
            <p class="text-subtitle-1">{{ user.major }}</p>
          </div>
        </v-col>

        <v-col cols="4" class="d-flex flex-column justify-center">
          <h3 style="text-align: left">About Me:</h3>
          <p style="text-align: left; display: flex; font-size: 18px">
            {{ selectedUser.profileDescription }}
          </p>
        </v-col>
        <v-col class="v-col-2 d-flex flex-column justify-center text-right">
          <p style="font-size: 16px; text-align: right !important">Email</p>
          <p
            v-for="(link, index) in links.slice(0, 3)"
            :key="index"
            style="text-align: right !important; font-size: 16px"
          >
            {{ link.websiteName }}
          </p>
        </v-col>
        <v-col cols="3" class="d-flex flex-column justify-center text-left">
          <a style="text-align: left !important">
            {{ selectedUser.email }}
          </a>
          <a
            v-for="(link, index) in links.slice(0, 3)"
            :key="index"
            style="text-align: left !important; font-size: 16px"
            :href="link.link"
            target="_blank"
          >
            {{ link.link }}
            <br />
          </a>
        </v-col>
        <v-col cols="1" class="d-flex align-right">
          <v-icon
            v-if="isAdmin"
            :size="32"
            style="margin-left: 85%; margin-top: 5%"
            :color="text"
            class="d-flex align-right"
            >mdi-airplane</v-icon
          >
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <div class="adminItem">
          <v-card color="backgroundDarken" style="margin-bottom: 25px">
            <h2 style="margin: 10px 0px 5px 15px">Awards</h2>
          </v-card>
          <v-row v-if="!noBadges">
            <v-col
              v-for="(item, index) in badges.slice(0, 6)"
              :key="index"
              cols="12"
              md="4"
            >
              <BadgeCard :badge="item" :isProfilePage="true" />
            </v-col>
            <v-col v-if="noBadges">
              <div class="adminItem" style="text-align: center">
                No badges! <br />
                Complete some flight plan items to be rewarded! <br />
                <br />
                <b
                  >The LORD repay you for what you have done, and a full reward
                  be given you by the LORD, the God of Israel, under whose wings
                  you have come to take refuge!” <br />
                  - Ruth 2:12</b
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>

      <!-- Strengths Section (Stacked Vertically, Stretching Full Width) -->
      <v-col cols="12" md="6">
        <div class="adminItem" style="margin-right: 2vw">
          <v-card color="backgroundDarken" style="margin-bottom: 25px">
            <h2 style="margin: 10px 0px 5px 15px">Clifton Strengths</h2>
          </v-card>
          <!-- Stacked Strengths (Stretching Full Width) -->
          <v-row v-if="!noStrengths" class="strengths-list">
            <v-col
              v-for="(item, index) in strengths.slice(0, 5)"
              :key="index"
              cols="12"
              style="padding: 0px 10px"
            >
              <StrengthCard :strength="item" />
            </v-col>
            <v-col v-if="noStrengths">
              <div class="adminItem" style="text-align: center">
                No Clifton Strengths listed<br />
                Contact Charlotte Hamil to change this! <br /><br />
                <b
                  >“Before I formed you in the womb I knew you, and before you
                  were born I consecrated you; I appointed you a prophet to the
                  nations.” <br />
                  - Jeremiah 1:5</b
                >
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-row>
</template>

<style scoped>
.background {
  margin: 2vh 2vw 5vh 1vw;
  width: 100%;
  display: flex;
}

.topBar {
  width: 100%;
  margin-right: 2vw;
  min-height: 25vh; /* Allows it to grow dynamically */
  max-width: 100%;
}

.adminItem {
  display: flex;
  flex-direction: column;
  padding: 15px 0px 5px 0px;
  border-radius: 25px;
}
</style>
