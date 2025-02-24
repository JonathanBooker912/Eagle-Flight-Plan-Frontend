<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import defaultImage from "/defaultRewardImage.png";
const props = defineProps({
  reward: Object,
});
const emit = defineEmits(["edit", "delete", "shop"]);

const imageSrc = ref("");

const loadImage = (image) => {
  if (!image || !image.data) return;

  // Ensure image.data is a Uint8Array
  const byteArray = new Uint8Array(image.data);

  const blob = new Blob([byteArray], { type: "image/jpg" }); // Adjust type accordingly
  imageSrc.value = URL.createObjectURL(blob);
};

onMounted(() => loadImage(props.reward.image));
onUnmounted(() => URL.revokeObjectURL(imageSrc.value));
</script>
<template>
  <v-card color="backgroundDarken" class="cardContainer">
    <v-card-text>
      <v-img
        class="image"
        v-if="imageSrc"
        :src="imageSrc"
        alt="Uploaded Image"
      ></v-img>
      <v-img
        class="image"
        v-else
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
          @click="emit('delete', props.reward.id)"
          ><v-icon icon="mdi-delete" color="text" size="x-large"></v-icon
        ></v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.cardContainer {
  min-width: 280px;
  border-radius: 25px;
}
.cardButton {
  border-radius: 13px;
}
.image {
  max-height: 150px;
}
</style>
