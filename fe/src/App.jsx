import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import LibraryHome from "./pages/LibraryHomePage";
import BookListPage from "./pages/BookListPage";
import BookDetail from "./components/sections/BookDetail";
import ProfilePage from "./pages/ProfilePage";
import LoanPage from "./pages/LoanPage";
import RequireAuth from "./components/ui/RequireAuth";
import AppProviders from "./contexts/AppProviders";
import LoanHistory from "./pages/HistoryPage";
import ContactPage from "./pages/ContactPage";
const App = () => {
  return (
    <AppProviders>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LibraryHome />} />
            <Route path="/books" element={<BookListPage />} />
            <Route path="/books/:slug" element={<BookDetail />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/borrowed" element={<LoanPage />} />
              <Route path="/history" element={<LoanHistory />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AppProviders>
  );
};

export default App;
