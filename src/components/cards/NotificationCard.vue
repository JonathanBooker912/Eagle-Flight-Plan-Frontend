<template>
  <v-card
    color="background"
    class="notification"
    :class="{ read: props.notification.read, unread: !props.notification.read }"
  >
    <v-row class="notifContent" align="center">
      <!-- Notification Image -->
      <v-img
        class="notifImage"
        src="../../../public/Birb.png"
        alt="Notification Image"
        max-width="40"
        max-height="40"
      />

      <v-col class="textContainer">
        <!-- User Information -->
        <div class="textColumn">
          <v-typography class="userName" font-weight="bold">
            {{ props.notification.user.fName }}
            {{ props.notification.user.lName }}
          </v-typography>
        </div>

        <!-- Notification Header -->
        <div class="textColumn">
          <v-typography class="notifHeader">{{
            props.notification.header
          }}</v-typography>
        </div>

        <!-- Description -->
        <div class="textColumn">
          <v-typography class="description">{{
            props.notification.description
          }}</v-typography>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "../../stores/userStore";

// Store and isAdmin initialization
const store = userStore();
const isAdmin = ref(false);

// Check admin status on mounted
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

<style scoped>
.notification {
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
}

.notifContent {
  display: flex;
  align-items: center;
  width: 100%;
}

.notifImage {
  flex-shrink: 0;
  margin-right: 15px;
}

.textContainer {
  display: flex;
  justify-content: space-between;
}

.textColumn {
  flex: 1;
  text-align: center;
  font-size: 16px;
}

.description {
  font-size: 14px;
}

.read {
  opacity: 0.4;
}

.unread {
  background-color: #ffffff;
}

.status-chip {
  margin-top: 10px;
  text-transform: capitalize;
}
</style>
