<script setup>
import { RouterView } from "vue-router";
</script>

<template>
  <v-card>
    <p>This is where the bar will go</p>
  </v-card>
  <v-row>
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <strong style="font-size: 20px; padding-bottom: 5px"
        >Upcoming Events</strong
      >
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemBig">
      <p>Engagement Breakdown by Classification</p>
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemSmall">
      <strong style="font-size: 20px; padding-bottom: 5px"
        >Notifications</strong
      >
    </v-card>
    <v-card color="backgroundDarken" class="adminItem adminItemBig">
      <p>Percentage of students on track to complete their flight plan</p>
    </v-card>
  </v-row>
</template>

<style>
.main-back {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5%;
  padding: 0.5%;
  flex-wrap: wrap;
  align-self: flex-end;
  border-radius: 25px;
  width: 90vw;
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
