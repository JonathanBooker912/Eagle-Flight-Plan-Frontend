<script setup>
import { ref } from "vue";

const isAdmin = ref(false);

const props = defineProps({
  strength: {
    type: Object,
    required: true,
  },
});


</script>

<template>
  <v-card color="backgroundDarken">
    <v-row align="center">
      <v-typography class="mr-3">
        {{ props.strength.number }}
      </v-typography>
      <v-typography class="mr-3">
        {{ props.strength.name }}
      </v-typography>
      <v-typography class="mr-3">
        {{ props.strength.domain }}
      </v-typography>
    </v-row>
  </v-card>
</template>
