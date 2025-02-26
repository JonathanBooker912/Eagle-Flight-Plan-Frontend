<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { required, positiveNumber } from "../../../utils/formValidators";
import experienceServices from "../../../services/experienceServices";

const props = defineProps({ isAdd: Boolean });

const form = ref(null);
const formData = ref({});
const categories = ref([]);
const schedulingTypes = ref([]);
const experienceTypes = ref([]);
const completionTypes = ref([]);

const route = useRoute();
const router = useRouter();

const handleCancel = () => {
  router.push({ name: "experience" });
};

const handleSubmit = async () => {
  const isValid = (await form.value?.validate())?.valid;
  if (!isValid) return;

  try {
    if (props.isAdd) {
      await experienceServices.createExperience(formData.value);
    } else {
      await experienceServices.updateExperience(route.params.id, formData.value);
    }
    router.push({ name: "experience" });
  } catch (error) {
    console.error("Error saving experience:", error);
  }
};

onMounted(async () => {
  try {
    const [categoriesRes, schedulingRes, experienceTypesRes,  fulfillingEventsRes] =
      await Promise.all([
        experienceServices.getCategories(),
        experienceServices.getSchedulingTypes(),
        experienceServices.getExperienceTypes(),
        // experienceServices.getFulfillingEvents(),
      ]);

    categories.value = categoriesRes.data;
    schedulingTypes.value = schedulingRes.data;
    experienceTypes.value = experienceTypesRes.data;
    // getFulfillingEvents.value = getFulfillingEventsRes.data;

    if (!props.isAdd) {
      formData.value = (await experienceServices.getExperience(route.params.id)).data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>
<template>
  <h1 class="text-center ma-5">
    {{ props.isAdd ? "Add Experience" : "Edit Experience" }}
  </h1>
  <v-form ref="form" @submit.prevent>
    <v-container class="bg-backgroundDarken rounded-t-xl">
      <v-text-field
        v-model="formData.name"
        variant="solo"
        rounded="lg"
        label="Name"
        :rules="[required]"
      ></v-text-field>
      <v-row no-gutters>
        <v-col size="6" class="mr-4">
          <v-select
            v-model="formData.schedulingType"
            variant="solo"
            rounded="lg"
            label="Scheduling Type"
            :items="schedulingTypes"
            :rules="[required]"
          ></v-select>
        </v-col>
        <v-col size="6">
          <v-select
            v-model="formData.experienceType"
            variant="solo"
            rounded="lg"
            label="Type"
            :items="experienceTypes"
            :rules="[required]"
          ></v-select>
        </v-col>
      </v-row>
      <v-text-field
        v-model="formData.rationale"
        variant="solo"
        rounded="lg"
        label="Rationale"
        :rules="[required]"
      ></v-text-field>
      <v-select
        v-model="formData.category"
        variant="solo"
        rounded="lg"
        label="Category"
        :items="categories"
        :rules="[required]"
      ></v-select>
      <v-select
        v-model="formData.fulfillingEvents"
        variant="solo"
        rounded="lg"
        label="Fulfilling Events"
        :items="fulfillingEvents"
      ></v-select>
      <v-textarea
        v-model="formData.description"
        variant="solo"
        rounded="lg"
        label="Description"
        :rules="[required]"
      ></v-textarea>
      <v-switch
        v-model="formData.reflectionRequired"
        label="Reflection Required"
      ></v-switch>
      <v-row class="justify-center mb-1">
        <v-btn
          class="mr-2"
          variant="outlined"
          rounded="xl"
          @click="handleCancel"
          >Cancel</v-btn
        >
        <v-btn rounded="xl" color="primary" @click="handleSubmit">Submit</v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>
