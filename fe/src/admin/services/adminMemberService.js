import { AdminAPI } from "../../services/api";

class AdminMemberService {
  // Lấy danh sách tất cả thành viên với phân trang
  getAllMembers(params = {}) {
    return AdminAPI.get("/members", { params });
  }

  // Lấy thông tin chi tiết một thành viên
  getMemberById(id) {
    return AdminAPI.get(`/members/${id}`);
  }

  // Lấy các thành viên mới nhất
  getRecentMembers(limit = 5) {
    return AdminAPI.get("/members/recent", { params: { limit } });
  }

  // Cập nhật thông tin thành viên
  updateMember(id, memberData) {
    return AdminAPI.put(`/members/${id}`, memberData);
  }

  // Đồng bộ thành viên từ user
  syncMembers() {
    return AdminAPI.post("/members/sync");
  }

  // Thống kê thành viên
  getMemberStats() {
    return AdminAPI.get("/members/stats");
  }

  // Tìm kiếm thành viên
  searchMembers(query, page = 1, limit = 10) {
    return AdminAPI.get("/members/search", {
      params: {
        query,
        page,
        limit,
      },
    });
  }

  // Lấy danh sách các lượt mượn của thành viên
  getMemberLoans(memberId, params = {}) {
    return AdminAPI.get(`/members/${memberId}/loans`, { params });
  }

  // Thay đổi trạng thái thành viên
  changeMemberStatus(id, status) {
    return AdminAPI.patch(`/members/${id}/status`, { status });
  }

  // Gia hạn thành viên
  extendMembership(id, months) {
    return AdminAPI.post(`/members/${id}/extend`, { months });
  }

  // Lấy lịch sử thanh toán của thành viên
  getMemberPayments(memberId, params = {}) {
    return AdminAPI.get(`/members/${memberId}/payments`, { params });
  }
}

const adminMemberService = new AdminMemberService();
export default adminMemberService;
