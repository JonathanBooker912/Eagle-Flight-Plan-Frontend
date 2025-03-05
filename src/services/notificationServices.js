import apiClient from "./services.js";

export default {
  getAllNotificationsForUser(id) {
    return apiClient.get(`/notification/user/${id}`);
  },
};
