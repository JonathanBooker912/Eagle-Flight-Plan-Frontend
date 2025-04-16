import apiClient from "./services.js";

export default {
  getAllNotificationsForUser(id, page = 1, pageSize = 10) {
    return apiClient.get(`/notification/user/${id}`, {
      params: { page, pageSize },
    });
  },
  createNotification(notificationData) {
    return apiClient.post("/notification", notificationData);
  },
  deleteNotification(id) {
    return apiClient.delete(`/notification/${id}`);
  },
};
