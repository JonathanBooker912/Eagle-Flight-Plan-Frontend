<template>
  <v-card color="backgroundDarken" class="notification">
    <v-row class="notifContent">
      <img
        style="height: 40px; width: 40px; margin-right: 15px"
        src="../../../public/Birb.png"
      />
      <div class="textContent">
        <v-card-text>
          <p style="font-size: 18px">{{ props.notification.header }}</p>
        </v-card-text>
        <v-card-text>
          <p style="font-size: 14px">{{ props.notification.description }}</p>
        </v-card-text>
      </div>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "../../stores/userStore";
// import dayjs from "dayjs";
// import advancedFormat from "dayjs/plugin/advancedFormat";

const store = userStore();
const isAdmin = ref(false);

onMounted(async () => {
  isAdmin.value = await store.isAdmin();
});

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});
</script>

<style>
.notification {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: auto;
  width: 100%;
  display: flex;
  align-items: center; /* Align items in the center vertically */
  border-radius: 8px; /* Optional: makes the card have rounded corners */
}

.notifContent {
  display: flex;
  align-items: center;
  width: 100%;
}

.textContent {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-grow: 1; /* Allow text content to take up remaining space */
}

.notification img {
  margin-right: 15px; /* Space between image and text */
}
</style>
