<script setup>
import { onMounted, ref, watch } from "vue";
import apiClient from "../services/services"
import { userStore } from "../stores/userStore";

const currentPage = ref(1);
const store = userStore();
const user = store.user;

onMounted(() => {
    console.log(user);
});
</script>

<template>
  <v-row justify="center" class="thing">
    <v-card color="backgroundDarken" class="topBar">
      <v-container>
        <v-row no-gutters justify="space-evenly">
          <v-col class="text-center" style="position: relative">
            <!-- Profile Picture extending above the box -->
            <v-img
              src="../../public/Birb.png"
              height="150"
              width="150"
              class="profile-pic"
              style="
                position: absolute;
                top: -50px;
                z-index: 10000;
                left: 50%;
                margin-bottom: 20px;
                transform: translateX(-50%);
                border-radius: 50%;
              "
            />
            <p>{{ user.fullName }}</p>
            <p>{ GRADE }</p>
          </v-col>
          <v-col class="text-center">
            <p>
              I am currently a Software Development Engineer In test (SDET)
              Intern for Paycom during the Fall 2024 semester working part time.
            </p>
          </v-col>
          <v-col class="text-center">
            <p>{ MAJOR }</p>
            <p>{{ user.email }}</p>
            <p>{ PO BOX }</p>
          </v-col>
          <v-col class="text-center">
            <p>{ Link one }</p>
            <p>{ Link two }</p>
            <p>{ Link three }</p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <p>Awards</p>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemBig">
      <p>Strengths</p>
    </v-card>
  </v-row>
</template>

<style>
.thing {
  margin: 5vh 2vw 5vh 2vw;
  width: 85vw;
}

.topBar {
  display: flex;
  flex-direction: column;
  width: 90vw;
  height: 20vh;
}

.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 1%;
  height: 45vh;
  padding: 15px 0px 5px 0px;

  border-radius: 25px;
}

.adminItemSmall {
  width: 35vw;
}

.adminItemBig {
  justify-content: center;
  align-items: center;
  width: 45vw;
}

.notification {
  padding: 0px 10px 0px 10px;
  margin: 10px 5px 10px 5px;
  height: 8vh;
  width: 100%;
}
</style>
