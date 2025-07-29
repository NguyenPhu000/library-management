import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { BookProvider } from "./BookContext";
import { MemberProvider } from "./MemberContext";
import { LoanProvider } from "./LoanContext";
import { SearchBookProvider } from "./SearchBookContext";
import { UserProvider } from "./UserContext";
import { PaymentProvider } from "./PaymentContext";
import { ThemeProvider } from "./ThemeContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
};

export default AppProviders;
