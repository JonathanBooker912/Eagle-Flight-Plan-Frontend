<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import defaultImage from "../../assets/DefaultBadgeImage.png";

const props = defineProps({
  badge: { type: Object, required: true },
  isProfilePage: { type: Boolean, default: false }, 
});
const emit = defineEmits(["edit", "delete"]);

const imageSrc = ref("");

const loadImage = (image) => {
  if (!image || !image.data) return;

  // Ensure image.data is a Uint8Array
  const byteArray = new Uint8Array(image.data);

  const blob = new Blob([byteArray], { type: image.type }); // Adjust type accordingly
  imageSrc.value = URL.createObjectURL(blob);
};

// Vue functions
onMounted(() => {
  console.log(props.badge.image);
  loadImage(props.badge.image);
});
onUnmounted(() => URL.revokeObjectURL(imageSrc.value));

// Computed property to determine the card style
const cardClass = computed(() => {

  if (props.isProfilePage) {
    console.log("I am in the prof page!");
  }


  return props.isProfilePage ? "profile-card" : "";
});
</script>

<template>
  <v-card :class="['cardContainer', cardClass]">
    <v-card-text>
      <v-img
        v-if="imageSrc"
        class="image"
        :src="imageSrc"
        alt="Uploaded Image"
      ></v-img>
      <v-img
        v-else
        class="image"
        :src="defaultImage"
        alt="Generic Merchandise Image"
      ></v-img>
      <p class="text-subtitle-1 text-center my-2">
        {{ props.badge.name }}
      </p>
      <v-row v-show="!props.isProfilePage" class="ma-2 justify-center">
        <v-btn
          color="warning"
          class="mr-2 cardButton"
          @click="emit('edit', props.badge.id)"
        >
          <v-icon icon="mdi-pencil" color="text" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          color="danger"
          class="cardButton"
          @click="emit('delete', props.badge.id, props.badge.imageName)"
        >
          <v-icon icon="mdi-delete" color="text" size="x-large"></v-icon>
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.cardContainer {
  border-radius: 25px;
  /* Original styling */
}
.cardButton {
  border-radius: 13px;
}
.image {
  max-height: 150px;
}

.profile-card {
  max-width: 200px; /* Smaller card for profile page */
  font-size: 12px;
}

.profile-card .image {
  max-height: 100px; /* Smaller image for profile page */
}
</style>
