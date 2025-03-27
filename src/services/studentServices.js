import apiClient from "./services.js";
export default {
  getStudentForUserId(userId) {
    return apiClient.get(`/students/user/${userId}`);
  },
};
