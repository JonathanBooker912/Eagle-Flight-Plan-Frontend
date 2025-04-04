import apiClient from "./services.js";
export default {
    getStudentForUserId(userId) {
        return apiClient.get(`/students/user/${userId}`);
    },
    getStudentForFlightPlanId(flightPlanId) {
        return apiClient.get(`/students/flightPlan/${flightPlanId}`);
    },
    addPoints(studentId, points) {
        return apiClient.put(`/students/${studentId}/points`, { points });
    },
    getAllStudents() {
        return apiClient.get("/students");
    },
    getStudentById(id) {
        return apiClient.get(`/students/${id}`);
    },
    deleteStudent(id) {
        return apiClient.delete(`/students/${id}`);
    },
    createStudent(item) {
        return apiClient.post(`/student`, item);
    },
    updateStudent(item) {
        return apiClient.put(`/students/${item.id}`, item);
    }
};
