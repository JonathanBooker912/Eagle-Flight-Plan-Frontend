<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import rewardServices from "../../../services/rewardServices";
import RewardCard from "../../../components/cards/RewardCard.vue";
import CardHeader from "../../../components/CardHeader.vue";
import CardTable from "../../../components/CardTable.vue";

// Constants
const PAGE_SIZE = 8;
const label = "Rewards";

// Reactive states
const router = useRouter();
const rewards = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);

// Fetch rewards
const getRewards = async (
  pageNumber = page.value,
  query = searchQuery.value
) => {
  try {
    console.log(pageNumber);
    const result = await rewardServices.getAllRewards(
      pageNumber,
      PAGE_SIZE,
      query
    );
    rewards.value = result.data.rewards || [];
    count.value = result.data.count || 0;
  } catch (error) {
    console.error("Error fetching rewards:", error);
  }
};

// Handlers
const handleAdd = () => {
  router.push({ name: "addReward" });
};
const handleEdit = (rewardId) =>
  router.push({ name: "editReward", params: { id: rewardId } });
const handleShop = (rewardId) => {
  router.push({ name: "redeemReward", params: { id: rewardId } });
};

const handleDelete = async (rewardId, rewardFileName) => {
  try {
    if (rewardFileName) {
      await rewardServices.deleteRewardImage(rewardFileName);
    }
    await rewardServices.deleteReward(rewardId);
    await getRewards(); // Re-fetch rewards after delete
  } catch (error) {
    console.error("Error deleting reward:", error);
  }
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1; // Reset to first page on search change
};

watch([page, searchQuery], getRewards, { immediate: true });
</script>
<template>
  <v-container fluid>
    <CardHeader
      :label="label"
      @changed="handleSearchChange"
      @add="handleAdd"
    ></CardHeader>
    <v-row v-if="rewards.length === 0" class="justify-center">
      <v-col>
        <v-alert color="danger" class="text-center"> No results found </v-alert>
      </v-col>
    </v-row>
    <CardTable
      v-else
      :items="rewards"
      :per-row-lg="4"
      :per-row-md="3"
      :per-row-sm="2"
    >
      <template #item="{ item }">
        <RewardCard
          :key="item.id"
          :reward="item"
          @shop="handleShop"
          @edit="handleEdit"
          @delete="handleDelete"
        ></RewardCard>
      </template>
    </CardTable>
    <v-pagination
      v-model="page"
      :length="count"
      :total-visible="$vuetify.display.smAndDown ? 3 : 5"
      class="m-2"
      @next="getRewards"
      @prev="getRewards"
      @update:model-value="getRewards"
    >
    </v-pagination>
  </v-container>
</template>
