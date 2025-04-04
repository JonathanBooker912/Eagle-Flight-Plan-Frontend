<script setup>
    import CardHeader from "../../components/CardHeader.vue";
    import CardTable from "../../components/CardTable.vue";
    import flightPlanItemServices from "../../services/flightPlanItemServices";
    import FlightPlanItemApprovalCard from "../../components/cards/FlightPlanItemApprovalCard.vue";
    import ViewApprovalDialog from "../../components/dialogs/ViewApprovalDialog.vue";
    import { ref, onMounted } from "vue";
    import { adminApprovalDialogStore } from "../../stores/adminApprovalDialogStore";

    const dialogStore = adminApprovalDialogStore();

    const pendingApprovals = ref([]);
    const page = ref(1);
    const count = ref(1);

    const fetchPendingApprovals = async () => {
        try {
            const response = await flightPlanItemServices.getPendingApprovals();
            pendingApprovals.value = response.data.flightPlanItems;
            count.value = response.data.count;
            page.value = 1;
        } catch (error) {
            console.error("Error fetching pending approvals:", error);
            // You could add error handling here, like showing a notification
        }
    };

    const handleApprove = (flightPlanItem) => {
        dialogStore.setFlightPlanItem(flightPlanItem);
        dialogStore.toggleVisibility();
    };

    onMounted(() => {
        fetchPendingApprovals();
    });
</script>
<template>
    <v-container>
        <CardHeader label="Approvals" :add-button="false" />
        <CardTable
            :items="pendingApprovals"
            :per-row-lg="3"
            :per-row-md="2"
            :per-row-sm="2"
        >
            <template #item="{ item }">
                <FlightPlanItemApprovalCard
                    :flightPlanItem="item"
                    @approve="handleApprove(item)"
                />
            </template>
            <template #pagination>
                <v-pagination
                    v-model="page"
                    :length="count"
                    :total-visible="$vuetify.display.smAndDown ? 3 : 5"
                    class="mt-4"
                    @next="fetchPendingApprovals"
                    @prev="fetchPendingApprovals"
                    @update:model-value="fetchPendingApprovals"
                >
                </v-pagination>
            </template>
        </CardTable>
        <ViewApprovalDialog
            @approve="fetchPendingApprovals"
            @reject="fetchPendingApprovals"
        />
    </v-container>
</template>
