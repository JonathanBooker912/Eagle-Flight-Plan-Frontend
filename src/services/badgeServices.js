import apiClient from "./services.js";
export default {
  getAllTasks(page, pageSize, searchQuery) {
    return apiClient.get("/task", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  deleteTask(taskId) {
    return apiClient.delete(`/task/${taskId}`);
  },
};
