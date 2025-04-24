<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import linkServices from "../services/linkServices";
import strengthServices from "../services/strengthServices";
import badgeServices from "../services/badgeServices";
import userServices from "../services/userServices";
import StrengthCard from "../components/cards/StrengthCard.vue";
import BadgeCard from "../components/cards/BadgeCard.vue";
import { userStore } from "../stores/userStore";
import { useRouter } from "vue-router";
import { viewBadgeAwardsStore } from "../stores/viewBadgeAwardsStore";
import ViewBadgeAwards from "../components/dialogs/ViewBadgeAwards.vue";

const store = userStore();
const route = useRoute();
const router = useRouter();

const user = store.user;
const badgeAwardsStore = viewBadgeAwardsStore();
const noBadges = ref(false);
const noStrengths = ref(false);

const links = ref([]);
const strengths = ref([]);
const badges = ref([]);
const unviewedBadges = ref([]);
const selectedUser = ref([]);
const isAdmin = ref(false);
const isOwnProfile = ref(false);
const editDialog = ref(false);
const editedDescription = ref("");
const editLinkDialog = ref(false);
const editedLink = ref({ websiteName: "", link: "" });
const editingLinkIndex = ref(-1);

// Add pagination variables
const currentPage = ref(1);
const pageSize = ref(6);
const totalPages = ref(1);

const getUser = async (id) => {
  try {
    const res = await userServices.getOneUser(id); // PASS IN THE ID
    selectedUser.value = res.data; // Update links
    editedDescription.value = res.data.profileDescription || "";
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

    if (!res.data || res.data.length === 0) {
      console.error("Invalid response structure:", res);
      noStrengths.value = true;
      return;
    }

    if (!strengths.value || strengths.value.length === 0) {
      noStrengths.value = true;
    }
  } catch (err) {
    console.error("Error fetching strengths:", err); // Error handling
  }
};

const getBadges = async (id, page = 1) => {
  try {
    const res = await badgeServices.getBadgesForStudent(
      id,
      page,
      pageSize.value,
    ); // API call
    badges.value = res.data.badges; // Update badges

    totalPages.value = Math.ceil(res.data.total / pageSize.value);
    currentPage.value = page;

    if (!badges.value || badges.value.length === 0) {
      noBadges.value = true;
    } else {
      noBadges.value = false;
    }
  } catch (err) {
    console.error("Error fetching badges:", err); // Error handling
    noBadges.value = true;
  }
};

const fetchUnviewedBadges = async () => {
  const response = await badgeServices.getUnviewedBadges(route.params.userId);
  if (response.data.length > 0) {
    unviewedBadges.value = response.data;
    badgeAwardsStore.toggleVisibility();
  }
};

const toFlightPlan = () => {
  router.push({ name: "student-flightPlan" });
};

const saveDescription = async () => {
  try {
    const updatedUser = {
      ...selectedUser.value,
      profileDescription: editedDescription.value,
    };
    await userServices.updateUser(updatedUser);
    selectedUser.value = updatedUser;
    editDialog.value = false;
  } catch (err) {
    console.error("Error updating user description:", err);
  }
};

const saveLink = async () => {
  try {
    if (editingLinkIndex.value === -1) {
      // Check if we've reached the maximum number of links
      if (links.value.length >= 3) {
        console.error("Maximum number of links reached");
        editLinkDialog.value = false;
        return;
      }
      // Add new link
      const newLink = await linkServices.createLink({
        userId: route.params.userId,
        websiteName: editedLink.value.websiteName,
        link: editedLink.value.link
      });
      links.value.push(newLink.data);
    } else {
      // Update existing link
      const updatedLink = await linkServices.updateLink(links.value[editingLinkIndex.value].id, {
        websiteName: editedLink.value.websiteName,
        link: editedLink.value.link
      });
      links.value[editingLinkIndex.value] = updatedLink.data;
    }
    editLinkDialog.value = false;
  } catch (err) {
    console.error("Error saving link:", err);
  }
};

const deleteLink = async (index) => {
  try {
    await linkServices.deleteLink(links.value[index].id);
    links.value.splice(index, 1);
  } catch (err) {
    console.error("Error deleting link:", err);
  }
};

const openEditLinkDialog = (index = -1) => {
  editingLinkIndex.value = index;
  if (index === -1) {
    editedLink.value = { websiteName: "", link: "" };
  } else {
    editedLink.value = { ...links.value[index] };
  }
  editLinkDialog.value = true;
};

// Add watcher for pagination
watch(currentPage, (newPage) => {
  getBadges(route.params.userId, newPage);
});

onMounted(async () => {
  const passedId = route.params.userId;
  isAdmin.value = await store.isAdmin();

  if (!isAdmin.value) {
    await fetchUnviewedBadges();
  }

  await getLinks(passedId); // Fetch links on component mount
  await getStrengths(passedId);
  await getBadges(passedId);
  await getUser(passedId);

  isOwnProfile.value = passedId == store.user.userId;

  console.log(passedId);
  console.log(selectedUser.value);
  console.log(isOwnProfile.value);
});
</script>

<template>
  <v-row class="background">
    <!-- Profile Section -->
    <v-card color="backgroundDarken" class="topBar">
      <v-row class="w-100">
        <v-col cols="2" class="d-flex flex-column align-center justify-center">
          <v-img
            src="/Birb.png"
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
          <div class="d-flex align-center">
            <h3 style="text-align: left">About Me:</h3>
            <v-icon v-if="isOwnProfile" class="ml-2" @click="editDialog = true">mdi-pencil</v-icon>
          </div>
          <p style="text-align: left; display: flex; font-size: 18px">
            {{ selectedUser.profileDescription }}
          </p>
        </v-col>
        <v-col cols="4" class="d-flex flex-column justify-center">
          <div class="contact-info">
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2">mdi-email</v-icon>
              <a :href="'mailto:' + selectedUser.email" class="text-decoration-none">
                {{ selectedUser.email }}
              </a>
            </div>
            <div v-for="(link, index) in links.slice(0, 3)" :key="index" class="d-flex align-center mb-2">
              <v-icon class="mr-2">mdi-link</v-icon>
              <div class="d-flex align-center link-container">
                <a :href="link.link" target="_blank" class="text-decoration-none">
                  {{ link.websiteName }}
                </a>
                <div v-if="isOwnProfile" class="ml-2">
                  <v-icon size="small" @click="openEditLinkDialog(index)" class="mr-1">mdi-pencil</v-icon>
                  <v-icon size="small" @click="deleteLink(index)">mdi-delete</v-icon>
                </div>
              </div>
            </div>
            <v-btn 
              v-if="isOwnProfile && links.length < 3" 
              color="primary" 
              variant="text" 
              @click="openEditLinkDialog()" 
              class="mt-2"
              prepend-icon="mdi-plus"
            >
              Add Link
            </v-btn>
            <p v-else-if="isOwnProfile && links.length >= 3" class="text-caption mt-2">
              Maximum of 3 links reached
            </p>
          </div>
        </v-col>
        <v-col cols="1" class="d-flex align-right">
          <v-icon
            v-if="isAdmin"
            :size="32"
            style="margin-left: 85%; margin-top: 5%"
            color="primary"
            class="d-flex align-right"
            @click="toFlightPlan"
            >mdi-airplane</v-icon
          >
        </v-col>
      </v-row>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <div class="adminItem">
          <v-card color="backgroundDarken" style="margin-bottom: 25px">
            <h2 style="margin: 10px 0px 5px 15px">Badges</h2>
          </v-card>
          <v-row v-if="!noBadges">
            <v-col
              v-for="(item, index) in badges"
              :key="index"
              cols="12"
              md="4"
            >
              <BadgeCard :badge="item" :is-profile-page="true" />
            </v-col>
          </v-row>
          <v-row v-else>
            <div class="adminItem" style="text-align: center">
              No badges! <br />
              Complete some flight plan items to be rewarded!
              <br />
              <br />
              <b
                >The LORD repay you for what you have done, and a full reward be
                given you by the LORD, the God of Israel, under whose wings you
                have come to take refuge!" <br />
                - Ruth 2:12</b
              >
            </div>
          </v-row>
          <v-row
            v-if="!noBadges"
            justify="center"
            align="center"
            class="pagination"
          >
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
            ></v-pagination>
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
          <v-row
            v-if="strengths && strengths.length > 0"
            class="strengths-list"
          >
            <v-col
              v-for="(item, index) in strengths.slice(0, 5)"
              :key="index"
              cols="12"
              style="padding: 0px 10px"
            >
              <StrengthCard :strength="item" />
            </v-col>
          </v-row>
          <v-row v-else>
            <div class="adminItem" style="text-align: center">
              No Clifton Strengths listed<br />
              Contact Charlotte Hamil to change this! <br /><br />
              <b
                >"Before I formed you in the womb I knew you, and before you
                were born I consecrated you; I appointed you a prophet to the
                nations." <br />
                - Jeremiah 1:5</b
              >
            </div>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </v-row>

  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title>Edit Profile Description</v-card-title>
      <v-card-text>
        <v-textarea
          v-model="editedDescription"
          label="About Me"
          rows="4"
          variant="outlined"
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="editDialog = false">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="text" @click="saveDescription">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editLinkDialog" max-width="500px">
    <v-card>
      <v-card-title>{{ editingLinkIndex === -1 ? 'Add Link' : 'Edit Link' }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="editedLink.websiteName"
          label="Website Name"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="editedLink.link"
          label="Link URL"
          variant="outlined"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="text" @click="editLinkDialog = false">
          Cancel
        </v-btn>
        <v-btn color="primary" variant="text" @click="saveLink">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ViewBadgeAwards :badges="unviewedBadges" />
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
  height: 25vh; /* Allows it to grow dynamically */
  max-width: 100%;
}

.adminItem {
  display: flex;
  flex-direction: column;
  padding: 15px 0px 5px 0px;
  border-radius: 25px;
  height: 100%;
}

.pagination {
  margin-top: 20px;
  padding: 10px 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.link-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.link-container a {
  color: inherit;
  transition: color 0.2s;
}

.link-container a:hover {
  color: var(--v-primary-base);
}

.v-icon {
  color: var(--v-primary-base);
}
</style>
