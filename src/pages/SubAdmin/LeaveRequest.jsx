import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  Box,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const [nameFilter, setNameFilter] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");

  // Fetch leave data from API
  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const token = localStorage.getItem("token");
        const adminEmail = localStorage.getItem("email");

        if (!token || !adminEmail) {
          throw new Error("Token or admin email is missing");
        }

        const response = await axios.get(
          "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/all-leaves",
          {
            headers: { Authorization: token },
            params: { adminEmail: adminEmail },
          }
        );

        if (!response.data || !Array.isArray(response.data.data)) {
          throw new Error("Invalid API response format");
        }

        setLeaveData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filter data based on name and leave type
  const filteredData = leaveData.filter(
    (leave) =>
      (!nameFilter ||
        leave.name?.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!leaveTypeFilter ||
        leave.leaveType?.toLowerCase() === leaveTypeFilter.toLowerCase())
  );

  // Paginate filtered data
  const currentPageData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle leave status change via dropdown
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const adminEmail = localStorage.getItem("email");

      if (!token || !adminEmail) {
        throw new Error("Token or admin email is missing");
      }

      await axios.patch(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/approve/leave",
        {
          subAdminEmail:adminEmail,
          leaveId: id,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      setLeaveData((prevData) =>
        prevData.map((leave) =>
          leave.id === id ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" gutterBottom>
          Leave Requests
        </Typography>

        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <TextField
            label="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            variant="outlined"
            sx={{ width: "250px" }}
          />
          <FormControl variant="outlined" sx={{ width: "250px" }}>
            <InputLabel>Filter by Leave Type</InputLabel>
            <Select
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              label="Filter by Leave Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Sick">Sick Leave</MenuItem>
              <MenuItem value="Paternity">Paternity Leave</MenuItem>
              <MenuItem value="Casual">Casual Leave</MenuItem>
              <MenuItem value="Annual Leave">Annual Leave</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      {/* Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.length > 0 ? (
                currentPageData.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.name}</TableCell>
                    <TableCell>{leave.email}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={leave.status}
                          onChange={(e) =>
                            handleStatusChange(leave.id, e.target.value)
                          }
                        >
                          <MenuItem value="PENDING">Pending</MenuItem>
                          <MenuItem value="APPROVED">Approved</MenuItem>
                          <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No leave records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </div>
  );
};

export default LeaveRequest;
