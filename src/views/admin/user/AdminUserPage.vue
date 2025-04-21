<script setup>
import { useRouter } from "vue-router";
import CardHeader from "../../../components/CardHeader.vue";
import UserCard from "../../../components/cards/UserCard.vue";
import CardTable from "../../../components/CardTable.vue";
import userServices from "../../../services/userServices";
import { ref, watch } from "vue";

const users = ref([]);
const page = ref(1);
const count = ref(0);
const searchQuery = ref("");
const showInfo = ref(false);
const userToShow = ref(null);

const router = useRouter();

const fetchUsers = async ({
  pageNumber = page.value,
  query = searchQuery.value,
}) => {
  const response = await userServices.getAllUserForAdmin(pageNumber, 8, query);
  users.value = response.data.users;
  count.value = response.data.count;
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1; // Reset to first page on search change
};

const handleCardClick = (user) => {
  console.log(user);
  userToShow.value = user;
  showInfo.value = true;
};

const handleViewFlightPlan = () => {
  router.push({
    name: "adminStudentFlightPlan",
    params: { id: userToShow.value.student.id },
  });
};

const handleViewProfile = () => {
  router.push({
    name: "adminProfile",
    params: { userId: userToShow.value.id },
  });
};

const handleRedeemRewards = () => {
  router.push({
    name: "redeemReward",
    params: { studentId: userToShow.value.student.id },
  });
};

watch([page, searchQuery], fetchUsers, { immediate: true });
</script>
<template>
  <v-container>
    <CardHeader
      label="Users"
      :add-button="false"
      :filter-button="false"
      @changed="handleSearchChange"
    ></CardHeader>
    <v-row v-if="users.length === 0" class="justify-center">
      <v-col>
        <v-alert color="danger" class="text-center"> No results found </v-alert>
      </v-col>
    </v-row>
    <CardTable
      v-else
      :items="users"
      :per-row-lg="showInfo ? 3 : 4"
      :per-row-md="showInfo ? 2 : 3"
      :per-row-sm="showInfo ? 1 : 2"
      :show-info="showInfo"
      :info-label="userToShow?.fullName"
      @close-info="showInfo = false"
    >
      <template #item="{ item }">
        <UserCard
          :key="item.id"
          :user="item"
          @card-pressed="handleCardClick"
        ></UserCard>
      </template>
      <template #info>
        <div class="d-flex flex-column" style="height: 90%">
          <div>
            <p>
              Major:
              {{ userToShow.student?.majors[0]?.name || "Undeclared" }}
            </p>
            <p>Role: {{ userToShow.roles[0]?.name || "Student" }}</p>
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-btn
              block
              color="primary"
              class="mb-2"
              @click="handleViewFlightPlan"
              >View Flight Plan</v-btn
            >
            <v-btn block color="primary" class="mb-2" @click="handleViewProfile"
              >View Profile</v-btn
            >
            <v-btn
              block
              color="primary"
              class="mb-2"
              @click="handleRedeemRewards"
              >Redeem Rewards</v-btn
            >
          </div>
        </div>
      </template>
    </CardTable>
    <v-pagination
      v-model="page"
      :length="count"
      :total-visible="$vuetify.display.smAndDown ? 3 : 5"
      class="m-2"
      @next="fetchUsers"
      @prev="fetchUsers"
      @update:model-value="fetchUsers"
    >
    </v-pagination>
  </v-container>
</template>
