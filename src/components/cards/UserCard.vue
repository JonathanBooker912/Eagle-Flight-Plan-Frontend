<template>
  <v-card class="cardContainer">
    <v-card-text color="backgroundDarken" class="user-card">
      <img src="/Birb.png" class="user-img" alt="User Image" />
      <v class="user-info" color="">
        <p class="name">{{ props.name }}</p>
        <p class="grade">{{ props.grade }}</p>
        <p class="major">{{ props.major }}</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  name: "Jonah",
  grade: "Sophomore",
  major: "Computer",
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
