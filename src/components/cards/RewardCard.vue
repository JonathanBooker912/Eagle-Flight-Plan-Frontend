<script setup>
import { onUnmounted } from "vue";
import { onMounted } from "vue";

const props = defineProps({
  reward: Object,
});
const emit = defineEmits(["edit", "delete", "shopping"]);

const imageUrl = ref();

onMounted(() => {
  imageUrl.value = URL.createObjectURL(blob);
});
onUnmounted(() => {
  URL.revokeObjectURL(imageUrl.value);
});
</script>
<template>
  <v-card color="backgroundDarken" class="cardContainer">
    <v-card-text>
      <v-img></v-img>
      <p class="text-h5 mb-2">
        {{ props.task.name }}
      </p>
      <p class="text-subtitle-1 font-weight-regular">
        Category: {{ props.task.category }}
      </p>
      <p class="text-subtitle-1 font-weight-regular">
        Type: {{ props.task.taskType }}
      </p>
      <p class="text-subtitle-1 font-weight-regular">
        Completion Type: {{ props.task.completionType }}
      </p></v-card-text
    >
    <v-row class="ma-2 float-right">
      <v-btn color="warning" class="mr-2 cardButton" @click="emit('shopping')">
        <v-icon icon="mdi-shopping" color="text" size="x-large"></v-icon>
      </v-btn>
      <v-btn
        color="warning"
        class="mr-2 cardButton"
        @click="emit('edit', props.task.id)"
      >
        <v-icon icon="mdi-pencil" color="text" size="x-large"></v-icon>
      </v-btn>
      <v-btn
        color="danger"
        class="cardButton"
        @click="emit('delete', props.task.id)"
        ><v-icon icon="mdi-delete" color="text" size="x-large"></v-icon
      ></v-btn>
    </v-row>
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
</style>
