<script setup>
import { onMounted, ref } from "vue";
import userServices from "../../services/userServices";
import UserCard from "../../components/cards/UserCard.vue";

const users = ref([]);

const getUsers = async () => {
  try {
    const res = await userServices.getAllUser(); // PASS IN THE ID
    users.value = res.data; // Update links
    console.log(users.value);
  } catch (err) {
    console.error("Error fetching user:", err); // Error handling
  }
};

onMounted(() => {
  getUsers();
});
</script>

<template>
   <v-row>
    <v-col
      v-for="(item, index) in users"
      :key="index"
      cols="12"
      style="padding: 0px 10px"
    >
      <UserCard :user="item" />
    </v-col>
  </v-row>
</template>
