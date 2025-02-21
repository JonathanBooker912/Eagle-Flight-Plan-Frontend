<template>
  <v-card color="backgroundDarken" class="cardContainer user-card">
    <v-card-text>
      <img src="/Birb.png" class="user-img" alt="User Image" />
      <div class="user-info">
        <p class="name">{{ props.user.name }}</p>
        <p class="grade">{{ props.user.grade }}</p>
        <p class="major">{{ props.user.major }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  user: Object,
});
const emit = defineEmits(["edit", "delete"]);
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  height: 20vh;
  width: 40vh;
  margin: 20px;
  border-radius: 25px;
  border-left: 10px solid #f00;
  background-color: white;
}

.user-img {
  width: 33%;
  height: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 10px;
}

.name {
  font-weight: bold;
  font-size: 1.2em;
  color: gray;
}

.grade,
.major {
  font-size: 1em;
  color: gray;
}
</style>
