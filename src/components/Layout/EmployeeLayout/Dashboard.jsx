import React, { useState, useEffect } from "react";
import { Button, Chip } from "@mui/material";
import axios from "axios";
import TimeLog from "../../../pages/Employee/Dasktop/TimeLog";
import LeaveDesktop from "../../../pages/Employee/Dasktop/LeaveDesktop";

const formatTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutes} ${period}`;
};

const Dashboard = ({ darkMode }) => {
  const [attendanceId, setAttendanceId] = useState(localStorage.getItem("id"));
  const [punchInTime, setPunchInTime] = useState(localStorage.getItem("punchInTime"));
  const [punchOutTime, setPunchOutTime] = useState(localStorage.getItem("punchOutTime"));
  const [teaStartTime, setTeaStartTime] = useState(localStorage.getItem("teaStartTime"));
  const [teaEndTime, setTeaEndTime] = useState(localStorage.getItem("teaEndTime"));
  const [lunchStartTime, setLunchStartTime] = useState(localStorage.getItem("lunchStartTime"));
  const [lunchEndTime, setLunchEndTime] = useState(localStorage.getItem("lunchEndTime"));

  const userData = localStorage.getItem("attendanceStatus");
  console.log(userData);

  const parsedData = userData ? JSON.parse(userData) : null;
  console.log(parsedData ? parsedData.data.punchInTime : "No punchInTime available");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");
  useEffect(() => {
    const checkAttendanceStatus = async () => {
      try {
        const response = await axios.get(

          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/attendance/status?email=${email}`,
          {
            headers: { Authorization: token },
          }
        );

        if (response.status === 200) {
          const attendanceStatus = response.data;
          localStorage.setItem("attendanceStatus", JSON.stringify(response.data));
          setPunchInDisabled(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setPunchInDisabled(false);
        } else {
          console.error("Error checking attendance status:", error);
        }
      }
    };

    if (email && token) {
      checkAttendanceStatus();
    }
  }, [email, token]);

  const [punchInDisabled, setPunchInDisabled] = useState(false);

  const apiBaseUrl =
    "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/attendance";

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user ? user.name : "User";

  const callApi = async (endpoint, timeKey, setTime) => {
    try {
      const time = new Date().toISOString().slice(0, 19);
      const url = `${apiBaseUrl}${endpoint}`;
      const params = {
        [timeKey]: time,
        email,
        ...(attendanceId ? { id: attendanceId } : {}),
      };

      const response = await axios.post(url, null, {
        headers: {
          Authorization: token,
        },
        params,
      });

      if (response.data.id) {
        localStorage.setItem("id", response.data.id);
        setAttendanceId(response.data.id);
      }

      setTime(time);
      localStorage.setItem(timeKey, time);
    } catch (error) {
      console.error("Error calling API:", error.message);
    }
  };

  const handlePunchIn = () => {
    localStorage.removeItem("punchOutTime");
    setPunchOutTime(null);
    callApi("/punch-in", "punchInTime", setPunchInTime);
  };

  const handlePunchOut = () => {
    callApi("", "punchOutTime", setPunchOutTime);

    localStorage.clear();
    setPunchInTime(null);
    setPunchOutTime(null);
    setTeaStartTime(null);
    setTeaEndTime(null);
    setLunchStartTime(null);
    setLunchEndTime(null);
  };
  

  const handleTeaStart = () => callApi("/tea-start", "teaStartTime", setTeaStartTime);
  const handleTeaEnd = () => callApi("/tea-end", "teaEndTime", setTeaEndTime);
  
  const handleLunchStart = () => callApi("/lunch-start", "lunchStartTime", setLunchStartTime);
  const handleLunchEnd = () => callApi("/lunch-end", "lunchEndTime", setLunchEndTime);

  const [leaves, setLeaves] = useState(null);

  useEffect(() => {
    if (email && token) {
      axios
        .get(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`,
          {
            headers: { Authorization: token },
          }
        )
        .then((response) => {
          setLeaves(response.data.allLeaves);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [email, token]);

  const checkPunchInStatus = () => {
    if (!punchInTime) return null;

    const punchInDate = new Date(punchInTime);
    const earlyTime = new Date().setHours(8, 30, 0, 0);
    const lateTime = new Date().setHours(9, 30, 0, 0);

    let status = "";
    let statusClass = "";
    let chipLabel = "";

    if (punchInDate > lateTime) {
      status = "You are late!";
      statusClass = "text-red-500";
      chipLabel = "Late";
    } else if (punchInDate < earlyTime) {
      status = "You are early!";
      statusClass = "text-blue-500";
      chipLabel = "Early";
    } else {
      status = "You are on time!";
      statusClass = "text-green-500";
      chipLabel = "On Time";
    }

    return (
      <div>
        <p className={`text-sm ${statusClass} mt-2`}>{status}</p>
        <Chip
          label={chipLabel}
          color={chipLabel === "Late" ? "error" : chipLabel === "Early" ? "primary" : "success"}
          className="mt-4"
        />
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="flex gap-6">
        <div className="w-[91%] space-y-6">
          <div
            className={`relative shadow rounded-lg p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <h2 className="text-xl font-semibold">Hi, {userName}</h2>

            {checkPunchInStatus()}

            <div className="flex items-center mt-4 space-x-3">
              <div className='flex flex-col justify-center items-center'>
                <Button variant="contained" color="success" onClick={handlePunchIn}>
                  Punch In
                </Button>
                <p className="text-sm mt-2">
                
                  {punchInTime ? formatTime(new Date(parsedData.data.punchInTime)) : "00:00 AM"}
                </p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Button variant="contained" color="error" onClick={handlePunchOut}>
                  Punch Out
                </Button>

                <p className="text-sm mt-2">
                  {punchOutTime ? formatTime(new Date(parsedData.data.punchOutTime)) : "00:00 AM"}
                </p>

              </div>
              <div className='flex flex-col justify-center items-center'>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#FFA500" }}
                  onClick={handleTeaStart}
                >
                  Tea Break Start
                </Button>

                <p className="text-sm mt-2">
                  {teaStartTime ? formatTime(new Date(parsedData.data.teaStartTime)) : "00:00 AM"}
                </p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#FFA500" }}
                  onClick={handleTeaEnd}
                >
                  Tea Break End
                </Button>
                <p className="text-sm mt-2">
                  {teaEndTime ? formatTime(new Date(parsedData.data.teaEndTime)) : "00:00 AM"}
                </p>
              </div>
              <div className='flex flex-col justify-center items-center'>

                <Button
                  variant="contained"
                  style={{ backgroundColor: "#1E40AF" }}
                  onClick={handleLunchStart}
                >
                  Lunch Break Start
                </Button>
                <p className="text-sm mt-2">
                  {lunchStartTime ? formatTime(new Date(parsedData.data.lunchStartTime)) : "00:00 AM"}
                </p>
              </div>
              <div className='flex flex-col justify-center items-center'>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#1E40AF" }}
                  onClick={handleLunchEnd}
                >
                  Lunch Break End
                </Button>
                <p className="text-sm mt-2">
                  {lunchEndTime ? formatTime(new Date(parsedData.data.lunchEndTime)) : "00:00 AM"}
                </p>
              </div>
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
