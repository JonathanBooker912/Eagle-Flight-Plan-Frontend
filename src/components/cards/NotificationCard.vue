<template>
    <v-card color="backgroundDarken">
        <v-row>
            <v-col>
                <img  style="height: 30px; margin-right: 5px" src="../../../public/Birb.png">
                <v-card-text>
                    <p>{{ props.notification.header }}</p>
                </v-card-text>
                <v-card-text>
                    <p>{{ props.notification.description }}</p>
                </v-card-text>
            </v-col>
        </v-row>
    </v-card>
</template>


<script setup>

import notificationServices from "../../services/notificationServices";
import { onMounted, ref } from "vue";


onMounted(() => {
  getNotifications();
});

const notifications = ref([]);


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



</script>