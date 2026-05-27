// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageEmployee from "./components/ManageEmployee";
import AppNavbar from "./components/Navbar";
import HolidayManager from "./components/HolidayManager";
import Apprasial from "./components/Apprasial";
import HRDashboard from "./components/hrDashboard";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import LoginPage from "./components/loginPage";

// Recruitment
import Recruitment from "./components/recruitment1";
import InterviewForm from "./components/InterViewFrom";
import Onboarding from "./components/onboarding";

// Home
import Home from "./pages/Home";
import ResignationForm from "./components/ResignationFrom";
// Employee Pages
import EmployeeForm from "./pages/employee/EmployeeForm";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeLeaveForm from "./pages/employee/EmployeeLeave";
import MyAttendance from "./pages/employee/MyAttendance";
import PayrollManagement from "./pages/employee/Payroll";


// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeavesPage from "./pages/admin/LeavesPage";
import AdminAttendance from "./pages/admin/AdminAttendance";

// ✅ ProtectedRoute — token না থাকলে /loginPage এ পাঠাবে
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/loginPage" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <ToastContainer position="top-right" theme="colored" />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loginPage" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/leaves" element={<LeavesPage />} />

        {/* ✅ Employee Dashboard — Protected, token না থাকলে loginPage এ যাবে */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        {/* Other Employee Routes */}
        <Route path="/employee/create" element={<EmployeeForm />} />
        <Route path="/employee/leave" element={<EmployeeLeaveForm />} />
        <Route path="/attendance" element={<MyAttendance />} />
        <Route path="/payroll" element={<PayrollManagement />} />

        {/* Other Features */}
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/holidaymanager" element={<HolidayManager />} />
        <Route path="/appraisal" element={<Apprasial />} />
        <Route path="/interview" element={<InterviewForm />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/manage-employee" element={<ManageEmployee />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/resignation" element={<ResignationForm />} />
      
        {/* 404 Page */}
        <Route
          path="*"
          element={<h2 className="text-center mt-4">Page Not Found</h2>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;