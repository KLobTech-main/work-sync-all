import React, { useEffect, useState } from "react";
import axios from "axios";

const LeaveBalance = ({ darkMode }) => { // Destructure `darkMode` correctly
  const [leaves, setLeaves] = useState({});

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("jwtToken");
      const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

      if (!email || !token) {
        console.error("Email or token missing in localStorage");
        return;
      }

      try {
        const response = await axios.get(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        // Extract leaveTypeBalance for the current month
        const monthlyLeaves = response.data.monthlyLeaves?.[currentMonth]?.leaveTypeBalance || {};
        setLeaves(monthlyLeaves);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchLeaveBalance();
  }, []);

  const renderLeaveCards = () => {
    return (
      <div className="flex flex-wrap gap-6">
        <div
          className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h3 className="text-lg font-semibold">{leaves["Sick"] || 0}</h3>
          <p className="text-sm font-medium">Available Sick Leave</p>
        </div>
        <div
          className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h3 className="text-lg font-semibold">{leaves["Paternity"] || 0}</h3>
          <p className="text-sm font-medium">Available Paternity Leave</p>
        </div>
        <div
          className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h3 className="text-lg font-semibold">{leaves["Casual"] || 0}</h3>
          <p className="text-sm font-medium">Available Casual Leave</p>
        </div>
        <div
          className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h3 className="text-lg font-semibold">{leaves["Optional"] || 0}</h3>
          <p className="text-sm font-medium">Available Optional Leave</p>
        </div>
      </div>
    );
  };

  return renderLeaveCards();
};

export default LeaveBalance;
