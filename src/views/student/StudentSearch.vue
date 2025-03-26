<script setup>
import { onMounted, ref } from "vue";
import userServices from "../../services/userServices";
import UserCard from "../../components/cards/UserCard.vue";
import User from "../../../../Eagle-Flight-Plan-Backend/app/models/user.model";

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
  <h1>HERE</h1>

</template>
