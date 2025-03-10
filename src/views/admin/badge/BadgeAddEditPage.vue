<script setup>
const props = defineProps({
  isAdd: Boolean,
  id: Number,
});
</script>
<template>
  <h1 v-if="props.isAdd">Add Badge Page!</h1>
  <h1 v-else>Edit Badge Page {{ props.id }}</h1>
</template>
