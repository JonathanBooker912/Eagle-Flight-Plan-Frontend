<script setup>
//import eventServices from '../../services/eventServices';
import notificationServices from "../../services/notificationServices";

import { onMounted, ref } from "vue";
// import { useModalStore } from "../../store/modal.store";
// import { storeToRefs } from "pinia";

//const modalStore = useModalStore();

//const items = ref([]);
// const events = ref({});
const notifications = ref([]);
const isLoaded = ref(false);
/*
const getEvents = async () => {
  await eventServices
    .getAllEventsForUser()
    .then((res) => {
      items.value = res.data;
      isLoaded.value = true;
    })
    .catch((err) => console.log(err));
};*/

const getNotifications = async () => {
  await notificationServices
    .getAllNotificationsForUser()
    .then((res) => {
      notifications.value = res.data;      
      isLoaded.value = true;
      console.log(notifications);
    })
    .catch((err) => console.log(err));
};

onMounted(() => {
  // getEvents();
  getNotifications();
});
//ok so now that we have the services, get the data.
</script>

<template>
  <v-card color="backgroundDarken" class="main-back">
    <v-row justify="center">
      <v-card color="background" class="adminItem adminItemSmall">
        <p>Upcoming Events</p>
      </v-card>
      <v-card color="background" class="adminItem adminItemBig">
        <p>Test</p>
      </v-card>
      <v-card color="background" class="adminItem adminItemSmall">
        <strong style="font-size: 20px">Notifications</strong>
        <div id="notifList">
          <div class="notification" v-for="(item, index) in notifications.slice(0, 3)" :key="index">
            <strong style="font-size: 18px">{{ item.header }}</strong>
            <p style="font-size: 14px">{{ item.description }}</p>
          </div>
        </div>
      </v-card>
      <v-card color="background" class="adminItem adminItemBig">
        <p>Test</p>
      </v-card>
    </v-row>
  </v-card>
</template>

<style>
.main-back {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
  flex-wrap: wrap;
  align-self: flex-end;
  border-radius: 25px;
}

.adminItem {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin: 2%;
  height: 30vh;
  padding: 15px 2px 5px 5px;

  border-radius: 25px;

}

.adminItemSmall {
  width: 40%;
}

.adminItemBig {
  width: 50%;
}

.notification {
  padding: 2px 5px 2px 5px;
  width: 100%;
  border: 2px #f00 solid;
}
</style>
