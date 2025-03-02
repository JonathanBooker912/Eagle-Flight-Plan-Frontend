<script setup>
    import { onMounted, ref } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { required, positiveNumber } from "../../../utils/formValidators";
    import rewardServices from "../../../services/rewardServices";

    const props = defineProps({
        isAdd: Boolean
    });
    const errorMessage = ref("");

    const form = ref(null);
    const formData = ref({});

    const route = useRoute();
    const router = useRouter();

    const handleCancel = () => {
        router.push({ name: "reward" });
    };

    const handleSubmit = async () => {
        const isValid = (await form.value?.validate())?.valid;
        if (!isValid) return;

        try {
            if (props.isAdd) {
                await rewardServices.createReward(formData.value);
            } else {
                await rewardServices.updateReward(
                    route.params.id,
                    formData.value
                );
            }
            router.push({ name: "reward" });
        } catch (error) {
            errorMessage.value =
                error.response.data.message ?? "An error occurred";
            console.error("Error saving task:", error);
        }
    };

    onMounted(async () => {
        if (!props.isAdd) {
            try {
                const response = await rewardServices.getReward(
                    route.params.id
                );
                formData.value = response.data;
            } catch (err) {
                errorMessage.value = err.response.data.message;
            }
        }
    });
</script>
<template>
    <v-alert closable v-if="errorMessage" type="error">
        {{ errorMessage }}
    </v-alert>
    <h1 class="text-center ma-5">
        {{ props.isAdd ? "Add Reward" : "Edit Reward" }}
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
                    <v-text-field
                        v-model="formData.points"
                        variant="solo"
                        rounded="lg"
                        label="Points"
                        :rules="[required, positiveNumber]"
                    ></v-text-field>
                </v-col>
                <v-col size="6">
                    <v-text-field
                        v-model="formData.redemptionType"
                        variant="solo"
                        rounded="lg"
                        label="Redemption Type"
                        :rules="[required]"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-text-field
                v-model="formData.redemptionInfo"
                variant="solo"
                rounded="lg"
                label="Redemption Info"
                :rules="[required]"
            ></v-text-field>
            <v-textarea
                v-model="formData.description"
                variant="solo"
                rounded="lg"
                label="Description"
                :rules="[required]"
            ></v-textarea>
            <v-file-input
                v-model="formData.image"
                variant="solo"
                rounded="lg"
                label="Image File"
            ></v-file-input>
            <v-row class="justify-center my-1">
                <v-btn
                    class="mr-2"
                    variant="outlined"
                    rounded="xl"
                    @click="handleCancel"
                    >Cancel</v-btn
                >
                <v-btn rounded="xl" color="primary" @click="handleSubmit"
                    >Submit</v-btn
                >
            </v-row>
        </v-container>
    </v-form>
</template>
