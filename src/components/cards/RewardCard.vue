<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import defaultImage from "/defaultRewardImage.png";

// Props and Emits
const props = defineProps({
  reward: { type: Object, required: true },
  isView: { type: Boolean, default: true },
  variant: { type: String, default: "default" },
  studentPoints: { type: Number, default: 0 },
});

const emit = defineEmits(["edit", "delete", "shop", "show", "redeem"]);

// State
const imageSrc = ref("");

// Computed Properties
const canRedeem = computed(() => props.studentPoints >= props.reward.points);

// Methods
const loadImage = (image) => {
  if (!image?.data) return;

  const byteArray = new Uint8Array(image.data);
  const blob = new Blob([byteArray], { type: image.type });
  imageSrc.value = URL.createObjectURL(blob);
};

// Lifecycle Hooks
onMounted(() => loadImage(props.reward.image));
onUnmounted(() => URL.revokeObjectURL(imageSrc.value));
</script>

<template>
  <v-card :color="'backgroundDarken'" class="rounded-xl">
    <v-card-text>
      <!-- Image Section -->
      <v-img
        class="image mb-3"
        :src="imageSrc || defaultImage"
        :alt="imageSrc ? 'Uploaded Image' : 'Generic Merchandise Image'"
      />

      <!-- Title Section -->
      <p class="text-h5 text-center my-2">
        {{ props.reward.name }}
      </p>

      <!-- Points Display -->
      <p
        v-if="props.variant === 'redeem'"
        class="text-subtitle-1 text-center my-2"
      >
        {{ props.reward.points }} pts
      </p>

      <!-- Action Buttons -->
      <v-row class="ma-2 justify-center">
        <!-- Default Variant Buttons -->
        <template v-if="props.variant === 'default'">
          <v-btn
            v-if="isView"
            color="primary"
            class="rounded-lg"
            @click="emit('show', props.reward)"
          >
            <v-icon icon="mdi-eye" color="text" size="x-large" />
          </v-btn>

          <template v-else>
            <v-btn
              color="primary"
              class="mr-2 rounded-lg"
              @click="emit('shop', props.reward.id)"
            >
              <v-icon icon="mdi-shopping" color="text" size="x-large" />
            </v-btn>
            <v-btn
              color="warning"
              class="mr-2 rounded-lg"
              @click="emit('edit', props.reward.id)"
            >
              <v-icon icon="mdi-pencil" color="text" size="x-large" />
            </v-btn>
            <v-btn
              color="danger"
              class="rounded-lg"
              @click="emit('delete', props.reward.id, props.reward.imageName)"
            >
              <v-icon icon="mdi-delete" color="text" size="x-large" />
            </v-btn>
          </template>
        </template>

        <!-- Redeem Variant Buttons -->
        <template v-else-if="props.variant === 'redeem'">
          <v-btn
            :color="canRedeem ? 'primary' : 'danger'"
            class="rounded-lg"
            :variant="!canRedeem ? 'outlined' : undefined"
            :readonly="!canRedeem"
            @click="canRedeem && emit('redeem', props.reward)"
          >
            {{ canRedeem ? "Redeem" : "Not enough points" }}
          </v-btn>
        </template>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.image {
  max-height: 125px;
}
</style>
