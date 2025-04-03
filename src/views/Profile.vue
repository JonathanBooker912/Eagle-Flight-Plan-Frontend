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
import { useRouter } from "vue-router";

const store = userStore();
const route = useRoute();
const router = useRouter();
const user = store.user;

const noBadges = ref(false);
const noStrengths = ref(false);

const links = ref([]);
const strengths = ref([]);
const badges = ref([]);
const selectedUser = ref([]);
const isAdmin = ref(false);

// Add pagination refs
const currentPage = ref(1);
const pageSize = ref(6);
const totalPages = ref(1);

const getUser = async (id) => {
  try {
    const res = await userServices.getOneUser(id); // PASS IN THE ID
    selectedUser.value = res.data; // Update links
    console.log(selectedUser.value);
  } catch (err) {
    console.error("Error fetching user:", err); // Error handling
  }
};

const getLinks = async (id) => {
  try {
    const res = await linkServices.getAllLinksForUser(id); // API call
    links.value = res.data; // Update links
  } catch (err) {
    console.error("Error fetching links:", err); // Error handling
  }
};

const getStrengths = async (id) => {
  try {
    const res = await strengthServices.getStrengthsForStudent(id); // API call
    strengths.value = res.data; // Update strengths
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
    badges.value = res.data.badges; // Update badges
    if (badges.value == null) {
      noBadges.value = true;
    }
    // Calculate total pages
    totalPages.value = Math.ceil(badges.value.length / pageSize.value);
  } catch (err) {
    console.error("Error fetching badges:", err); // Error handling
  }
};

const toFlightPlan = () => {
  router.push({ name: "student-flightPlan" });
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
          <h3 class="text-h6 text-left">About Me:</h3>
          <p class="text-body-1 text-left">
            {{ selectedUser.profileDescription }}
          </p>
        </v-col>
        <v-col class="v-col-2 d-flex flex-column justify-center text-right">
          <p class="text-body-2 text-right">Email</p>
          <p
            v-for="(link, index) in links.slice(0, 3)"
            :key="index"
            class="text-body-2 text-right"
          >
            {{ link.websiteName }}
          </p>
        </v-col>
        <v-col cols="3" class="d-flex flex-column justify-center text-left">
          <a class="text-body-2 text-left">
            {{ selectedUser.email }}
          </a>
          <a
            v-for="(link, index) in links.slice(0, 3)"
            :key="index"
            class="text-body-2 text-left"
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
            @click="toFlightPlan"
            :size="32"
            class="d-flex align-right ml-auto mt-1"
            :color="text"
            >mdi-airplane</v-icon
          >
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <div class="adminItem">
          <v-card color="backgroundDarken" class="mb-6">
            <h2 class="text-h5 ma-2">Awards</h2>
          </v-card>
          <v-row v-if="!noBadges">
            <v-col
              v-for="(item, index) in badges.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize,
              )"
              :key="index"
              cols="12"
              md="4"
            >
              <BadgeCard :badge="item" :isProfilePage="true" />
            </v-col>
          </v-row>
          <v-row justify="center" align="center" class="mt-4">
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
            ></v-pagination>
          </v-row>
          <v-col v-if="noBadges">
            <div class="adminItem text-center">
              <p class="text-body-1">No badges!</p>
              <p class="text-body-1">
                Complete some flight plan items to be rewarded!
              </p>
              <p class="text-body-1 mt-2">
                <b
                  >"The LORD repay you for what you have done, and a full reward
                  be given you by the LORD, the God of Israel, under whose wings
                  you have come to take refuge!" <br />
                  - Ruth 2:12</b
                >
              </p>
            </div>
          </v-col>
        </div>
      </v-col>

      <!-- Strengths Section (Stacked Vertically, Stretching Full Width) -->
      <v-col cols="12" md="6">
        <div class="adminItem" style="margin-right: 2vw">
          <v-card color="backgroundDarken" style="margin-bottom: 25px">
            <h2 class="text-h5 ma-2">Clifton Strengths</h2>
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
              <div class="adminItem text-center">
                <p class="text-body-1">No Clifton Strengths listed</p>
                <p class="text-body-1">
                  Contact Charlotte Hamil to change this!
                </p>
                <p class="text-body-1 mt-2">
                  "Before I formed you in the womb I knew you, and before you
                  were born I consecrated you; I appointed you a prophet to the
                  nations.` <br />
                  - Jeremiah 1:5"
                </p>
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
}

.strengths-list {
  display: flex;
  flex-direction: column;
}
</style>
