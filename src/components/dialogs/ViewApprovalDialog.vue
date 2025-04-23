<script setup>
    import { ref, watch } from "vue";
    import { adminApprovalDialogStore } from "../../stores/adminApprovalDialogStore";
    import { storeToRefs } from "pinia";
    import notificationServices from "../../services/notificationServices";
    import flightPlanItemServices from "../../services/flightPlanItemServices";
    import studentServices from "../../services/studentServices";
    import submissionServices from "../../services/submissionServices";
    import { VueFilesPreview } from "vue-files-preview";
    const emit = defineEmits(["reject", "approve"]);

    const dialogStore = adminApprovalDialogStore();
    const { visible, flightPlanItem } = storeToRefs(dialogStore);

    const student = ref(null);
    const showReject = ref(false);
    const rejectMessage = ref("");
    const rejectReason = ref("");
    const approveMessage = ref("");
    const submissions = ref([]);
    const selectedFileIndex = ref(0);
    const selectedFile = ref(null);

    const getStudentForFlightPlanId = async () => {
        const student = await studentServices.getStudentForFlightPlanId(
            flightPlanItem.value.flightPlanId
        );
        return student.data;
    };

    const getSubmissionsForFlightPlanItem = async () => {
        try {
            const response =
                await submissionServices.getSubmissionsForFlightPlanItem(
                    flightPlanItem.value.id
                );
            submissions.value = response.data.submissions;
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const handleReject = async () => {
        try {
            const student = await getStudentForFlightPlanId();

            await submissionServices.discardSubmissionForFlightPlanItem(
                flightPlanItem.value.id
            );

            await flightPlanItemServices.rejectFlightPlanItem(
                flightPlanItem.value.id
            );

            if (student?.user?.id) {
                await notificationServices.createNotification({
                    header: "Flight plan item rejected",
                    description: rejectReason.value ?? "No reason provided",
                    read: false,
                    userId: student.user.id,
                    sentBy: 1 // Sent by the system
                });
            }
            rejectMessage.value = "Flight plan item rejected";
            setTimeout(() => {
                rejectMessage.value = "";
                visible.value = false;
                emit("reject");
            }, 2000);
        } catch (error) {
            console.error("Error rejecting flight plan item:", error);
        }
    };

    const handleApprove = async () => {
        try {
            const student = await getStudentForFlightPlanId();

            await flightPlanItemServices.approveFlightPlanItem(
                flightPlanItem.value.id
            );

            if (student?.user?.id) {
                await notificationServices.createNotification({
                    header: "Flight plan item approved",
                    description: `${flightPlanItem.value.name} has been approved and you have received ${flightPlanItem.value.task.points} points`,
                    read: false,
                    userId: student.user.id,
                    sentBy: 1 // Sent by the system
                });
                await studentServices.updatePoints(
                    student.id,
                    flightPlanItem.value.task.points
                );
            }

            approveMessage.value = "Flight plan item approved";
            setTimeout(() => {
                approveMessage.value = "";
                visible.value = false;
                emit("approve");
            }, 2000);
        } catch (error) {
            console.error("Error approving flight plan item:", error);
        }
    };

    const getFile = () => {
        try {
            const { fileName, value } =
                submissions.value[selectedFileIndex.value];
            const file = new File([new Uint8Array(value.data.data)], fileName, {
                type: value.mimeType
            });

            selectedFile.value = file;
        } catch (error) {
            console.error("Error getting file:", error);
        }
    };

    watch(visible, async (newValue) => {
        if (!newValue) {
            showReject.value = false;
            student.value = null;
        } else {
            student.value = await getStudentForFlightPlanId();
            await getSubmissionsForFlightPlanItem();
            getFile();
        }
    });

    watch(selectedFileIndex, () => {
        getFile();
    });
</script>
<template>
    <v-dialog v-model="visible" transition="dialog-bottom-transition">
        <v-card v-if="!showReject" color="backgroundDarken rounded-lg">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="flex-grow-1 text-center"
                    >Approve: {{ flightPlanItem.name }} for
                    {{
                        student?.user
                            ? student.user.fName + " " + student.user.lName
                            : ""
                    }}</span
                >
                <v-icon class="cursor-pointer" @click="visible = false"
                    >mdi-close</v-icon
                >
            </v-card-title>
            <v-card-text height="100%">
                <v-fade-transition mode="out-in">
                    <div v-if="approveMessage">
                        <v-alert type="success" variant="tonal">{{
                            approveMessage
                        }}</v-alert>
                    </div>
                    <div v-else>
                        <v-row
                            v-if="
                                flightPlanItem?.submission?.length === 1 &&
                                flightPlanItem?.submission[0].submissionType ===
                                    'text'
                            "
                            class="pa-4 bg-background rounded-lg text-body-1 mb-3"
                            style="white-space: pre-wrap"
                        >
                            {{ flightPlanItem?.submission[0].value }}
                        </v-row>
                        <v-row
                            v-else-if="submissions.length > 0"
                            class="bg-background rounded-lg mb-1"
                        >
                            <v-col
                                :cols="12"
                                class="d-flex justify-center align-center"
                            >
                                <VueFilesPreview
                                    :file="selectedFile"
                                    style="max-height: 60vh"
                                ></VueFilesPreview>
                            </v-col>
                            <v-col
                                :cols="12"
                                class="d-flex justify-center align-center"
                            >
                                <v-btn
                                    class="rounded-xl mr-6"
                                    color="text"
                                    variant="outlined"
                                    :disabled="selectedFileIndex === 0"
                                    @click="selectedFileIndex--"
                                    >Prev</v-btn
                                >
                                <v-btn
                                    class="rounded-xl"
                                    color="text"
                                    variant="outlined"
                                    :disabled="
                                        selectedFileIndex ===
                                        submissions.length - 1
                                    "
                                    @click="selectedFileIndex++"
                                    >Next</v-btn
                                >
                            </v-col>
                        </v-row>

                        <v-row v-else class="bg-background rounded-lg mb-3">
                            <v-col cols="12">
                                <p class="text-subtitle-1 pa-2 text-center">
                                    No submission found
                                </p>
                            </v-col>
                        </v-row>
                        <v-row class="bg-background rounded-lg mb-1">
                            <v-col cols="12">
                                <p class="text-body-1">Description</p>
                            </v-col>
                            <v-col cols="12">
                                <p class="text-body-2 ml-3">
                                    {{
                                        flightPlanItem?.task?.description ||
                                        "No description"
                                    }}
                                </p>
                            </v-col>
                        </v-row>
                        <v-row class="bg-background rounded-lg mb-1">
                            <v-col cols="12">
                                <p class="text-body-1">Rationale</p>
                            </v-col>
                            <v-col cols="12">
                                <p class="text-body-2 ml-3">
                                    {{
                                        flightPlanItem?.task?.rationale ||
                                        "No rationale"
                                    }}
                                </p>
                            </v-col>
                        </v-row>
                    </div>
                </v-fade-transition>
            </v-card-text>
        </v-card>
        <v-card v-if="showReject" color="backgroundDarken rounded-lg">
            <v-card-title class="d-flex justify-space-between align-center">
                <span class="flex-grow-1 text-center"
                    >Reject: {{ flightPlanItem.name }}</span
                >
                <v-icon class="cursor-pointer" @click="visible = false"
                    >mdi-close</v-icon
                >
            </v-card-title>
            <v-card-text>
                <v-fade-transition mode="out-in">
                    <div v-if="rejectMessage">
                        <v-alert type="success" variant="tonal">{{
                            rejectMessage
                        }}</v-alert>
                    </div>
                    <div v-else>
                        <v-row
                            ><v-textarea
                                v-model="rejectReason"
                                label="Reject Reason (optional)"
                                bg-color="background"
                                variant="solo-filled"
                                rounded="lg"
                                class="mb-3"
                        /></v-row>

                        <v-row class="d-flex justify-center">
                            <v-btn
                                class="rounded-xl mr-3"
                                variant="outlined"
                                @click="showReject = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="rounded-xl"
                                color="danger"
                                @click="handleReject"
                                >Reject</v-btn
                            >
                        </v-row>
                    </div>
                </v-fade-transition>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
