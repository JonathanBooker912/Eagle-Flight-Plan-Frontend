import apiClient from "./services";
export default {
  getFlightPlanForStudent(studentId) {
    return apiClient.get(`/flightPlan/student/${studentId}`);
  },
  getFlightPlanProgressForFlightPlan(flightPlanId) {
    return apiClient.get(`/flightPlanItem/flightPlan/progress/${flightPlanId}`);
  },
};
