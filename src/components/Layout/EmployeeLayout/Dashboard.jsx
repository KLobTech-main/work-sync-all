import React, { useState, useEffect } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import TimeLog from "../../../pages/Employee/Dasktop/TimeLog";
import LeaveDesktop from "../../../Pages/Employee/Dasktop/LeaveDesktop";

const Dashboard = ({ darkMode }) => {
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");
  const name = localStorage.getItem("userName") || "User";

  const [punchInTime, setPunchInTime] = useState(localStorage.getItem("punchInTime") || null);
  const [punchOutTime, setPunchOutTime] = useState(localStorage.getItem("punchOutTime") || null);
  const [id, setId] = useState(localStorage.getItem("attendanceId") || null);
  const [loading, setLoading] = useState(false);

  // Snackbar (Popup) State
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Get current IST time in ISO format
  const getCurrentISTTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 19);
  };

  // Format Date Function (hh:mm:ss AM/PM dd-mm-yyyy)
  const formatDateTime = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${ampm} ${day}-${month}-${year}`;
  };

  // Fetch attendance status
  const fetchAttendanceStatus = async () => {
    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/attendance/status?email=${encodeURIComponent(email)}`,
        { headers: { Authorization: token } }
      );

      if (response.data.status === "success") {
        const { punchInTime, id } = response.data.data;
        setPunchInTime(punchInTime);
        setId(id);
        localStorage.setItem("punchInTime", punchInTime);
        localStorage.setItem("attendanceId", id);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setPunchInTime(null);
          setPunchOutTime(null);
          setId(null);
          localStorage.removeItem("punchInTime");
          localStorage.removeItem("punchOutTime");
          localStorage.removeItem("attendanceId");
        } else if (error.response.status === 401) {
          showSnackbar("Session expired. Please log in again.", "error");
          handleLogout();
        } else {
          console.error("Error fetching attendance status:", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchAttendanceStatus();
  }, [email, token]);

  // Show Snackbar (Popup)
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Logout function (when token expires)
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // Redirect to login page
  };

  // Handle Punch In with Confirmation
  const handlePunchIn = async () => {
    if (!window.confirm("Are you sure you want to Punch In?")) return;

    setLoading(true);
    const punchInTime = getCurrentISTTime();

    try {
      const response = await axios.post(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/attendance/punch-in`,
        null,
        {
          headers: { Authorization: token },
          params: { punchInTime, email },
        }
      );

      if (response.status === 200) {
        showSnackbar("Punch In successful!", "success");

        setPunchInTime(punchInTime);
        localStorage.setItem("punchInTime", punchInTime);

        // Clear previous Punch Out time
        setPunchOutTime(null);
        localStorage.removeItem("punchOutTime");

        fetchAttendanceStatus();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        showSnackbar("Session expired. Please log in again.", "error");
        handleLogout();
      } else {
        console.error("Punch In failed:", error);
        showSnackbar("Failed to Punch In. Please try again.", "error");
      }
    }

    setLoading(false);
  };

  // Handle Punch Out with Confirmation
  const handlePunchOut = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to Punch Out?")) return;

    setLoading(true);
    const punchOutTime = getCurrentISTTime();

    try {
      await axios.post(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/attendance`,
        null,
        {
          headers: { Authorization: token },
          params: { punchOutTime, email, name, id },
        }
      );

      showSnackbar("Punch Out successful!", "success");

      setPunchOutTime(punchOutTime);
      localStorage.setItem("punchOutTime", punchOutTime);

      fetchAttendanceStatus();
    } catch (error) {
      if (error.response?.status === 401) {
        showSnackbar("Session expired. Please log in again.", "error");
        handleLogout();
      } else {
        console.error("Punch Out failed:", error);
        showSnackbar("Failed to Punch Out. Please try again.", "error");
      }
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="flex gap-6">
        <div className="w-[91%] space-y-6">
          <div className={`shadow rounded-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h2 className="text-xl font-semibold">Hi, {name}</h2>

            {/* Display Formatted Punch In and Punch Out Times */}
            <div className="mt-4">
              {punchInTime && <p><strong>Punch In Time:</strong> {formatDateTime(punchInTime)}</p>}
              {punchOutTime && <p><strong>Punch Out Time:</strong> {formatDateTime(punchOutTime)}</p>}
            </div>

            <div className="flex items-center mt-4 space-x-3">
              <Button variant="contained" color="primary" onClick={handlePunchIn} disabled={!!punchInTime || loading}>
                Punch In
              </Button>
              <Button variant="contained" color="secondary" onClick={handlePunchOut} disabled={!punchInTime || loading}>
                Punch Out
              </Button>
            </div>
          </div>
          <LeaveDesktop />
        </div>
        <div className={`w-[40%] shadow rounded-lg p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <TimeLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
