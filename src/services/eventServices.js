import apiClient from "./services.js";

export default {
  getAllEventsForUser() {
    return apiClient.get("/events");
  },
};
