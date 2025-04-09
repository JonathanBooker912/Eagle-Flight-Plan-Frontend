<script setup>
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import CardTable from "../../components/CardTable.vue";
import CardHeader from "../../components/CardHeader.vue";
import rewardServices from "../../services/rewardServices";
import RewardCard from "../../components/cards/RewardCard.vue";

const rewards = ref([]);
const totalPages = ref(0);
const searchQuery = ref("");
const page = ref(1);
const showReward = ref(false);
const rewardToShow = ref({});

const display = useDisplay();
const numCardColumns = computed(() => {
  if (display.xxl.value) return 4;
  if (display.xl.value) return 3;
  if (display.lg.value) return 3;
  if (display.md.value) return 2;
  if (display.sm.value) return 1;
  return 1; // Default for xs
});
const pageSize = computed(() => numCardColumns.value * 2);

const fetchRewards = async () => {
  const response = await rewardServices.getAllRewards(
    page.value,
    pageSize.value,
    searchQuery.value,
  );
  rewards.value = response.data.rewards;
  totalPages.value = response.data.count;
};

const handleSearch = async () => {
  await fetchRewards();
};

const handleShowReward = (reward) => {
  rewardToShow.value = reward;
  showReward.value = true;
};

watch([page, searchQuery], () => fetchRewards(), { immediate: true });
</script>
<template>
  <v-container fluid>
    <CardHeader
      :label="'Shop'"
      :addButton="false"
      :filter-button="false"
      @changed="handleSearch"
    >
    </CardHeader>
    <CardTable
      :items="rewards"
      :totalPages="totalPages"
      :show-info="showReward"
      :info-label="rewardToShow.name"
      @close-info="showReward = false"
    >
      <template #item="{ item }">
        <RewardCard :reward="item" @show="handleShowReward" />
      </template>
      <template #pagination>
        <v-pagination v-model="page" :length="totalPages" />
      </template>
      <template #info>
        <p class="text-h6 mt-2">Description:</p>
        <p class="mb-2 text-subtitle-1">
          {{ rewardToShow.description }}
        </p>
        <p class="text-h6">Points:</p>
        <p class="mb-2 text-subtitle-1">{{ rewardToShow.points }} pts</p>

        <p class="text-h6">Redeem at:</p>
        <p class="mb-2 text-subtitle-1">
          This reward can be redeemed by visiting the Career Services office.
        </p>
      </template>
    </CardTable>
  </v-container>
</template>
