<template>
  <div class="error-page">
    <h1>404</h1>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <router-link to="/" class="home-link">Go Back Home</router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.error-page {
  text-align: center;
  margin: 50px auto;
  font-family: Arial, sans-serif;
  color: #444;
}

h1 {
  font-size: 5rem;
  color: #ff6b6b;
  margin: 20px 0;
}

p {
  font-size: 1.5rem;
  margin: 10px 0;
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #0056b3;
}
</style>
