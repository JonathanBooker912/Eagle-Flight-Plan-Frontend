<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import taskServices from "../../services/taskServices";
import TaskCard from "../../components/cards/TaskCard.vue";
import CardTable from "../../components/CardTable.vue";
import CardHeader from "../../components/CardHeader.vue";

// Constants
const PAGE_SIZE = 8;
const label = "Tasks";

// Reactive states
const router = useRouter();
const tasks = ref([]);
const page = ref(1);
const searchQuery = ref("");
const count = ref(0);

// Fetch tasks
const getTasks = async (pageNumber = page.value) => {
  try {
    const result = await taskServices.getAllTasks(
      pageNumber,
      PAGE_SIZE,
      searchQuery.value,
    );
    tasks.value = result.data.tasks;
    count.value = result.data.count;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Handlers
const handleAdd = () => router.push({ name: "add" });
const handleEdit = (taskId) =>
  router.push({ name: "edit", params: { id: taskId } });

const handleDelete = async (taskId) => {
  try {
    await taskServices.deleteTask(taskId);
    await getTasks(); // Re-fetch tasks after delete
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

const handleSearchChange = (input) => {
  searchQuery.value = input;
  page.value = 1; // Reset to first page on search change
  getTasks(page.value);
};

// Initial fetch
onMounted(() => getTasks());
</script>
<template>
  <v-container fluid>
    <CardHeader
      :label="label"
      @changed="handleSearchChange"
      @add="handleAdd"
    ></CardHeader>
    <v-row v-if="tasks.length === 0" class="justify-center">
      <v-col>
        <v-alert color="danger" class="text-center"> No results found </v-alert>
      </v-col>
    </v-row>
    <CardTable
      v-else
      :items="tasks"
      :per-row-lg="4"
      :per-row-md="3"
      :per-row-sm="2"
    >
      <template #item="{ item }">
        <TaskCard
          :task="item"
          @edit="handleEdit"
          @delete="handleDelete"
        ></TaskCard>
      </template>
    </CardTable>
    <v-pagination
      v-model="page"
      :length="count"
      :total-visible="$vuetify.display.smAndDown ? 3 : 5"
      class="m-2"
      @next="getTasks"
      @prev="getTasks"
      @update:model-value="getTasks"
    >
    </v-pagination>
  </v-container>
</template>
