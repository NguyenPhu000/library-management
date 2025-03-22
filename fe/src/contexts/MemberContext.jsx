import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentMemberInfo,
  getMemberIdByUserId,
} from "../services/memberService";
import { useAuth } from "./AuthContext";

const MemberContext = createContext();

export const MemberProvider = ({ children }) => {
  const { user, loading: authLoading, error: authError } = useAuth();
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

      if (!user || !user.user_id) {
        setError(
          "Người dùng chưa được xác thực hoặc ID người dùng không tồn tại"
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const member = await getCurrentMemberInfo(user.user_id);
        setMemberData(member);

        const id = await getMemberIdByUserId(user.user_id);
        setMemberId(id);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin thành viên:", error);
        setError("Không thể tải thông tin thành viên");
        setMemberData(null);
        setMemberId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMember();
  }, [user, authLoading, authError]);

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
