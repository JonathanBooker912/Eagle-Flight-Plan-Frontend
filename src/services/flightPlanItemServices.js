import apiClient from "./services";
export default {
  getAllFlightPlanItemsForFlightPlan(
    flightPlanId,
    page,
    pageSize,
    searchQuery,
  ) {
    return apiClient.get(`/flightPlanItem/flightPlan/${flightPlanId}`, {
      params: {
        page,
        pageSize,
        searchQuery,
      },
    });
  },
};
