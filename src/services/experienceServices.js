import apiClient from "./services.js";
export default {
  getAllExperiences(page, pageSize, searchQuery) {
    return apiClient.get("/experience", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  deleteExperience(experienceId) {
    return apiClient.delete(`/experience/${experienceId}`);
  },
};
