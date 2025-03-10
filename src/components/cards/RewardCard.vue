<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import defaultImage from "/defaultRewardImage.png";

// Define statements for vue
const props = defineProps({
  reward: { type: Object, required: true },
});
const emit = defineEmits(["edit", "delete", "shop"]);

// Reactive states
const imageSrc = ref("");

// Functions
const loadImage = (image) => {
  if (!image || !image.data) return;

  // Ensure image.data is a Uint8Array
  const byteArray = new Uint8Array(image.data);

  const blob = new Blob([byteArray], { type: image.type }); // Adjust type accordingly
  imageSrc.value = URL.createObjectURL(blob);
};

// Vue functions
onMounted(() => {
  loadImage(props.reward.image);
});
onUnmounted(() => URL.revokeObjectURL(imageSrc.value));
</script>
<template>
  <v-card color="backgroundDarken" class="cardContainer">
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
      >
      </v-img>
      <p class="text-h5 text-center my-2">
        {{ props.reward.name }}
      </p>
      <v-row class="ma-2 justify-center">
        <v-btn
          color="primary"
          class="mr-2 cardButton"
          @click="emit('shop', props.reward.id)"
        >
          <v-icon icon="mdi-shopping" color="text" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          color="warning"
          class="mr-2 cardButton"
          @click="emit('edit', props.reward.id)"
        >
          <v-icon icon="mdi-pencil" color="text" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          color="danger"
          class="cardButton"
          @click="emit('delete', props.reward.id, props.reward.imageName)"
          ><v-icon icon="mdi-delete" color="text" size="x-large"></v-icon
        ></v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.cardContainer {
  border-radius: 25px;
}
.cardButton {
  border-radius: 13px;
}
.image {
  max-height: 150px;
}
</style>
