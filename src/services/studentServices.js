import apiClient from "./services.js";
export default {
  getStudentForUserId(userId) {
    return apiClient.get(`/students/user/${userId}`);
  },
  getAllStudents() {
    return apiClient.get("/students");
  },
  // getAllStudentsForAdmin(page, pageSize, searchQuery) {
  //   return apiClient.get("/student/admin", {
  //     params: {
  //       page: page,
  //       pageSize: pageSize,
  //       searchQuery: searchQuery,
  //     },
  //   });
  // },
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
  },
};
