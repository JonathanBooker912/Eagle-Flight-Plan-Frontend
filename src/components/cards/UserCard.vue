<template>
  <v-card class="cardContainer" color="backgroundDarken">
    <v-card-text class="user-card">
      <img src="/Birb.png" class="user-img" alt="User Image" />
      <div class="user-info">
        <span color="text" class="name">{{ props.name }}</span>
        <span color="text" class="grade">{{ props.grade }}</span>
        <span color="text" class="major">{{ props.major }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: "Jonah" },
  grade: { type: String, default: "Sophomore" },
  major: { type: String, default: "Computer Science" },
  role: { type: String, default: "Student" },
});
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
  border-left: 10px solid;
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
}

.grade,
.major {
  font-size: 1em;
}
</style>
