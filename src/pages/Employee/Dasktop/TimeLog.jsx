import React, { useEffect, useState } from "react";
import axios from "axios";

// Utility function to format time
const formatTime = (minutes) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
};

// Individual Progress Bar Component
const SingleProgressBar = ({ label, value, max, color }) => {
  const progress = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm">{formatTime(value)} / {formatTime(max)}</span>
      </div>
      <div className="w-full h-4 bg-gray-200 rounded-lg dark:bg-gray-700">
        <div
          className="h-full rounded-lg"
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
      </div>
    </div>
  );
};

// ProgressBar Component
const ProgressBar = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("jwtToken");
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // Months are zero-based

      try {
        const response = await axios.get(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/attendance/monthly/${email}/${currentYear}/${currentMonth}`,
          {
            headers: { Authorization: token },
          }
        );
        setAttendanceData(response.data.body);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
        setError("Failed to fetch attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const { totalWorkedHours, totalBreakMinutes, totalLateMinutes, totalOvertimeMinutes } =
    attendanceData || {};

  const totalTime = 8 * 60 * 30; // Example: Assuming 8 hours/day for 30 days = total minutes

  return (
    <div>
      <h2 className="text-xl font-semibold border-b pb-2">Time Log</h2>
      <div className="mt-4">
        <SingleProgressBar
          label="Total Worked Hours"
          value={totalWorkedHours * 60} // Convert hours to minutes
          max={totalTime}
          color="#10B981"
        />
        <SingleProgressBar
          label="Total Break Minutes"
          value={totalBreakMinutes}
          max={totalTime}
          color="#4F46E5"
        />
        <SingleProgressBar
          label="Total Late Minutes"
          value={totalLateMinutes}
          max={totalTime}
          color="#F59E0B"
        />
        <SingleProgressBar
          label="Total Overtime Minutes"
          value={totalOvertimeMinutes}
          max={totalTime}
          color="#EF4444"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
