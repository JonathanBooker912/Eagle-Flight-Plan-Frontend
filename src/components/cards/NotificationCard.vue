<template>
  <v-card
    color="background"
    :class="{
      'opacity-40': props.notification.read,
      'opacity-100': !props.notification.read,
    }"
    class="pa-3 my-2 rounded-lg"
  >
    <v-row align="center" class="d-flex w-100">
      <v-img
        src="../../../public/Birb.png"
        alt="Notification Image"
        max-width="40"
        max-height="40"
        class="mr-3 flex-shrink-0"
      />

      <v-typography class="font-weight-bold mr-3">
        {{ props.notification.user.fName }}
        {{ props.notification.user.lName }}
      </v-typography>

      <v-typography class="mr-3">
        {{ props.notification.header }}
      </v-typography>

      <v-typography class="text-body-2">
        {{ props.notification.description }}
      </v-typography>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userStore } from "../../stores/userStore";

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
