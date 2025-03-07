<script setup>
    import { useRouter } from "vue-router";
    import CardHeader from "../../../components/CardHeader.vue";
    import UserCard from "../../../components/cards/UserCard.vue";
    import CardTable from "../../../components/CardTable.vue";
    import userServices from "../../../services/userServices";
    import { ref, watch } from "vue";

    const users = ref([]);
    const page = ref(1);
    const count = ref(0);
    const searchQuery = ref("");
    const studentPopup = ref(false);
    const popUpId = ref(null);

    const router = useRouter();

    const fetchUsers = async ({
        pageNumber = page.value,
        query = searchQuery.value
    }) => {
        const response = await userServices.getAllUserForAdmin(
            pageNumber,
            8,
            query
        );
        users.value = response.data.users;
        count.value = response.data.count;
    };

    const handleSearchChange = (input) => {
        searchQuery.value = input;
        page.value = 1; // Reset to first page on search change
    };

    const handleCardClick = (id, user, isAdmin) => {
        if (isAdmin) {
            router.push({
                name: "adminProfile",
                params: { id },
                query: { name: user.fullName }
            });
        } else {
            studentPopup.value = true;
            popUpId.value = id;
        }
    };

    const handleDialogClick = (optionNumber) => {
        optionNumber
            ? router.push({
                  name: "adminProfile",
                  params: { id: popUpId.value }
              })
            : router.push({
                  name: "adminStudentFlightPlan",
                  params: { id: popUpId.value }
              });
    };

    watch([page, searchQuery], fetchUsers, { immediate: true });
</script>
<template>
    <v-container>
        <CardHeader
            label="Users"
            :add-button="false"
            @changed="handleSearchChange"
        ></CardHeader>
        <v-row v-if="users.length === 0" class="justify-center">
            <v-col>
                <v-alert color="danger" class="text-center">
                    No results found
                </v-alert>
            </v-col>
        </v-row>
        <CardTable
            v-else
            :items="users"
            :per-row-lg="4"
            :per-row-md="3"
            :per-row-sm="2"
        >
            <template #item="{ item }">
                <UserCard
                    :key="item.id"
                    :user="item"
                    @card-pressed="handleCardClick"
                ></UserCard>
            </template>
        </CardTable>
        <v-pagination
            v-model="page"
            :length="count"
            :total-visible="$vuetify.display.smAndDown ? 3 : 5"
            class="m-2"
            @next="fetchUsers"
            @prev="fetchUsers"
            @update:model-value="fetchUsers"
        >
        </v-pagination>
    </v-container>
    <v-dialog v-model="studentPopup" width="50vw"
        ><v-card color="backgroundDarken rounded-lg">
            <v-card-text
                ><v-btn
                    block
                    variant="tonal"
                    class="ma-2"
                    @click="handleDialogClick(1)"
                    >Profile</v-btn
                ><v-btn
                    block
                    variant="tonal"
                    class="ma-2"
                    @click="handleDialogClick(0)"
                    >Flight Plan</v-btn
                ></v-card-text
            >
        </v-card>
    </v-dialog>
</template>
