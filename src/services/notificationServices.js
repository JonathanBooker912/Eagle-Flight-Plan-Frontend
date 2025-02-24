import apiClient from "./services.js";

export default {
  getAllNotificationsForUser() {
    return apiClient.get("/notification");
  },
};
