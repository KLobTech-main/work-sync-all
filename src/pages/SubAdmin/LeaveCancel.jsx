import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  TablePagination,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";

const LeaveCancel = () => {
  const [search, setSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("All"); // ✅ Leave Type Dropdown
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noRequests, setNoRequests] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10); // ✅ Show 10 records per page

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const adminEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        if (!adminEmail || !token) {
          console.error("Admin email or token is missing");
          return;
        }

        const apiUrl = `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/leaves/all-leaves-cancel-request?adminEmail=${encodeURIComponent(adminEmail)}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 204) {
          setNoRequests(true);
          setLeaves([]);
        } else if (response.ok) {
          const data = await response.json();
          setLeaves(data);
          setNoRequests(false);
        } else {
          console.error("Failed to fetch leave requests");
        }
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  // ✅ Handle Leave Status Change
  const handleStatusChange = (leaveId, newStatus) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave.id === leaveId ? { ...leave, status: newStatus } : leave
      )
    );

    setSnackbar({ open: true, message: `Leave ${newStatus}!`, severity: "success" });
  };

  // ✅ Filter Leave Requests Based on Search and Leave Type
  const filteredLeaves = leaves.filter(({ name, email, leaveType }) =>
    `${name}`.toLowerCase().includes(search.toLowerCase()) &&
    email.toLowerCase().includes(emailSearch.toLowerCase()) &&
    (leaveTypeFilter === "All" || leaveType === leaveTypeFilter)
  );

  // ✅ Pagination - Get data for current page
  const paginatedLeaves = filteredLeaves.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex flex-row justify-between">
        <Typography variant="h4" align="center" gutterBottom>
          Leave Requests
        </Typography>

        {/* ✅ Search & Filters */}
        <div className="flex gap-4">
          {/* Search by Name */}
          <TextField
            fullWidth
            size="small"
            label="Search by name"
            variant="outlined"
            sx={{ width: "200px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Search by Email */}
          

          {/* ✅ Leave Type Dropdown Filter */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={leaveTypeFilter}
              onChange={(e) => setLeaveTypeFilter(e.target.value)}
              label="Leave Type"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Annual Leave">Annual Leave</MenuItem>
              <MenuItem value="Sick">Sick</MenuItem>
              <MenuItem value="Paternity">Paternity</MenuItem>
              <MenuItem value="Casual">Casual</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      {/* ✅ Show Loading Message */}
      {loading && <Typography align="center">Loading leave requests...</Typography>}

      {/* ✅ Show "No Leave Cancel Request" Message if API returns 204 */}
      {!loading && noRequests && (
        <Typography align="center" style={{ marginTop: "20px" }}>
          No leave cancel request.
        </Typography>
      )}

      {/* ✅ Show Leave Requests Table if Data is Available */}
      {!loading && !noRequests && filteredLeaves.length > 0 && (
        <Paper elevation={3} style={{ marginTop: "10px", padding: "10px" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Leave Type</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeaves.map(({ id, name, email, leaveType, date, status }) => (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{leaveType}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={status}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          disabled={status !== "Pending"} // ✅ Disable if already Accepted/Rejected
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Accepted">Accepted</MenuItem>
                          <MenuItem value="Rejected">Rejected</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ✅ Pagination */}
          <TablePagination
            component="div"
            count={filteredLeaves.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPageOptions={[10]}
          />
        </Paper>
      )}
    </div>
  );
};

export default LeaveCancel;
