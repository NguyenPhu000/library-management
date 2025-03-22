import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { BookProvider } from "./BookContext";
import { MemberProvider } from "./MemberContext";
import { LoanProvider } from "./LoanContext";
import { SearchBookProvider } from "./SearchBookContext";
import { UserProvider } from "./UserContext";
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <MemberProvider>
          <SearchBookProvider>
            <CategoryProvider>
              <BookProvider>
                <LoanProvider>{children}</LoanProvider>
              </BookProvider>
            </CategoryProvider>
          </SearchBookProvider>
        </MemberProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
