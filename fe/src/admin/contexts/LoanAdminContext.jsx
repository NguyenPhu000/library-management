import React, { createContext, useContext, useState, useCallback } from "react";
import adminLoanService from "../services/adminLoanService";
import Swal from "sweetalert2";

const LoanAdminContext = createContext();

export const LoanAdminProvider = ({ children }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("member_code");
  const [statusFilter, setStatusFilter] = useState("all");
  const [renewalFilter, setRenewalFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [librarySettings, setLibrarySettings] = useState(null);
  const [backendStatistics, setBackendStatistics] = useState({
    total: 0,
    pendingRequests: 0,
    awaitingPickup: 0,
    active: 0,
    overdue: 0,
    pendingRenewal: 0,
    returned: 0,
    rejected: 0,
    overduePercentage: 0,
    completionRate: 0,
  });

  // Fetch statistics from backend API
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await adminLoanService.getLoanStatistics();
      if (response.success) {
        setBackendStatistics(response.statistics);
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  }, []);

  // =============================================================================
  // ENHANCED LOAN SYSTEM FUNCTIONS
  // =============================================================================

  // Load library settings/business rules - Using hardcoded values based on memory
  const loadLibrarySettings = useCallback(async () => {
    // Set default settings based on business rules from memory:
    // Tối đa 5 cuốn sách/thành viên, thời hạn mượn 10 ngày, phí phạt 2,000 VND/ngày trễ hạn,
    // tối đa 1 lần gia hạn, giữ chỗ đặt trước 3 ngày
    setLibrarySettings({
      maxBooksPerMember: 5,
      loanDurationDays: 10,
      finePerDay: 2000,
      maxRenewals: 1,
      reservationHoldDays: 3,
    });
  }, []);

  // Fetch all loans with enhanced filtering and pagination
  const fetchLoans = useCallback(
    async (page = 1, filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: page,
          limit: 20,
          status: statusFilter !== "all" ? statusFilter : undefined,
          overdue: filters.overdue,
          ...filters,
        };

        const response = await adminLoanService.getAllLoans(queryParams);

        if (response.success) {
          setLoans(response.loans || []);
          setCurrentPage(response.pagination?.currentPage || 1);
          setTotalPages(response.pagination?.totalPages || 1);
        } else {
          throw new Error(
            response.message || "Không thể tải danh sách mượn sách"
          );
        }
      } catch (err) {
        setError(err.message || "Không thể tải danh sách mượn sách");
        console.error("Error fetching loans:", err);
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, renewalFilter]
  );

  // Use backend statistics primarily, fallback to calculated statistics
  const statistics = {
    ...backendStatistics,
    // Add calculated fields if needed
    totalFines: Array.isArray(loans)
      ? loans.reduce(
          (sum, loan) => sum + (parseFloat(loan.fine_amount) || 0),
          0
        )
      : 0,
  };

  // Filter loans with enhanced search capabilities
  const filteredLoans = Array.isArray(loans)
    ? loans.filter((loan) => {
        // Search filter
        let matchesSearch = true;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          switch (searchCriteria) {
            case "member_code":
              matchesSearch = loan.Member?.member_code
                ?.toLowerCase()
                .includes(term);
              break;
            case "member_name":
              matchesSearch = loan.Member?.full_name
                ?.toLowerCase()
                .includes(term);
              break;
            case "book_title":
              matchesSearch = loan.Book?.title?.toLowerCase().includes(term);
              break;
            case "book_isbn":
              matchesSearch = loan.Book?.isbn?.toLowerCase().includes(term);
              break;
            case "loan_id":
              matchesSearch = loan.loan_id?.toString().includes(term);
              break;
            default:
              matchesSearch = true;
          }
        }

        // PICKUP CODE WORKFLOW status filter
        let matchesStatus = true;
        if (statusFilter !== "all") {
          switch (statusFilter) {
            case "requested":
              matchesStatus = loan.status === "requested"; // Legacy only
              break;
            case "pending_pickup":
              matchesStatus =
                loan.status === "pending_pickup" ||
                (loan.status === "" && loan.pickup_code); // NEW: Chờ nhận với pickup code
              break;
            case "borrowed":
              matchesStatus =
                loan.status === "borrowed" &&
                loan.due_date &&
                new Date(loan.due_date) >= new Date();
              break;
            case "overdue":
              matchesStatus =
                loan.status === "borrowed" &&
                loan.due_date &&
                new Date(loan.due_date) < new Date();
              break;
            case "returned":
              matchesStatus = loan.status === "returned";
              break;
            case "rejected":
              matchesStatus = loan.status === "rejected";
              break;
            // Legacy compatibility
            case "approved":
              matchesStatus = loan.status === "approved"; // Legacy only
              break;
            case "active":
              matchesStatus = loan.status === "borrowed"; // Chỉ borrowed
              break;
            default:
              matchesStatus = true;
          }
        }

        // Renewal filter
        let matchesRenewal = true;
        if (renewalFilter !== "all") {
          matchesRenewal = loan.renewal_status === renewalFilter;
        }

        return matchesSearch && matchesStatus && matchesRenewal;
      })
    : [];

  // PICKUP CODE WORKFLOW sorting - prioritize by status
  const sortedLoans = [...filteredLoans].sort((a, b) => {
    // Priority order: overdue > pending_pickup > borrowed > returned > others
    const getPriority = (loan) => {
      if (
        loan.status === "borrowed" &&
        loan.due_date &&
        new Date(loan.due_date) < new Date()
      )
        return 1; // Quá hạn
      if (
        loan.status === "pending_pickup" ||
        (loan.status === "" && loan.pickup_code)
      )
        return 2; // Chờ nhận
      if (loan.status === "borrowed") return 3; // Đang mượn
      if (loan.status === "returned") return 5; // Đã trả
      if (loan.renewal_status === "pending") return 1.5; // Chờ gia hạn (ưu tiên cao)
      return 4; // Khác
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;

    // Cùng priority thì sort theo ngày request/loan mới nhất
    const dateA = new Date(a.request_date || a.loan_date || a.created_at || 0);
    const dateB = new Date(b.request_date || b.loan_date || b.created_at || 0);
    return dateB - dateA;
  });

  // =============================================================================
  // ENHANCED ACTIONS - QUY TRÌNH 5 GIAI ĐOẠN
  // =============================================================================

  // Removed validateBorrowConditions as it's no longer needed in pickup code system

  // GIAI ĐOẠN 2: Duyệt yêu cầu mượn sách
  const approveRequest = async (
    loanId,
    adminId,
    approval = true,
    reason = ""
  ) => {
    try {
      setLoading(true);
      let result;

      if (approval) {
        result = await adminLoanService.approveLoanRequest(loanId, adminId);

        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Đã duyệt yêu cầu",
            html: `
              <p>Yêu cầu mượn sách đã được duyệt thành công.</p>
              <br>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p class="text-sm"><strong>📋 Quy trình tiếp theo:</strong></p>
                <p class="text-sm">• Member có 3 ngày để đến thư viện nhận sách</p>
                <p class="text-sm">• Khi member đến, admin cần xác nhận nhận sách</p>
                <p class="text-sm">• Thời hạn trả: 10 ngày kể từ khi nhận sách</p>
              </div>
            `,
            confirmButtonText: "Đã hiểu",
            confirmButtonColor: "#10B981",
          });
        }
      } else {
        result = await adminLoanService.rejectLoanRequest(
          loanId,
          adminId,
          reason
        );

        if (result.success) {
          Swal.fire({
            icon: "info",
            title: "Đã từ chối yêu cầu",
            text: `Yêu cầu mượn sách đã được từ chối. Lý do: ${reason}`,
            confirmButtonColor: "#3B82F6",
          });
        }
      }

      if (result.success) {
        await fetchLoans(); // Refresh data
        return result;
      } else {
        throw new Error(result.message || "Không thể xử lý yêu cầu");
      }
    } catch (err) {
      console.error("Error processing loan request:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể xử lý yêu cầu mượn sách",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // GIAI ĐOẠN 3: Xác nhận member đã nhận sách
  const confirmPickup = async (loanId, adminId) => {
    try {
      setLoading(true);

      const result = await adminLoanService.confirmBookPickup(loanId, adminId);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Xác nhận thành công",
          html: `
            <p>Đã xác nhận member nhận sách thành công.</p>
            <br>
            <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p class="text-sm"><strong>📚 Thông tin mượn:</strong></p>
              <p class="text-sm">• Hạn trả: ${
                result.data?.due_date
                  ? new Date(result.data.due_date).toLocaleDateString()
                  : "N/A"
              }</p>
              <p class="text-sm">• Cho phép gia hạn tối đa 1 lần</p>
              <p class="text-sm">• Phí phạt: 2,000 VND/ngày nếu trễ hạn</p>
            </div>
          `,
          confirmButtonText: "Đã hiểu",
          confirmButtonColor: "#10B981",
        });

        await fetchLoans(); // Refresh data
        return result;
      } else {
        throw new Error(result.message || "Không thể xác nhận nhận sách");
      }
    } catch (err) {
      console.error("Error confirming pickup:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể xác nhận nhận sách",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🆕 GIAI ĐOẠN 3: Xác nhận nhận sách với pickup code
  const confirmPickupWithCode = async (pickupCode) => {
    /* BẮT BUỘC thủ thư nhập lại mã để xác nhận */
    const { value: inputCode } = await Swal.fire({
      title: "Nhập mã nhận sách",
      text: "Vui lòng nhập mã (PICK-XXXX) để xác nhận giao sách",
      input: "text",
      inputPlaceholder: pickupCode || "PICK-XXXX",
      confirmButtonText: "Xác nhận",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Bạn phải nhập mã!";
        if (value.trim().toUpperCase() !== pickupCode.toUpperCase())
          return "Mã không khớp!";
      },
    });

    if (
      !inputCode ||
      inputCode.trim().toUpperCase() !== pickupCode.toUpperCase()
    ) {
      return { success: false, message: "Mã xác nhận không hợp lệ" };
    }

    try {
      setLoading(true);
      const adminId = 1; // TODO: lấy từ AuthContext

      const result = await adminLoanService.confirmPickupWithCode(
        pickupCode,
        adminId
      );

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Xác nhận thành công",
          html: `
            <p>Đã xác nhận member nhận sách thành công với mã <strong>${pickupCode}</strong></p>
            <br>
            <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <p class="text-sm"><strong>📚 Thông tin mượn:</strong></p>
              <p class="text-sm">• Thành viên: ${result.data?.member_code}</p>
              <p class="text-sm">• Sách: ${result.data?.book_title}</p>
              <p class="text-sm">• Hạn trả: ${
                result.data?.due_date
                  ? new Date(result.data.due_date).toLocaleDateString("vi-VN")
                  : "N/A"
              }</p>
              <p class="text-sm">• Phí phạt: 2,000 VND/ngày nếu trễ hạn</p>
            </div>
          `,
          confirmButtonText: "Đã hiểu",
          confirmButtonColor: "#10B981",
        });

        await fetchLoans(); // Refresh data
        return { success: true };
      }
      throw new Error(result.message || "Không thể xác nhận nhận sách với mã");
    } catch (err) {
      console.error("Error confirming pickup with code:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể xác nhận nhận sách với mã",
      });
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // GIAI ĐOẠN 5: Xác nhận trả sách
  const confirmReturn = async (
    loanId,
    pickupCode = "",
    adminId = 1,
    condition = "good"
  ) => {
    // Yêu cầu thủ thư nhập lại pickup_code để xác nhận đúng sách
    const { value: inputCode } = await Swal.fire({
      title: "Nhập mã nhận sách khi mượn",
      text: `Vui lòng nhập mã (PICK-XXXX) để xác nhận trả sách`,
      input: "text",
      inputPlaceholder: pickupCode || "PICK-XXXX",
      confirmButtonText: "Xác nhận",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Bạn phải nhập mã!";
        if (value.trim().toUpperCase() !== pickupCode.toUpperCase())
          return "Mã không khớp!";
      },
    });

    if (
      !inputCode ||
      inputCode.trim().toUpperCase() !== pickupCode.toUpperCase()
    ) {
      return { success: false, message: "Mã xác nhận không hợp lệ" };
    }

    try {
      setLoading(true);

      const result = await adminLoanService.confirmBookReturn(
        loanId,
        adminId,
        condition,
        pickupCode
      );

      if (result.success) {
        let message = "Đã xác nhận trả sách thành công.";

        if (result.data?.fine_amount > 0) {
          message += `\n\n💰 Phí phạt: ${result.data.fine_amount.toLocaleString()} VND`;
        }

        Swal.fire({
          icon: "success",
          title: "Xác nhận trả sách",
          text: message,
          confirmButtonColor: "#10B981",
        });

        await fetchLoans(); // Refresh data
        return result;
      } else {
        throw new Error(result.message || "Không thể xác nhận trả sách");
      }
    } catch (err) {
      console.error("Error confirming return:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể xác nhận trả sách",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // OTHER ENHANCED ACTIONS
  // =============================================================================

  // Create loan (Admin workflow)
  const createLoan = async (memberId, bookId) => {
    try {
      setLoading(true);

      // Validate conditions first
      const validation = await validateBorrowConditions(memberId, bookId);
      if (!validation.success) {
        throw new Error(validation.message);
      }

      const result = await adminLoanService.borrowBook(memberId, bookId);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Tạo phiếu mượn thành công",
          text: result.message || "Phiếu mượn đã được tạo thành công",
        });

        await fetchLoans(); // Refresh data
        return result;
      } else {
        throw new Error(result.message || "Không thể tạo phiếu mượn");
      }
    } catch (err) {
      console.error("Error creating loan:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể tạo phiếu mượn",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Return book (Admin confirms return with pickup code)
  const returnBook = async (
    loanId,
    pickupCode = "",
    condition = "good",
    adminId = 1
  ) => {
    try {
      // Nhập mã PICK-XXXX để xác nhận
      const { value: inputCode } = await Swal.fire({
        title: "Nhập mã nhận sách",
        text: "Vui lòng nhập mã PICK-XXXX để xác nhận trả sách",
        input: "text",
        inputPlaceholder: pickupCode || "PICK-XXXX",
        confirmButtonText: "Xác nhận",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) return "Bạn phải nhập mã!";
          if (value.trim().toUpperCase() !== pickupCode.toUpperCase())
            return "Mã không khớp!";
        },
      });

      if (!inputCode) return { success: false, message: "Huỷ" };

      setLoading(true);

      const result = await adminLoanService.confirmBookReturn(
        loanId,
        adminId,
        condition,
        pickupCode
      );

      if (result.success) {
        let message = "Đã xác nhận trả sách thành công.";
        if (result.data?.fine_amount > 0) {
          message += `\nPhí phạt: ${result.data.fine_amount.toLocaleString()} VND`;
        }
        Swal.fire({
          icon: "success",
          title: "Trả sách thành công",
          text: message,
        });
        await fetchLoans();
        return result;
      }
      throw new Error(result.message || "Không thể trả sách");
    } catch (err) {
      console.error("Error returning book:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể trả sách",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Approve renewal request
  const approveRenewal = async (loanId, adminId) => {
    try {
      setLoading(true);

      const result = await adminLoanService.approveRenewal(loanId, adminId);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Đã duyệt gia hạn",
          text: result.message || "Yêu cầu gia hạn đã được duyệt thành công",
        });

        await fetchLoans(); // Refresh data
        return result;
      } else {
        throw new Error(result.message || "Không thể duyệt gia hạn");
      }
    } catch (err) {
      console.error("Error approving renewal:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể duyệt gia hạn",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reject renewal request
  const rejectRenewal = async (loanId, adminId, reason = "") => {
    try {
      setLoading(true);

      const result = await adminLoanService.rejectRenewal(
        loanId,
        adminId,
        reason
      );

      if (result.success) {
        Swal.fire({
          icon: "info",
          title: "Đã từ chối gia hạn",
          text: `Yêu cầu gia hạn đã bị từ chối. ${
            reason ? `Lý do: ${reason}` : ""
          }`,
        });

        await fetchLoans(); // Refresh data
        return result;
      } else {
        throw new Error(result.message || "Không thể từ chối gia hạn");
      }
    } catch (err) {
      console.error("Error rejecting renewal:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Không thể từ chối gia hạn",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // =============================================================================
  // SEARCH AND FILTER FUNCTIONS
  // =============================================================================

  const handleSearch = useCallback((term, criteria) => {
    setSearchTerm(term);
    setSearchCriteria(criteria);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setSearchCriteria("member_code");
  }, []);

  const setFilters = useCallback((status, renewal) => {
    setStatusFilter(status);
    setRenewalFilter(renewal);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  // Pagination handlers
  const goToPage = useCallback(
    (page) => {
      setCurrentPage(page);
      fetchLoans(page);
    },
    [fetchLoans]
  );

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  const value = {
    // State
    loans: sortedLoans,
    loading,
    error,
    searchTerm,
    searchCriteria,
    statusFilter,
    renewalFilter,
    statistics,
    librarySettings,
    currentPage,
    totalPages,

    // Actions
    fetchLoans,
    fetchStatistics,
    loadLibrarySettings,
    createLoan,
    returnBook,
    approveRenewal,
    rejectRenewal,

    // ENHANCED ACTIONS - QUY TRÌNH 5 GIAI ĐOẠN
    approveRequest,
    confirmPickup,
    confirmPickupWithCode,
    confirmReturn,

    // Search & Filter
    handleSearch,
    clearSearch,
    setFilters,
    goToPage,
  };

  return (
    <LoanAdminContext.Provider value={value}>
      {children}
    </LoanAdminContext.Provider>
  );
};

export const useLoanAdmin = () => {
  const context = useContext(LoanAdminContext);
  if (!context) {
    throw new Error("useLoanAdmin must be used within a LoanAdminProvider");
  }
  return context;
};
