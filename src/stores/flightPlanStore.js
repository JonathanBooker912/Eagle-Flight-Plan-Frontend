import { defineStore } from "pinia";

export const useFlightPlanStore = defineStore("flightPlan", {
  state: () => ({
    activeFlightPlanItem: null,
  }),
  actions: {
    setActiveFlightPlanItem(item) {
      this.activeFlightPlanItem = item;
    },
    clearActiveFlightPlanItem() {
      this.activeFlightPlanItem = null;
    },
  },
});
