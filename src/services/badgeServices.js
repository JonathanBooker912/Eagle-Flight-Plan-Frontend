import apiClient from "./services.js";
import axios from "axios";
import { getAuthHeader, jsonToFormData, getBaseURL } from "./serviceUtils.js";
export default {
  getAllBadges(page, pageSize, searchQuery) {
    return apiClient.get("/badge", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  deleteBadge(badgeId) {
    return apiClient.delete(`/badge/${badgeId}`);
  },
  getBadge(badgeId) {
    return apiClient.get(`/badge/${badgeId}`);
  },
  createBadge(badgeData) {
    return apiClient.post("/badge", badgeData);
  },
  uploadBadgeImage(badgeData) {
    const authHeader = getAuthHeader();
    const formData = jsonToFormData(badgeData);
    const baseURL = getBaseURL();
    console.log(badgeData);
    console.log(formData);

    return axios.post(`${baseURL}/badge/upload`, formData, {
      headers: { Authorization: authHeader },
    });
  },
  deleteBadgeImage(fileName) {
    return apiClient.delete(`/badge/image/${fileName}`);
  },
  getBadgeImage(fileName) {
    return apiClient.get(`/badge/image/${fileName}`);
  },
  updateBadge(badgeId, badgeData) {
    return apiClient.put(`/badge/${badgeId}`, badgeData);
  },

  getBadgesForStudent(studentId, page = 1, pageSize = 6) {
    return apiClient.get(`/badge/student/${studentId}`, {
      params: {
        page,
        pageSize,
      },
    });
  },
};
