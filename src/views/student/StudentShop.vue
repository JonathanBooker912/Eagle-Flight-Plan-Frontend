<script setup>
    import { ref, computed, watch } from "vue";
    import { useDisplay } from "vuetify";
    import CardTable from "../../components/CardTable.vue";
    import CardHeader from "../../components/CardHeader.vue";
    import rewardServices from "../../services/rewardServices";
    import RewardCard from "../../components/cards/RewardCard.vue";

    const rewards = ref([]);
    const totalPages = ref(0);
    const searchQuery = ref("");
    const page = ref(1);
    const display = useDisplay();
    const numCardColumns = computed(() => {
        if (display.xxl.value) return 4;
        if (display.xl.value) return 3;
        if (display.lg.value) return 3;
        if (display.md.value) return 2;
        if (display.sm.value) return 1;
        return 1; // Default for xs
    });
    const pageSize = computed(() => numCardColumns.value * 2);

    const fetchRewards = async () => {
        const response = await rewardServices.getAllRewards(
            page.value,
            pageSize.value,
            searchQuery.value
        );
        rewards.value = response.data.rewards;
        totalPages.value = response.data.count;
    };

    const handleSearch = async () => {
        await fetchRewards();
    };

    watch([page, searchQuery], () => fetchRewards(), { immediate: true });
</script>
<template>
    <v-container fluid>
        <CardHeader
            :label="'Shop'"
            :addButton="false"
            :filter-button="false"
            @changed="handleSearch"
        >
        </CardHeader>
        <CardTable :items="rewards" :totalPages="totalPages">
            <template #item="{ item }">
                <RewardCard :reward="item" />
            </template>
            <template #pagination>
                <v-pagination v-model="page" :length="totalPages" />
            </template>
        </CardTable>
    </v-container>
</template>
