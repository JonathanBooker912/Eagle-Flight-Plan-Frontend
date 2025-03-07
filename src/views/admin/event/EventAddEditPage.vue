<script setup>
const props = defineProps({
  isAdd: Boolean,
  id: Number,
});
</script>
<template>
  <h1 v-if="props.isAdd">Add Event Page!</h1>
  <h1 v-else>Edit Event Page {{ props.id }}</h1>
</template>
