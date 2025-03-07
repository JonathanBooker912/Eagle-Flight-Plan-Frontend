<script setup>
    import { onMounted, ref } from "vue";
    import { useRoute } from "vue-router";
    import CardHeader from "../components/CardHeader.vue";
    import CardTable from "../components/CardTable.vue";
    import flightPlanServices from "../services/flightPlanServices";
    import flightPlanItemServices from "../services/flightPlanItemServices";
    import FlightPlanItemCard from "../components/cards/FlightPlanItemCard.vue";

    const props = defineProps({
        isAdmin: {
            type: Boolean,
            default: false
        }
    });

    const route = useRoute();
    const flightPlan = ref(null);
    const flightPlanItems = ref([]);
    const page = ref(1);
    const searchQuery = ref("");
    const count = ref(0);
    const progress = ref(0);

    const fetchFlightPlan = async () => {
        const response = await flightPlanServices.getFlightPlanForStudent(
            route.params.id
        );
        flightPlan.value = response.data[0];
    };

    const fetchFlightPlanAndItems = async () => {
        const response =
            await flightPlanItemServices.getAllFlightPlanItemsForFlightPlan(
                2,
                page.value,
                8,
                searchQuery.value
            );
        flightPlanItems.value = response.data.flightPlanItems;
        count.value = response.data.count;
    };

    const fetchFlightPlanProgress = async () => {
        const response =
            await flightPlanServices.getFlightPlanProgressForFlightPlan(
                flightPlan.value.id
            );
        progress.value = response.data.progress;
    };

    onMounted(async () => {
        await fetchFlightPlan();
        await Promise.all([
            fetchFlightPlanAndItems(),
            fetchFlightPlanProgress()
        ]);

        console.log(props.isAdmin);
    });
</script>
<template>
    <v-container fluid>
        <h1 class="text-center mt-2">
            {{ props.fullName || "No Name" }}
        </h1>
        <v-container>
            <v-progress-linear
                v-model="progress"
                color="primary"
                bg-color="backgroundLighten"
                height="20"
                rounded
            ></v-progress-linear>
        </v-container>
        <CardHeader :add-button="false"></CardHeader>
        <CardTable
            :items="flightPlanItems"
            :per-row-lg="4"
            :per-row-md="3"
            :per-row-sm="2"
        >
            <template #item="{ item }">
                <FlightPlanItemCard
                    :flight-plan-item="item"
                    :key="item.id"
                ></FlightPlanItemCard>
            </template>
        </CardTable>
        <v-pagination
            v-model="page"
            :length="count"
            :total-visible="$vuetify.display.smAndDown ? 3 : 5"
            class="m-2"
            @next="fetchFlightPlanAndItems"
            @prev="fetchFlightPlanAndItems"
            @update:model-value="fetchFlightPlanAndItems"
        >
        </v-pagination>
    </v-container>
</template>
