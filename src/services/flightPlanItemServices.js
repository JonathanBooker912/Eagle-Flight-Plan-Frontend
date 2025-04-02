import apiClient from "./services";
export default {
  getAllFlightPlanItemsForFlightPlan(
    flightPlanId,
    page,
    pageSize,
    searchQuery,
    filters,
  ) {
    return apiClient.get(`/flightPlanItem/flightPlan/${flightPlanId}`, {
      params: {
        page,
        pageSize,
        searchQuery,
        status: filters?.status,
        flightPlanItemType: filters?.flightPlanItemType,
        sortAttribute: filters?.sortAttribute,
        sortDirection: filters?.sortDirection,
      },
    });
  },
  getFlightPlanItemTypes() {
    return apiClient.get("/flightPlanItem/types");
  },
  getFlightPlanItemStatuses() {
    return apiClient.get("/flightPlanItem/statuses");
  },
  updateFlightPlanItem(flightPlanItem) {
    return apiClient.put(
      `/flightPlanItem/${flightPlanItem.id}`,
      flightPlanItem,
    );
  },
};
