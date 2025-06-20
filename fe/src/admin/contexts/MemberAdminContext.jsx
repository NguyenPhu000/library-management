import React, { createContext, useContext, useState, useCallback } from "react";
import adminMemberService from "../services/adminMemberService";
import Swal from "sweetalert2";

const MemberAdminContext = createContext();

export const useMemberAdmin = () => {
  const context = useContext(MemberAdminContext);
  if (!context) {
    throw new Error("useMemberAdmin must be used within a MemberAdminProvider");
  }
  return context;
};

export const MemberAdminProvider = ({ children }) => {
  // State management
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [itemsPerPage] = useState(10);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("username");

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Utility functions
  const resetError = () => setError(null);

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: "Thành công!",
      text: message,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#10B981",
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: "Lỗi!",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#EF4444",
    });
  };

  // Search functionality
  const getFilteredMembers = useCallback(() => {
    if (!searchTerm) return members;

    return members.filter((member) => {
      const searchValue = searchTerm.toLowerCase();

      switch (searchCriteria) {
        case "username":
          return member.user?.username?.toLowerCase().includes(searchValue);
        case "memberCode":
          return member.memberCode?.toLowerCase().includes(searchValue);
        case "email":
          return member.user?.email?.toLowerCase().includes(searchValue);
        case "phone":
          return member.user?.phone?.toLowerCase().includes(searchValue);
        case "status":
          return member.status?.toLowerCase().includes(searchValue);
        default:
          return (
            member.user?.username?.toLowerCase().includes(searchValue) ||
            member.memberCode?.toLowerCase().includes(searchValue) ||
            member.user?.email?.toLowerCase().includes(searchValue) ||
            member.user?.phone?.toLowerCase().includes(searchValue) ||
            member.status?.toLowerCase().includes(searchValue)
          );
      }
    });
  }, [members, searchTerm, searchCriteria]);

  // Pagination helpers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPrevPage = () => goToPage(currentPage - 1);

  const getDisplayedMembers = useCallback(() => {
    const filteredMembers = getFilteredMembers();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMembers.slice(startIndex, endIndex);
  }, [getFilteredMembers, currentPage, itemsPerPage]);

  // API operations với service mới
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    resetError();

    try {
      // Gọi service mới với params
      const response = await adminMemberService.getAllMembers({
        page: currentPage,
        limit: itemsPerPage,
      });

      // Response từ axios trả về response.data
      const result = response.data;

      if (result.success) {
        // Transform data từ backend
        const transformedMembers =
          result.members?.map((member) => ({
            id: member.member_id || member.id,
            memberId: member.member_id || member.id,
            userId: member.user_id,
            memberCode: member.member_code,
            joinDate: member.join_date,
            expiryDate: member.expiry_date,
            maxLoans: member.max_loans,
            currentLoans: member.current_loans,
            status: member.status,
            createdAt: member.created_at,
            updatedAt: member.updated_at,
            user: member.User
              ? {
                  userId: member.User.user_id,
                  username: member.User.username,
                  email: member.User.email,
                  firstName: member.User.first_name,
                  lastName: member.User.last_name,
                  phone: member.User.phone,
                  address: member.User.address,
                  gender: member.User.gender,
                  role: member.User.role,
                  isActive: member.User.is_active,
                }
              : null,
          })) || [];

        setMembers(transformedMembers);
        setTotalMembers(result.total || transformedMembers.length);

        // Update pagination
        const totalPages = Math.ceil(
          (result.total || transformedMembers.length) / itemsPerPage
        );
        setTotalPages(totalPages);
      } else {
        throw new Error(result.message || "Lỗi khi tải danh sách thành viên");
      }
    } catch (error) {
      console.error("❌ Error fetching members:", error);

      // Check for auth errors
      if (error.response?.status === 401) {
        const errorMessage =
          "🔐 Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!";
        setError(errorMessage);
        showErrorAlert(errorMessage);

        // Clear token and redirect
        localStorage.removeItem("auth_token");
        setTimeout(() => {
          window.location.href = "/login?admin=true";
        }, 3000);
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi tải danh sách thành viên";
      setError(errorMessage);
      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  // Sync members với service mới
  const syncMembers = useCallback(async () => {
    setLoading(true);
    resetError();

    try {
      const response = await adminMemberService.syncMembers();
      const result = response.data;

      if (result.success) {
        showSuccessAlert(result.message || "Đồng bộ thành viên thành công!");
        await fetchMembers(); // Refresh data
      } else {
        throw new Error(result.message || "Lỗi khi đồng bộ thành viên");
      }
    } catch (error) {
      console.error("❌ Error syncing members:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đồng bộ thành viên";
      setError(errorMessage);
      showErrorAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchMembers]);

  // Update member với service mới
  const updateMember = useCallback(
    async (memberData) => {
      setLoading(true);
      resetError();

      try {
        const response = await adminMemberService.updateMember(
          memberData.id,
          memberData
        );
        const result = response.data;

        if (result.success) {
          showSuccessAlert("Cập nhật thành viên thành công!");
          await fetchMembers(); // Refresh data
          closeEditModal();
        } else {
          throw new Error(result.message || "Lỗi khi cập nhật thành viên");
        }
      } catch (error) {
        console.error("❌ Error updating member:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi cập nhật thành viên";
        setError(errorMessage);
        showErrorAlert(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fetchMembers]
  );

  // Modal functions
  const openEditModal = (member) => {
    setSelectedMember(member);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedMember(null);
    setIsEditModalOpen(false);
  };

  // Search functions
  const handleSearch = (term, criteria) => {
    setSearchTerm(term);
    setSearchCriteria(criteria);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchCriteria("username");
    setCurrentPage(1);
  };

  // Context value
  const contextValue = {
    // Data
    members,
    allMembers: getFilteredMembers(),
    displayedMembers: getDisplayedMembers(),
    totalMembers,
    loading,
    error,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,

    // Search
    searchTerm,
    searchCriteria,
    handleSearch,
    clearSearch,

    // Modal
    isEditModalOpen,
    selectedMember,
    openEditModal,
    closeEditModal,

    // Actions
    fetchMembers,
    syncMembers,
    updateMember,
    resetError,
  };

  return (
    <MemberAdminContext.Provider value={contextValue}>
      {children}
    </MemberAdminContext.Provider>
  );
};
