<script setup>
const props = defineProps({
  badge: Object,
});

const emit = defineEmits(["edit", "delete"]);
</script>
<template>
  <v-card color="backgroundDarken" class="cardContainer">
    <v-card-text class="text-center" style="padding-bottom: 0px">
      <img
        src="../../assets/goldBadgeMock.png"
        width="100"
        class="badgeImage"
      />
      <p class="text-h5 mb-2">
        {{
          props.badge.name.trim().length > 20
            ? props.badge.name.trim().substring(0, 20) + "..."
            : props.badge.name.trim()
        }}
      </p>
    </v-card-text>
    <v-row class="ma-2 actionButtons">
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
        @click="emit('delete', props.badge.id)"
      >
        <v-icon icon="mdi-delete" color="text" size="x-large"></v-icon
      ></v-btn>
    </v-row>
  </v-card>
</template>

<style scoped>
.cardContainer {
  justify-items: center;
  margin: 10px;
  display: block;
  width: 300px;
  height: auto;
  border-radius: 25px;
}

.cardButton {
  border-radius: 13px;
}

.badgeImage {
  display: block;
  margin: 0 auto;
}

.actionButtons {
  justify-content: center;
  padding-bottom: 10px;
}
</style>
