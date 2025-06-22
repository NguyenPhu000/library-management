import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import LibraryHomePage from "./pages/LibraryHomePage";
import BookListPage from "./pages/BookListPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RequireAuth from "./components/ui/RequireAuth";
import LoanPage from "./pages/LoanPage";
import HistoryPage from "./pages/HistoryPage";
import PaymentPage from "./pages/PaymentPage";
import ContactPage from "./pages/ContactPage";
import AppProviders from "./contexts/AppProviders";
import BookDetail from "./components/sections/BookDetail";

// Admin pages
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import BookManagePage from "./admin/pages/BookManagePage";
import BookForm from "./admin/pages/BookForm";
import BookView from "./admin/pages/BookView";
import AdminPage from "./admin/pages/AdminPage";
import UserManagePage from "./admin/pages/UserManagePage";
import CategoryManagePage from "./admin/pages/CategoryManagePage";
import AdminRoute from "./admin/components/auth/AdminRoute";
import MemberManagePage from "./admin/pages/MemberManagePage";

function App() {
  return (
    <AppProviders>
      <Routes>
        {/* Main site routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<LibraryHomePage />} />
          <Route path="books" element={<BookListPage />} />
          <Route path="books/:slug" element={<BookDetail />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Protected routes */}
          {/* Protected routes need to be wrapped by a parent RequireAuth route */}
          <Route element={<RequireAuth />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="loans" element={<LoanPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="payments" element={<PaymentPage />} />
          </Route>
        </Route>

        {/* Chuyển hướng /admin/login sang /login với tham số admin=true */}
        <Route
          path="/admin/login"
          element={<Navigate to="/login?admin=true" replace />}
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<BookManagePage />} />
          <Route path="books/create" element={<BookForm />} />
          <Route path="books/edit/:id" element={<BookForm />} />
          <Route path="books/view/:id" element={<BookView />} />
          <Route path="members" element={<MemberManagePage />} />

          {/* Add other admin routes here */}
          <Route path="categories" element={<CategoryManagePage />} />
          <Route path="users" element={<UserManagePage />} />
          <Route path="loans" element={<div>Trang quản lý mượn sách</div>} />
          <Route
            path="payments"
            element={<div>Trang quản lý thanh toán</div>}
          />
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  );
}

export default App;
