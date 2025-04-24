import apiClient from "./services.js";

export default {
  getAllLinksForUser(id) {
    return apiClient.get(`/link/user/${id}`);
  },
  createLink(linkData) {
    return apiClient.post("/link", linkData);
  },
  updateLink(linkId, linkData) {
    return apiClient.put(`/link/${linkId}`, linkData);
  },
  deleteLink(linkId) {
    return apiClient.delete(`/link/${linkId}`);
  },
};
