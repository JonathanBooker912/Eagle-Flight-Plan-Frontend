import apiClient from "./services.js";
export default {
  getAllEvents(page, pageSize, searchQuery, filters) {
    return apiClient.get("/event", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        location: filters?.location,
        strengths: filters?.strengths,
        sortAttribute: filters?.sortAttribute,
        sortDirection: filters?.sortDirection,
      },
    });
  },

  getEvent(eventId) {
    return apiClient.get(`/event/${eventId}`);
  },
  deleteEvent(eventId) {
    return apiClient.delete(`/event/${eventId}`);
  },
  createEvent(eventData) {
    return apiClient.post("/event", eventData);
  },
  updateEvent(eventId, eventData) {
    return apiClient.put(`/event/${eventId}`, eventData);
  },

  getCompletionTypes() {
    return apiClient.get("/event/types/completionTypes");
  },

  getAttendanceTypes() {
    return apiClient.get("/event/types/attendanceTypes");
  },

  // getEventTypes() {
  //   return apiClient.get("/event/types/eventTypes");
  // },

  getRegistrationTypes() {
    return apiClient.get("/event/types/registrationTypes");
  },
  registerStudents(eventId, studentIds) {
    return apiClient.post(`/event/${eventId}/register`, { studentIds });
  },

  markAttendance(eventId, studentIds) { 
    console.log("Event ID:", eventId);
    console.log("Student IDs:", studentIds);
    
    return apiClient.post(`/event/${eventId}/attend`, { studentIds }); 
  },

  getRegisteredStudents(eventId) {
    return apiClient.get(`/event/${eventId}/registered-students`);
  },

  getAttendingStudents(eventId) {
    return apiClient.get(`/event/${eventId}/attending-students`);
  },

};
