import { useState } from "react";
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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";

const LeaveCancel = () => {
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // ✅ Dummy Leave Requests Data
  const [leaves, setLeaves] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", leaveType: "Sick Leave", date: "2025-03-10", status: "Pending" },
    { id: 2, name: "Alice Smith", email: "alice@example.com", leaveType: "Casual Leave", date: "2025-03-12", status: "Pending" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", leaveType: "Annual Leave", date: "2025-03-15", status: "Pending" },
  ]);

  // ✅ Handle Leave Status Change
  const handleStatusChange = (leaveId, newStatus) => {
    setLeaves((prevLeaves) =>
      prevLeaves.map((leave) =>
        leave.id === leaveId ? { ...leave, status: newStatus } : leave
      )
    );

    setSnackbar({ open: true, message: `Leave ${newStatus}!`, severity: "success" });
  };

  // ✅ Filtered Leave Requests Based on Search
  const filteredLeaves = leaves.filter(({ name, email, leaveType }) =>
    `${name} ${email} ${leaveType}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px"}}>
        <div className="flex flex-row justify-between">

      <Typography variant="h4" align="center" gutterBottom>
        Leave Requests
      </Typography>

      {/* ✅ Search Bar */}
      <TextField
        fullWidth
        size="small"
        label="Search by name, email, or leave type"
        variant="outlined"
        sx={{width:"300px"}}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        style={{ marginBottom: "15px" }}
        />
         </div>

      {/* ✅ Show No Leave Requests Message */}
      {filteredLeaves.length === 0 && (
          <Typography align="center" style={{ marginTop: "20px" }}>
          No matching leave requests found.
        </Typography>
      )}

      {/* ✅ Leave Requests Table */}
      {filteredLeaves.length > 0 && (
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
                {filteredLeaves.map(({ id, name, email, leaveType, date, status }) => (
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
        </Paper>
      )}
     

      {/* ✅ Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default LeaveCancel;
