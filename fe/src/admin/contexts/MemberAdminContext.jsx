import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import adminMemberService from "../services/adminMemberService";
import Swal from "sweetalert2";

const MemberAdminContext = createContext();

export const useMemberAdmin = () => {
  const context = useContext(MemberAdminContext);
  if (!context) {
    throw new Error("useMemberAdmin must be used within MemberAdminProvider");
  }
  return context;
};

export const MemberAdminProvider = ({ children }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const itemsPerPage = 10;

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch members function with useCallback
  const fetchMembers = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminMemberService.getAllMembers({
        page,
        limit: itemsPerPage,
        search,
      });

      if (response.success) {
        // Transform data to match frontend expectations
        const transformedMembers = response.members.map((member) => ({
          id: member.member_id,
          memberCode: member.member_code,
          joinDate: member.join_date,
          expiryDate: member.expiry_date,
          maxLoans: member.max_loans,
          currentLoans: member.current_loans,
          status: member.status,
          user: member.User
            ? {
                id: member.User.user_id,
                username: member.User.username,
                email: member.User.email,
                firstName: member.User.first_name,
                lastName: member.User.last_name,
                phone: member.User.phone,
              }
            : null,
        }));

        // Force state update with new array reference
        setMembers([...transformedMembers]);
        setTotalMembers(response.total || 0);
        setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
        setCurrentPage(page);
      } else {
        setError(response.message || "Lỗi không xác định");
        setMembers([]);
      }
    } catch (error) {
      setError(error.message || "Lỗi kết nối");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchMembers(1, "");
  }, [fetchMembers]);

  // Search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        fetchMembers(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchMembers]);

  // Sync members from users
  const syncMembers = async () => {
    try {
      setLoading(true);
      const response = await adminMemberService.syncMembers();

      if (response.success) {
        // Refresh the members list after sync
        await fetchMembers(currentPage, searchTerm);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || "Lỗi đồng bộ thành viên";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update member - match với backend expectation
  const updateMember = async (memberData) => {
    try {
      setLoading(true);

      const response = await adminMemberService.updateMember(memberData);

      if (response.success) {
        // Refresh the members list after update
        await fetchMembers(currentPage, searchTerm);
        setIsEditModalOpen(false);
        setEditingMember(null);
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || "Lỗi cập nhật thành viên";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const openEditModal = (member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMember(null);
    setError(null);
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchMembers(page, searchTerm);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // Search handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchMembers(1, "");
  };

  // Clear error
  const clearError = () => setError(null);

  const value = {
    // Data
    members,
    loading,
    error,
    totalMembers,

    // Pagination
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,

    // Search
    searchTerm,
    handleSearch,
    clearSearch,

    // Modals
    isEditModalOpen,
    editingMember,
    openEditModal,
    closeEditModal,

    // Operations
    fetchMembers,
    syncMembers,
    updateMember,

    // Utilities
    clearError,
  };

  return (
    <MemberAdminContext.Provider value={value}>
      {children}
    </MemberAdminContext.Provider>
  );
};

export default MemberAdminContext;
