<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { studentApprovalDialogStore } from "../../stores/studentApprovalDialogStore";
import userServices from "../../services/userServices";
import submissionServices from "../../services/submissionServices";
import fileServices from "../../services/fileServices";
import notificationServices from "../../services/notificationServices";

const emit = defineEmits(["submit"]);
const dialogStore = studentApprovalDialogStore();
const { visible, flightPlanItem } = storeToRefs(dialogStore);

const type = ref("text");
const optionalReviewers = ref([{ label: "None", value: null }]);
const selectedOptionalReviewer = ref();
const reflectionText = ref("");
const files = ref();
const successMessage = ref(""); // Track success message
const errorMessage = ref("");

const handleTypeToggle = () => {
  type.value = type.value === "text" ? "file" : "text";
};

const fetchOptionalReviewers = async () => {
  try {
    const { data } = await userServices.getAllAdmins();
    optionalReviewers.value = [
      { label: "None", value: null },
      ...data.map((user) => ({
        label: user.fullName,
        value: user.id,
      })),
    ];
  } catch (error) {
    console.error("Error fetching reviewers:", error);
  }
};

const handleCancel = () => {
  files.value = null;
  reflectionText.value = "";
  dialogStore.toggleVisibility();
};

const handleSubmit = async () => {
  const submissionData = {
    flightPlanItemId: flightPlanItem.value.id,
    submissionType: type.value,
  };

  try {
    if (type.value === "text") {
      await submissionServices.createSubmission({
        ...submissionData,
        value: reflectionText.value,
      });
    } else {
      await Promise.all(
        files.value.map(async (file) => {
          const { data } = await fileServices.uploadFile(
            { file },
            "submissions",
          );
          return submissionServices.createSubmission({
            ...submissionData,
            value: data.fileName,
          });
        }),
      );
    }

    if (selectedOptionalReviewer.value) {
      await notificationServices.createNotification({
        header: "Flight plan item pending review",
        description: `The Flight Plan Item ${flightPlanItem.value.name} is pending review.`,
        read: false,
        userId: selectedOptionalReviewer.value,
        sentBy: 1, // Sent by the system
      });
    }

    successMessage.value = "Submission successful!";

    setTimeout(() => {
      successMessage.value = "";
      files.value = null;
      reflectionText.value = "";
      visible.value = false;
      emit("submit");
    }, 2000);
  } catch (error) {
    errorMessage.value = error.response.data.message;
  }
};

onMounted(fetchOptionalReviewers);

watch(visible, async (newValue) => {
  if (!newValue) {
    selectedOptionalReviewer.value = null;
    reflectionText.value = "";
    files.value = null;
    successMessage.value = "";
    errorMessage.value = "";
  }
});
</script>

<template>
  <v-dialog v-model="visible" transition="dialog-bottom-transition">
    <v-card rounded="xl" color="backgroundDarken">
      <v-card-title class="text-h4 d-flex justify-center align-center">
        <span class="flex-grow-1 text-center">
          {{ flightPlanItem.name }}
          <v-btn
            v-if="type === 'text'"
            icon="mdi-upload"
            variant="text"
            class="ml-2"
            @click="handleTypeToggle"
          ></v-btn>
          <v-btn
            v-else
            icon="mdi-file-document"
            variant="text"
            class="ml-2"
            @click="handleTypeToggle"
          ></v-btn>
        </span>
      </v-card-title>
      <v-card-text>
        <v-fade-transition mode="out-in">
          <div v-if="successMessage">
            <v-alert type="success" variant="tonal">{{
              successMessage
            }}</v-alert>
          </div>
          <div v-else>
            <v-textarea
              v-if="type === 'text'"
              v-model="reflectionText"
              label="Reflection"
              variant="solo"
              rounded="xl"
              bg-color="background"
            ></v-textarea>

            <v-file-upload
              v-if="type === 'file'"
              v-model="files"
              label="Upload Files"
              multiple
              rounded="xl"
              color="background"
            ></v-file-upload>

            <div class="d-flex justify-center mt-4">
              <p class="mr-2 mt-1">(Optional) Request Reviewer</p>
              <div class="w-25">
                <v-select
                  v-model="selectedOptionalReviewer"
                  density="compact"
                  variant="solo"
                  rounded="lg"
                  bg-color="background"
                  :items="optionalReviewers"
                  item-title="label"
                  item-value="value"
                ></v-select>
              </div>
            </div>
            <div v-if="errorMessage">
              <v-alert type="danger" variant="tonal">{{
                errorMessage
              }}</v-alert>
            </div>

            <div class="d-flex justify-center mt-4">
              <v-btn
                variant="outlined"
                rounded="xl"
                class="mr-5"
                @click="handleCancel"
                >Cancel</v-btn
              >
              <v-btn rounded="xl" color="primary" @click="handleSubmit"
                >Submit</v-btn
              >
            </div>
          </div>
        </v-fade-transition>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
