<script setup>
import { onMounted, ref } from "vue";
import userServices from "../../services/userServices";

const users = ref([]);
const x = ref([]);

const getUsers = async () => {
  try {
    const res = await userServices.getAllUser(); // PASS IN THE ID
    users.value = res.data; // Update links
    x.value = users.value.rows;
    console.log(users.value);
  } catch (err) {
    console.error("Error fetching user:", err); // Error handling
  }
};

const sendToProfile = async () => {};

onMounted(() => {
  getUsers();
});
</script>

<template>
  <v-row>
    <v-btn
      :key="user.id"
      v-for="user in x"
      class="test"
      @onclick="sendToProfile"
    >
      <router-link :to="`/student/profile/${user.id}`">
        {{ user.fName }}
      </router-link>
    </v-btn>
  </v-row>
</template>

<style>
.test {
  margin: 10px;
  height: 20px;
}
</style>
