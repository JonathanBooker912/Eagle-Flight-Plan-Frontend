import apiClient from "./services.js";
export default {
  getAllRewards(page, pageSize, searchQuery) {
    return apiClient.get("/reward", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  deleteReward(rewardId) {
    return apiClient.delete(`/reward/${rewardId}`);
  },
};
