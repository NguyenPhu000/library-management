import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { BookProvider } from "./BookContext";
import { MemberProvider } from "./MemberContext";
import { LoanProvider } from "./LoanContext";
import { SearchBookProvider } from "./SearchBookContext";
import { UserProvider } from "./UserContext";
import { PaymentProvider } from "./PaymentContext";
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <MemberProvider>
          <LoanProvider>
            <SearchBookProvider>
              <CategoryProvider>
                <BookProvider>
                  <PaymentProvider>{children}</PaymentProvider>
                </BookProvider>
              </CategoryProvider>
            </SearchBookProvider>
          </LoanProvider>
        </MemberProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
