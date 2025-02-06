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
  Switch,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

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
          "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/leaves/allLeaves",
          {
            headers: {
              // "Content-Type": "application/json",
              Authorization: token,
            },
            params: { adminEmail },
          }
        );
        console.log(response);
        setLeaveData(response.data || []);
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
        leave.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!leaveTypeFilter || leave.leaveType === leaveTypeFilter)
  );

  // Paginate filtered data
  const currentPageData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle status toggle
  const handleStatusToggle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const adminEmail = localStorage.getItem("email");

      if (!token || !adminEmail) {
        throw new Error("Token or admin email is missing");
      }

      const updatedLeave = leaveData.find((leave) => leave.id === id);
      const newStatus =
        updatedLeave.status === "APPROVED" ? "Rejected" : "APPROVED";

      await axios.patch(
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin-sub/approve/leave",
        {
          adminEmail,
          leaveId: id,
          status: newStatus.toUpperCase(),
        },
        {
          headers: {
            accept: "*/*",
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
              <MenuItem value="Optional">Optional Leave</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

      {/* Table */}
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Leave Type</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Reason</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPageData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No leave requests found.
                  </TableCell>
                </TableRow>
              ) : (
                currentPageData.map((leave) => (
                  <TableRow key={leave.id}>
                    <TableCell>{leave.id}</TableCell>
                    <TableCell>{leave.name}</TableCell>
                    <TableCell>{leave.email}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{leave.status}</TableCell>
                    <TableCell>
                      <Switch
                        checked={leave.status === "APPROVED"}
                        onChange={() => {
                          if (leave.status !== "APPROVED") {
                            handleStatusToggle(leave.id);
                          }
                        }}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
      />
    </div>
  );
};

export default LeaveRequest;
