import apiClient from "./services.js";
export default {
  getAllUser() {
    return apiClient.get("/user");
  },
  getAllUserForAdmin(page, pageSize, searchQuery) {
    return apiClient.get("/user/admin", {
      params: {
        page: page,
        pageSize: pageSize,
        searchQuery: searchQuery,
      },
    });
  },
  getAllAdmins() {
    return apiClient.get("/user/admin/all");
  },
  getUserById(id) {
    return apiClient.get(`/user/${id}`);
  },
  deleteUser(id) {
    return apiClient.delete(`/user/${id}`);
  },
  createUser(item) {
    return apiClient.post(`/user`, item);
  },
  updateUser(item) {
    return apiClient.put(`/user/${item.id}`, item);
  },
  getUserByEmail(email) {
    return apiClient.get(`/user/email/${email}`);
  },
};
