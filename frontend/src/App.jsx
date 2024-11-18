import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import './App.css';

// User side imports
import Navbar from "./layouts/Navbar";
import Home from "./components/Home";
import Menu from "./components/Accounts";
import AccountPage from "./components/AccountPage";
import About from "./components/About";
import Footer from "./layouts/Footer";
import Profile from "./components/Profile";
import Paraphrase from "./components/users/Paraphrase"; // Update this path to match the correct location
import ViewAccDetails from "./components/users/ViewAccDetails";

// Admin side imports
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

import { Toaster } from "react-hot-toast";

// User Layout component
const UserLayout = ({ children }) => (
  <div>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

// Admin Layout component
const AdminLayout = ({ children }) => (
  <div className="flex h-screen overflow-hidden">
    {/* Sidebar */}
    <Sidebar />
    {/* Main Content */}
    <div className="flex-grow overflow-auto">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ECF9FF] via-[#ECF9FF] to-[#ECF9FF] opacity-80" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      {children}
    </div>
  </div>
);

// ProtectedRoute Component for admin routes
const ProtectedRoute = ({ children, role }) => {
  const userRole = sessionStorage.getItem("role");

  // Redirect if role does not match
  if (!userRole || userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* User Side Routes */}
        <Route
          path="/"
          element={
            <UserLayout>
              <Home />
            </UserLayout>
          }
        />
        <Route
          path="/menu"
          element={
            <UserLayout>
              <Menu />
            </UserLayout>
          }
        />
        <Route
          path="/about"
          element={
            <UserLayout>
              <About />
            </UserLayout>
          }
        />
        <Route
          path="/accountpage"
          element={
            <UserLayout>
              <AccountPage />
            </UserLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <UserLayout>
              <Profile />
            </UserLayout>
          }
        />
        <Route
          path="/paraphrase"
          element={
            <UserLayout>
              <Paraphrase />
            </UserLayout>
          }
        />
        <Route
          path="/view-acc-details/:id"
          element={
            <UserLayout>
              <ViewAccDetails />
            </UserLayout>
          }
        />

        {/* Admin Side Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <OverviewPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <UsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AnalyticsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <SettingsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
