import { AdminAPI } from "../../services/api";

class AdminMemberService {
  constructor() {
    this.baseURL = "/members"; // AdminAPI đã có baseURL="/api/admin"
  }

  // Get all members with pagination and search
  async getAllMembers(params = {}) {
    try {
      console.log(
        "AdminMemberService: Calling getAllMembers with params:",
        params
      );

      const response = await AdminAPI.get(this.baseURL, { params });
      console.log("AdminMemberService: getAllMembers response:", response.data);

      return response.data;
    } catch (error) {
      console.error("AdminMemberService: Error in getAllMembers:", error);
      throw error;
    }
  }

  // Sync members from users
  async syncMembers() {
    try {
      console.log("AdminMemberService: Calling syncMembers");

      const response = await AdminAPI.post(`${this.baseURL}/sync`);
      console.log("AdminMemberService: syncMembers response:", response.data);

      return response.data;
    } catch (error) {
      console.error("AdminMemberService: Error in syncMembers:", error);
      throw error;
    }
  }

  // Update member
  async updateMember(memberData) {
    try {
      console.log(
        "AdminMemberService: Calling updateMember with data:",
        memberData
      );

      const response = await AdminAPI.post(
        `${this.baseURL}/update`,
        memberData
      );
      console.log("AdminMemberService: updateMember response:", response.data);

      return response.data;
    } catch (error) {
      console.error("AdminMemberService: Error in updateMember:", error);
      throw error;
    }
  }

  // Get member by user ID
  getMemberByUserId(userId) {
    console.log(
      "AdminMemberService: Calling getMemberByUserId with userId:",
      userId
    );
    return AdminAPI.get(`${this.baseURL}/${userId}`);
  }

  // Get member statistics
  async getMemberStats() {
    try {
      const response = await this.getAllMembers();
      const members = response.members || [];

      const stats = {
        total: members.length,
        active: members.filter((m) => m.status === "Active").length,
        inactive: members.filter((m) => m.status === "Inactive").length,
        expiringSoon: members.filter((m) => {
          if (!m.expiryDate) return false;
          const expiry = new Date(m.expiryDate);
          const today = new Date();
          const daysUntilExpiry = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
          );
          return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
        }).length,
      };

      return { success: true, stats };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Search members
  searchMembers(query, page = 1, limit = 10) {
    console.log("AdminMemberService: Calling searchMembers with query:", query);
    return AdminAPI.get(this.baseURL, {
      params: {
        search: query,
        page,
        limit,
      },
    });
  }

  // Lấy các thành viên mới nhất
  getRecentMembers(limit = 5) {
    return AdminAPI.get(`${this.baseURL}/recent`, { params: { limit } });
  }

  // Lấy danh sách các lượt mượn của thành viên
  getMemberLoans(memberId, params = {}) {
    return AdminAPI.get(`${this.baseURL}/${memberId}/loans`, { params });
  }

  // Thay đổi trạng thái thành viên
  changeMemberStatus(id, status) {
    return AdminAPI.patch(`${this.baseURL}/${id}/status`, { status });
  }

  // Gia hạn thành viên
  extendMembership(id, months) {
    return AdminAPI.post(`${this.baseURL}/${id}/extend`, { months });
  }

  // Lấy lịch sử thanh toán của thành viên
  getMemberPayments(memberId, params = {}) {
    return AdminAPI.get(`${this.baseURL}/${memberId}/payments`, { params });
  }
}

export default new AdminMemberService();
