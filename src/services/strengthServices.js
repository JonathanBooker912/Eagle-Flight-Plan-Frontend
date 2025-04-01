import apiClient from "./services.js";
export default {
  getAllStrengths() {
    return apiClient.get("/strengths/");
  },
};
