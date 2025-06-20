import api from "../../services/api";

class AdminMemberService {
  // Lấy danh sách tất cả thành viên với phân trang
  getAllMembers(params = {}) {
    return api.get("/api/admin/members", { params });
  }

  // Lấy thông tin chi tiết một thành viên
  getMemberById(id) {
    return api.get(`/api/admin/members/${id}`);
  }

  // Lấy các thành viên mới nhất
  getRecentMembers(limit = 5) {
    return api.get("/api/admin/members/recent", { params: { limit } });
  }

  // Cập nhật thông tin thành viên
  updateMember(id, memberData) {
    return api.put(`/api/admin/members/${id}`, memberData);
  }

  // Đồng bộ thành viên từ user
  syncMembers() {
    return api.post("/api/admin/members/sync");
  }

  // Thống kê thành viên
  getMemberStats() {
    return api.get("/api/admin/members/stats");
  }

  // Tìm kiếm thành viên
  searchMembers(query, page = 1, limit = 10) {
    return api.get("/api/admin/members/search", {
      params: {
        query,
        page,
        limit,
      },
    });
  }

  // Lấy danh sách các lượt mượn của thành viên
  getMemberLoans(memberId, params = {}) {
    return api.get(`/api/admin/members/${memberId}/loans`, { params });
  }

  // Thay đổi trạng thái thành viên
  changeMemberStatus(id, status) {
    return api.patch(`/api/admin/members/${id}/status`, { status });
  }

  // Gia hạn thành viên
  extendMembership(id, months) {
    return api.post(`/api/admin/members/${id}/extend`, { months });
  }

  // Lấy lịch sử thanh toán của thành viên
  getMemberPayments(memberId, params = {}) {
    return api.get(`/api/admin/members/${memberId}/payments`, { params });
  }
}

const adminMemberService = new AdminMemberService();
export default adminMemberService;
