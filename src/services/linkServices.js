import apiClient from "./services.js";
export default {
  getLinksForUser(id) {
    return apiClient.get("/strengths/");
  },
};
