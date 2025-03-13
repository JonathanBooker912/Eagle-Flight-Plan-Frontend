import apiClient from "./services.js";
export default {
  getAllTasks(page, pageSize, searchQuery, filters) {
    return apiClient.get("/task", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
        category: filters?.category,
        taskType: filters?.taskType,
        schedulingType: filters?.schedulingType,
        completionType: filters?.completionType,
        semestersFromGraduation: filters?.semestersFromGraduation,
        strengths: filters?.strengths,
        sortAttribute: filters?.sortAttribute,
        sortDirection: filters?.sortDirection,
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
