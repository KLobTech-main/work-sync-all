import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Layout/EmployeeLayout/Sidebar.jsx";
import Navbar from "./components/Layout/EmployeeLayout/Navbar.jsx";
import AdminSidebar from "./components/Layout/AdminLayout/AdminSidebar.jsx"; // Import Admin Sidebar
import AdminNavbar from "./components/Layout/AdminLayout/AdminNavbar.jsx"; // Import Admin Navbar
import LoginForm from "./components/Forms/LoginForm";
import Dashboard from "./components/Layout/EmployeeLayout/Dashboard.jsx";
import RegisterForm from "./components/Forms/RegisterForm";
import JobDesk from "./pages/Employee/JobDesk";
import LeaveAllowance from "./pages/Employee/JobDesk/LeaveAllowance";
import Documents from "./pages/Employee/JobDesk/Documents";
import Assets from "./pages/Employee/JobDesk/Assets";
import SalaryOverview from "./pages/Employee/JobDesk/SalaryOverview";
import PayrunAndBadge from "./pages/Employee/JobDesk/PayrunAndBadge";
import PaySlip from "./pages/Employee/JobDesk/PaySlip";
import BankDetail from "./pages/Employee/JobDesk/BankDetail";
import Address from "./pages/Employee/JobDesk/Address";
import Emergency from "./pages/Employee/JobDesk/Emergency";
import LeaveRequest from "./pages/Employee/Leave/LeaveRequest.jsx";
import LeaveSummary from "./pages/Employee/Leave/LeaveSummary.jsx";
import AttendanceDailyLog from "./pages/Employee/Attendance/AttendanceDailyLog";
import AttendanceRequest from "./pages/Employee/Attendance/AttendanceRequest";
import AttendanceSummary from "./pages/Employee/Attendance/AttendanceSummary";
import Holidays from "./pages/Employee/Leave/Holidays";
import JobHistory from "./pages/Employee/JobDesk/JobHistory";
import Meetings from "./pages/Employee/Meetings";
import Tickets from "./pages/Employee/Tickets";
import Task from "./pages/Employee/Task";
import PrivateRoute from "./components/PrivateRoute";
import LeaveRequestCancel from "./pages/Employee/Leave/LeaveRequestCancel";
import Register from "./pages/Admin/Register.jsx";
import Login from "./pages/Admin/Login.jsx";
import EmployeeDetails from "./pages/Admin/EmployeeDetail.jsx";
import LeavePage from "./pages/Admin/EmployeeDetails/LeavePage.jsx";
import TaskPage from "./pages/Admin/EmployeeDetails/TaskPage.jsx";
import AttendancePage from "./pages/Admin/EmployeeDetails/AttendancePage.jsx";
import SubAdminDetails from "./pages/Admin/SubAdminDetail.jsx";
import SubAdminLeave from "./pages/Admin/SubAdminDetails/SubAdminLeave.jsx";
import SubAdminAttendance from "./pages/Admin/SubAdminDetails/SubAdminAttendance.jsx";
import Meeting from "./pages/Admin/Meeting.jsx";
import Ticket from "./pages/Admin/Ticket.jsx";
import AnnouncementForm from "./pages/Admin/AnnouncementForm.jsx";
import GeolocationPopup from "./components/GeolocationPopup.jsx"; // New Component

const allowedArea = {
  latitude: 26.8718,
  longitude: 75.7758,
  radius: 5000,
};

const App = () => {
  return (
    <Router>
      <Main />
    </Router>
  );
};

const Main = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isWithinArea, setIsWithinArea] = useState(true);
  const location = useLocation();

  const isAuthRoute = ["/login", "/register", "/admin/login", "/admin/register"].includes(location.pathname);

  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Geolocation API to check user's position
    const checkLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const distance = calculateDistance(
              latitude,
              longitude,
              allowedArea.latitude,
              allowedArea.longitude
            );
            setIsWithinArea(distance <= allowedArea.radius);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setIsWithinArea(false);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setIsWithinArea(false);
      }
    };

    checkLocation();
  }, []);

  // Haversine formula to calculate the distance between two lat/lon points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  if (!isWithinArea) {
    return <GeolocationPopup />;
  }

  const AdminPrivateRoute = ({ children }) => {
    const isAuthenticated = Boolean(localStorage.getItem("token")); // Use your authentication logic
    return isAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
    <div>
      {/* Render Admin Navbar for admin routes, otherwise render Employee Navbar */}
      {!isAuthRoute &&
        (isAdminRoute == true ? (
          <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        ) : (
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        ))}

      <div style={{ display: "flex" }}>
        {/* Render Admin Sidebar for admin routes, otherwise render Employee Sidebar */}
        {!isAuthRoute &&
          (isAdminRoute == true ? (
            <AdminSidebar />
          ) : (
            <Sidebar />
          ))}

        <div style={{ flexGrow: 1, padding: "1px" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/admin/employee-details"
              element={
                <AdminPrivateRoute>
                  <EmployeeDetails />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/employee/:id/leave"
              element={
                <AdminPrivateRoute>
                  <LeavePage />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/employee/:id/task"
              element={
                <AdminPrivateRoute>
                  <TaskPage />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/employee/:id/attendance"
              element={
                <AdminPrivateRoute>
                  <AttendancePage />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/subadmin-details"
              element={
                <AdminPrivateRoute>
                  <SubAdminDetails />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/subadmin/:id/leave"
              element={
                <AdminPrivateRoute>
                  <SubAdminLeave />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/subadmin/:email/attendance"
              element={
                <AdminPrivateRoute>
                  <SubAdminAttendance />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/meetings"
              element={
                <AdminPrivateRoute>
                  <Meeting />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <AdminPrivateRoute>
                  <Task />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <AdminPrivateRoute>
                  <Ticket />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/announcement"
              element={
                <AdminPrivateRoute>
                  <AnnouncementForm />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/leave-request"
              element={
                <AdminPrivateRoute>
                  <LeaveRequest />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard darkMode={darkMode} />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk"
              element={
                <PrivateRoute>
                  <JobDesk />
                </PrivateRoute>
              }
            />
            <Route
              path="/meeting"
              element={
                <PrivateRoute>
                  <Meetings darkMode={darkMode} />
                </PrivateRoute>
              }
            />
            <Route
              path="/ticket"
              element={
                <PrivateRoute>
                  <Tickets />
                </PrivateRoute>
              }
            />
            <Route
              path="/task"
              element={
                <PrivateRoute>
                  <Task />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/leave-allowance"
              element={
                <PrivateRoute>
                  <LeaveAllowance />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/document"
              element={
                <PrivateRoute>
                  <Documents />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/Assets"
              element={
                <PrivateRoute>
                  <Assets />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/jobhistory"
              element={
                <PrivateRoute>
                  <JobHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/salary-overview"
              element={
                <PrivateRoute>
                  <SalaryOverview />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/payrun-and-badge"
              element={
                <PrivateRoute>
                  <PayrunAndBadge />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/payslip"
              element={
                <PrivateRoute>
                  <PaySlip />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/bank-detail"
              element={
                <PrivateRoute>
                  <BankDetail />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/address"
              element={
                <PrivateRoute>
                  <Address />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobdesk/Emergency"
              element={
                <PrivateRoute>
                  <Emergency />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave/request"
              element={
                <PrivateRoute>
                  <LeaveRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave/leave-request-cancel"
              element={
                <PrivateRoute>
                  <LeaveRequestCancel />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave/summary"
              element={
                <PrivateRoute>
                  <LeaveSummary />
                </PrivateRoute>
              }
            />
            <Route
              path="/leave/holidays"
              element={
                <PrivateRoute>
                  <Holidays />
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance/daily-log"
              element={
                <PrivateRoute>
                  <AttendanceDailyLog />
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance/request"
              element={
                <PrivateRoute>
                  <AttendanceRequest />
                </PrivateRoute>
              }
            />
            <Route
              path="/attendance/summary"
              element={
                <PrivateRoute>
                  <AttendanceSummary />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;