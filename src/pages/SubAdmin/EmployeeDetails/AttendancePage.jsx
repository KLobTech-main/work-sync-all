import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
  TablePagination,
  Button,
} from "@mui/material";

// Utility function to format date (API vs Input format mismatch fixed)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // Matching with date input format (YYYY-MM-DD)
};

// Utility function to format time
const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const date = new Date(timeString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const AttendancePage = () => {
  const { state } = useLocation();
  const { employee } = state || {};

  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const adminEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");
      const employeeEmail = employee?.email;

      if (!adminEmail || !authToken || !employeeEmail) {
        setError("Missing admin email, authentication token, or employee email.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching attendance data...");
        console.log(`Employee Email: ${employeeEmail}`);
        console.log(`Admin Email: ${adminEmail}`);

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/attendance/${employeeEmail}?adminEmail=${adminEmail}`,
          { headers: { Authorization: authToken } }
        );

        console.log("API Response:", response.data); // Debugging

        if (Array.isArray(response.data)) {
          setAttendanceData(response.data);
        } else {
          setError("Unexpected API response format.");
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to fetch attendance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [employee]);

  // Filter attendance data based on selected date
  const filteredAttendance = attendanceData.filter((attendance) =>
    selectedDate ? formatDate(attendance.date) === selectedDate : true
  );

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setSelectedDate("");
    setPage(0);
  };

  if (!employee) {
    return (
      <Typography variant="h6" color="error" align="center">
        Employee not found
      </Typography>
    );
  }

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading attendance data...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div className="p-6" style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flexGrow: 1 }}>
        <div className="flex justify-between py-5">
          <Typography variant="h4" gutterBottom>
            {employee.name}&apos;s Attendance Details
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              label="Search by Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              variant="outlined"
              sx={{ width: "250px" }}
            />
            <Button variant="outlined" color="secondary" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </div>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Attendance ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Punch In</TableCell>
                  <TableCell>Punch Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No attendance records found for this employee.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((attendance, index) => (
                    <TableRow key={attendance.id || index + 1}>
                      <TableCell>{attendance.id || index + 1}</TableCell>
                      <TableCell>{attendance.name || "N/A"}</TableCell>
                      <TableCell>{formatDate(attendance.date)}</TableCell>
                      <TableCell>{attendance.punchInTime ? formatTime(attendance.punchInTime) : "N/A"}</TableCell>
                      <TableCell>{attendance.punchOutTime ? formatTime(attendance.punchOutTime) : "N/A"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredAttendance.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
