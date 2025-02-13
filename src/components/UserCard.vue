<script setup>

</script>


<template>

    <v-card class="userCard">
      <img src="/Birb.png" class="userImg">
      <p class="name">Jonah Veit</p>
      <p class="grade">Sophomore</p>
      <p class="major">Computer Science</p>
    </v-card>

</template>

<style>

.userCard {
    display: flex;
    height: 20vh;
    width: 40vh;
    margin: 20px;
    border-radius: 25px;
    border-left: 10px #f00 solid;
}

.userImg {
    width: 33%;
    height: 50%;
    align-self: center;
}

.name {
    width: 66%;
    height: 33%;
    
}

</style>