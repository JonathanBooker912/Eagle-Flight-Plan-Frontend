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

  getExperience(experienceId) {
    return apiClient.get(`/experience/${experienceId}`);
  },
  getSchedulingTypes(){
    return apiClient.get("/experience/types/schedulingTypes");
  },
  getExperienceTypes(){
    return apiClient.get("/experience/types/experienceTypes");
  },
  // getFulfillingEvents(){
  //   return apiClient.get("/experience/types/fulfillingEvents");
  // },
  getCategories() {
    return apiClient.get("/experience/types/categories")
  },


  createExperience(experienceData) {
    return apiClient.post("/experience", experienceData);
  },
  updateExperience(experienceId, experienceData) {
    return apiClient.put(`/experience/${experienceId}`, experienceData);
  },
  deleteExperience(experienceId) {
    return apiClient.delete(`/experience/${experienceId}`);
  },
};
