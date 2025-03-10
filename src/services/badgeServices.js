import apiClient from "./services.js";
export default {
  getAllBadges(page, pageSize, searchQuery) {
    return apiClient.get("/badge", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  deleteBadge(badgeId) {
    return apiClient.delete(`/badge/${badgeId}`);
  },
};
