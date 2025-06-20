import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentMemberInfo,
  getMemberIdByUserId,
} from "../services/memberService";
import { useAuth } from "./AuthContext";
import Swal from "sweetalert2"; // Import SweetAlert2

const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
  const { currentUser, loading: authLoading, error: authError } = useAuth();
  const [memberData, setMemberData] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentMember = async () => {
      if (authLoading) return;
      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      if (!currentUser || !currentUser.id) {
        // Người dùng chưa đăng nhập, không hiển thị cảnh báo
        setMemberData(null);
        setMemberId(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const member = await getCurrentMemberInfo(currentUser.id);
        setMemberData(member);

        const id = await getMemberIdByUserId(currentUser.id);
        setMemberId(id);
      } catch (error) {
        // Chỉ hiển thị thông báo lỗi nếu người dùng đã đăng nhập
        setError("Không thể tải thông tin thành viên");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMember();
  }, [currentUser, authLoading, authError]);

  return (
    <MemberContext.Provider value={{ memberData, memberId, loading, error }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMember phải được sử dụng trong MemberProvider");
  }
  return context;
};

export const useMemberId = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error("useMemberId phải được sử dụng trong MemberProvider");
  }
  return context.memberId;
};

export default MemberProvider;
