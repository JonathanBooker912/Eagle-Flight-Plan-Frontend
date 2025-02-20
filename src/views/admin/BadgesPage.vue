<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import  badgeServices from "../../services/badgeServices";
import  BadgeCard from "../../components/cards/BadgeCard.vue";
import CardTable from "../../components/CardTable.vue";
import CardHeader from "../../components/CardHeader.vue";

// Constants
const PAGE_SIZE = 8;
const label = " Badges";

// Reactive states
const router = useRouter();
const  badges = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);

// Fetch  badges
const get Badges = async (pageNumber = page.value) => {
  try {
    const result = await  badgeServices.getAll Badges(
      pageNumber,
      PAGE_SIZE,
      searchQuery.value,
    );
     badges.value = result.data. badges;
    count.value = result.data.count;
  } catch (error) {
    console.error("Error fetching  badges:", error);
  }
};

// Handlers
const handleAdd = () => router.push({ name: "add" });
const handleEdit = ( badgeId) =>
  router.push({ name: "edit", params: { id:  badgeId } });

const handleDelete = async ( badgeId) => {
  try {
    await  badgeServices.delete Badge( badgeId);
    await get Badges(); // Re-fetch  badges after delete
  } catch (error) {
    console.error("Error deleting  badge:", error);
  }
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1; // Reset to first page on search change
  get Badges(page.value);
};

// Initial fetch
onMounted(() => get Badges());
</script>
<template>
  <v-container fluid>
    <CardHeader
      :label="label"
      @changed="handleSearchChange"
      @add="handleAdd"
    ></CardHeader>
    <v-row v-if=" badges.length === 0" class="justify-center">
      <v-col>
        <v-alert color="danger" class="text-center"> No results found </v-alert>
      </v-col>
    </v-row>
    <CardTable
      v-else
      :items=" badges"
      :per-row-lg="4"
      :per-row-md="3"
      :per-row-sm="2"
    >
      <template #item="{ item }">
        < BadgeCard
          : badge="item"
          @edit="handleEdit"
          @delete="handleDelete"
        ></ BadgeCard>
      </template>
    </CardTable>
    <v-pagination
      v-model="page"
      :length="count"
      :total-visible="$vuetify.display.smAndDown ? 3 : 5"
      class="m-2"
      @next="get Badges"
      @prev="get Badges"
      @update:model-value="get Badges"
    >
    </v-pagination>
  </v-container>
</template>
