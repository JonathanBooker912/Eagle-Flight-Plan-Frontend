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
  getTask(taskId) {
    return apiClient.get(`/task/${taskId}`);
  },
  getCategories() {
    return apiClient.get("/task/types/categories");
  },
  getSchedulingTypes() {
    return apiClient.get("/task/types/schedulingTypes");
  },
  getTaskTypes() {
    return apiClient.get("/task/types/taskTypes");
  },
  getCompletionTypes() {
    return apiClient.get("/task/types/completionTypes");
  },
  createTask(taskData) {
    return apiClient.post("/task", taskData);
  },
  updateTask(taskId, taskData) {
    return apiClient.put(`/task/${taskId}`, taskData);
  },
  deleteTask(taskId) {
    return apiClient.delete(`/task/${taskId}`);
  },
};
