<script setup>
    import { computed } from "vue";

    const props = defineProps({
        flightPlanItem: {
            type: Object,
            required: true
        }
    });

    const color = computed(
        () =>
            ({
                Incomplete: "danger",
                Pending: "warning"
            })[props.flightPlanItem.status] || "primary"
    );

    const points = computed(() => {
        return {
            Task: props.flightPlanItem.task?.points,
            Experience: props.flightPlanItem.experience?.points
        }[props.flightPlanItem.flightPlanItemType];
    });
</script>
<template>
    <v-card color="backgroundDarken" class="cardContainer pa-0 ma-0">
        <v-container class="pa-2">
            <v-row no-gutters>
                <v-col cols="1">
                    <v-sheet
                        :color="color"
                        class="accentChip mr-2 h-100"
                    ></v-sheet>
                </v-col>

                <v-col cols="11">
                    <v-card-text class="text-no-wrap">
                        <v-tooltip bottom>
                            <!-- eslint-disable-next-line vue/no-template-shadow -->
                            <template v-slot:activator="{ props }">
                                <p
                                    v-bind="props"
                                    class="text-h6 mb-2 truncate-text"
                                >
                                    {{ flightPlanItem.name }}
                                </p>
                            </template>
                            <span>{{ flightPlanItem.name }}</span>
                        </v-tooltip>
                        <p>{{ flightPlanItem.flightPlanItemType }}</p>
                        <p>{{ flightPlanItem.status }}</p>
                        <p>Points: {{ points }}</p></v-card-text
                    >
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<style scoped>
    .cardContainer {
        border-radius: 25px;
    }
    .accentChip {
        border-radius: 20px 0px 0px 20px;
    }
    .truncate-text {
        white-space: nowrap; /* Prevents text from wrapping */
        overflow: hidden; /* Hides overflowing text */
        text-overflow: ellipsis; /* Adds '...' when text overflows */
        max-width: 80%; /* Adjust based on your layout */
        display: block; /* Ensures it works properly */
    }
</style>
