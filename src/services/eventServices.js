import apiClient from "./services.js";
export default {
  getAllEvents(page, pageSize, searchQuery) {
    return apiClient.get("/event", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  deleteTask(taskId) {
    return apiClient.delete(`/event/${taskId}`);
  },
};
