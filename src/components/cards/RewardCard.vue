<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import defaultImage from "/defaultRewardImage.png";

// Define statements for vue
const props = defineProps({
  reward: { type: Object, required: true },
  isView: { type: Boolean, default: true },
});
const emit = defineEmits(["edit", "delete", "shop", "show"]);

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
  <v-card color="backgroundDarken" class="rounded-xl">
    <v-card-text>
      <v-img
        v-if="imageSrc"
        class="image mb-3"
        :src="imageSrc"
        alt="Uploaded Image"
      ></v-img>
      <v-img
        v-else
        class="image mb-3"
        :src="defaultImage"
        alt="Generic Merchandise Image"
      >
      </v-img>
      <p class="text-h5 text-center my-2">
        {{ props.reward.name }}
      </p>
      <v-row v-if="isView" class="justify-center ma-2">
        <v-btn
          color="primary"
          class="mr-2 rounded-lg"
          @click="emit('show', props.reward)"
        >
          <v-icon icon="mdi-eye" color="text" size="x-large"></v-icon>
        </v-btn>
      </v-row>
      <!-- <p v-if="isView" class="text-subtitle-1 text-center my-2">
                {{ props.reward.points }} pts
            </p> -->
      <v-row v-if="!isView" class="ma-2 justify-center">
        <v-btn
          color="primary"
          class="mr-2 rounded-lg"
          @click="emit('shop', props.reward.id)"
        >
          <v-icon icon="mdi-shopping" color="text" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          color="warning"
          class="mr-2 rounded-lg"
          @click="emit('edit', props.reward.id)"
        >
          <v-icon icon="mdi-pencil" color="text" size="x-large"></v-icon>
        </v-btn>
        <v-btn
          color="danger"
          class="rounded-lg"
          @click="emit('delete', props.reward.id, props.reward.imageName)"
          ><v-icon icon="mdi-delete" color="text" size="x-large"></v-icon
        ></v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.image {
  max-height: 150px;
}
</style>
