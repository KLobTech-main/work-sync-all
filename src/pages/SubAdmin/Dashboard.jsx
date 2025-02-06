import React, { useState, useEffect } from "react";
import { Button, Chip } from "@mui/material";
import axios from "axios";

const formatTime = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12; 
  hours = hours ? hours : 12; 
  minutes = minutes < 10 ? "0" + minutes : minutes; 
  return `${hours}:${minutes} ${period}`;
};

// ProgressBar Component
const ProgressBar = ({ label, value, max, color }) => {
  const progress = (value / max) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm">
          {formatTime(new Date(value))} / {formatTime(new Date(max))}
        </span>
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

// Dashboard Component
const Dashboard = ({ darkMode }) => {
  const [attendanceId, setAttendanceId] = useState(localStorage.getItem("id"));
  const [punchInTime, setPunchInTime] = useState(localStorage.getItem("punchInTime"));
  const [punchOutTime, setPunchOutTime] = useState(localStorage.getItem("punchOutTime"));
  const [teaStartTime, setTeaStartTime] = useState(localStorage.getItem("teaStartTime"));
  const [teaEndTime, setTeaEndTime] = useState(localStorage.getItem("teaEndTime"));
  const [lunchStartTime, setLunchStartTime] = useState(localStorage.getItem("lunchStartTime"));
  const [lunchEndTime, setLunchEndTime] = useState(localStorage.getItem("lunchEndTime"));

  const apiBaseUrl =
    "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/attendance";
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");
  
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
      console.log(timeKey)
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
  
  const handlePunchIn = () =>{
    localStorage.removeItem("punchOutTime");
    setPunchOutTime(null);
    callApi("/punch-in", "punchInTime", setPunchInTime);
  }
  const handlePunchOut = () => {
    callApi("", "punchOutTime", setPunchOutTime);
    
    localStorage.removeItem("punchInTime");
    localStorage.removeItem("id");
    localStorage.removeItem("punchOutTime");
    localStorage.removeItem("teaStartTime");
    localStorage.removeItem("teaEndTime");
    localStorage.removeItem("lunchStartTime");
    localStorage.removeItem("lunchEndTime");

    setPunchInTime(null);
    setPunchOutTime(null);
    setTeaStartTime(null);
    setTeaEndTime(null);
    setLunchStartTime(null);
    setLunchEndTime(null);
  };
  
  const handleTeaStart = () => callApi("/tea-start", "teaStartTime", setTeaStartTime);
  const handleTeaEnd = () => callApi("/tea-end", "teaEndTime", setTeaEndTime);
  const handleLunchStart = () => callApi("/lunch-start", "luchStartTime",setLunchStartTime); 
  const handleLunchEnd = () => callApi("/lunch-end", "luchEndTime",setLunchEndTime); 


  const [leaves, setLeaves] = useState(null);

  useEffect(() => {
    if (email && token) {
      axios
        .get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/users/get/user?email=${email}`,
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



  const scheduleTime = 234;
  const workedTime = 147.41;
  const shortageTime = 86.18;
  const overtime = 0;
  const totalTime = scheduleTime;

  const checkPunchInStatus = () => {
    if (!punchInTime) return null;

    const punchInDate = new Date(punchInTime);
    const punchInHour = punchInDate.getHours();
    const punchInMinute = punchInDate.getMinutes();

    const earlyTime = new Date().setHours(8, 30, 0, 0); 
    const lateTime = new Date().setHours(9, 30, 0, 0); 

    let status = "";
    let statusClass = "";
    let chipLabel = "";

    if (punchInDate > lateTime) {
      // Late
      const lateMinutes = Math.floor((punchInDate - lateTime) / 60000);
      const lateHours = Math.floor(lateMinutes / 60);
      const lateMins = lateMinutes % 60;
      status = `You are ${lateHours} hours and ${lateMins} minutes late!`;
      statusClass = "text-red-500";
      chipLabel = "Late";
    } else if (punchInDate < earlyTime) {
      // Early
      const earlyMinutes = Math.floor((earlyTime - punchInDate) / 60000);
      const earlyHours = Math.floor(earlyMinutes / 60);
      const earlyMins = earlyMinutes % 60;
      status = `You are ${earlyHours} hours and ${earlyMins} minutes early!`;
      statusClass = "text-blue-500";
      chipLabel = "Early";
    } else {
      // On Time
      status = "You are on time!";
      statusClass = "text-green-500";
      chipLabel = "On Time";
    }

    return (
      <div className=" ">
        <p className={`text-sm ${statusClass} mt-2`}>{status}</p>
        <Chip label={chipLabel} color={chipLabel === "Late" ? "error" : chipLabel === "Early" ? "primary" : "success"} className="mt-4 absolute top-0 right-4" />
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
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
              <div className="flex flex-col items-center gap-3">
                <Button variant="contained"  color="success" onClick={handlePunchIn}>
                  Punch In
                </Button>
                <div>{punchInTime ? formatTime(new Date(punchInTime)) : "00:00"}</div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Button variant="contained"  color="error" onClick={handlePunchOut}>
                  Punch Out
                </Button>
                <div>{punchOutTime ? formatTime(new Date(punchOutTime)) : "00:00"}</div>
              </div>
             
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
              <div
                className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
              >
                <h3 className="text-lg font-semibold">{leaves?.sickLeave || 0}</h3>
                <p className="text-sm font-medium">Available Sick Leave </p>
              </div>
              <div
                className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
              >
                <h3 className="text-lg font-semibold">{leaves?.paternity || 0}</h3>
                <p className="text-sm font-medium">Available Annual  Leave </p>
              </div>
              <div
                className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
              >
                <h3 className="text-lg font-semibold">{leaves?.casualLeave || 0}</h3>
                <p className="text-sm font-medium">Available Casual Leave </p>
              </div>
              <div
                className={`w-[48%] shadow rounded-lg p-6 flex flex-col ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}
              >
                <h3 className="text-lg font-semibold">{leaves?.optionalLeave || 0} </h3>
                <p className="text-sm font-medium">Available Optional Leave</p>
              </div>
          
          </div>
        </div>

        <div className={`w-[40%] shadow rounded-lg p-6 ${darkMode ? "bg-gray-800 text-white" : "bg-white"}`}>
          <h2 className="text-xl font-semibold border-b pb-2">Time Log</h2>
          <div className="mt-4">
            <ProgressBar label="Total Schedule Time" value={scheduleTime} max={totalTime} color="#4F46E5" />
            <ProgressBar label="Worked Time" value={workedTime} max={totalTime} color="#10B981" />
            <ProgressBar label="Shortage Time" value={shortageTime} max={totalTime} color="#F59E0B" />
            <ProgressBar label="Over Time" value={overtime} max={totalTime} color="#EF4444" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
