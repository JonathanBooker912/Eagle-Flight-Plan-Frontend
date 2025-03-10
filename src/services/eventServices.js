import apiClient from "./services.js";
export default {
  getAllEvents(page, pageSize, searchQuery, filters) {
    return apiClient.get("/event", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        location: filters?.location,
        strengths: filters?.strengths,
        sortAttribute: filters?.sortAttribute,
        sortDirection: filters?.sortDirection,
      },
    });
  },
  deleteTask(taskId) {
    return apiClient.delete(`/event/${taskId}`);
  },
};
