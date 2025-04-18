<script setup>
    import { useRoute } from "vue-router";
    import { ref, onMounted } from "vue";
    import rewardServices from "../../../services/rewardServices";
    import CardHeader from "../../../components/CardHeader.vue";
    import CardTable from "../../../components/CardTable.vue";

    const rewards = ref([]);
    const route = useRoute();

    const fetchRewards = async () => {
        try {
            const response = await rewardServices.getAllRewards();
            rewards.value = response.data.rewards;
        } catch (error) {
            console.error("Error fetching rewards:", error);
        }
    };

    const handleRedeem = async (rewardId) => {
        console.log(rewardId);
    };

    onMounted(async () => {
        const studentId = route.params.studentId;
        await fetchRewards();
    });
</script>
<template>
    <CardHeader :title="`Redeem Reward`"></CardHeader>
    <CardTable :items="rewards">
        <template #item="{ item }">
            <RewardCard
                :key="item.id"
                :reward="item"
                :is-view="false"
                @shop="handleShop"
                @edit="handleEdit"
                @delete="handleDelete"
                @redeem="handleRedeem"
            ></RewardCard>
        </template>
    </CardTable>
</template>
