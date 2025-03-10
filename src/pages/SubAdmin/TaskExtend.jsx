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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";

const API_URL = "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/tasks/deadline-extension/requests";

const TaskExtend = () => {
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Data from API
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token"); // Get token from local storage
      if (!token) {
        setSnackbar({ open: true, message: "Authentication token missing!", severity: "error" });
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Authorization": token, // Pass token in headers
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setTasks(data); // Set tasks from API
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setSnackbar({ open: true, message: "Failed to fetch tasks!", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // ✅ Filtered Tasks Based on Search
  const filteredTasks = tasks.filter(({ assignedBy, assignedTo, title, reason }) =>
    `${assignedBy} ${assignedTo} ${title} ${reason}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex flex-row justify-between">
        <Typography variant="h4" align="center" gutterBottom>
          Task Extension Requests
        </Typography>

        {/* ✅ Search Bar */}
        <TextField
          size="small"
          label="Search by name, title, or reason"
          variant="outlined"
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

      {/* ✅ Show Loading Message */}
      {loading && <Typography align="center">Loading tasks...</Typography>}

      {/* ✅ Show No Requests Message */}
      {!loading && filteredTasks.length === 0 && (
        <Typography align="center" style={{ marginTop: "20px" }}>
          No matching task extension requests found.
        </Typography>
      )}

      {/* ✅ Task Extension Requests Table */}
      {!loading && filteredTasks.length > 0 && (
        <Paper elevation={3} style={{ marginTop: "10px", padding: "10px" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Assigned By</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Assigned To</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Title</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Deadline</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map(({ id, assignedBy, assignedTo, title, deadline, reason, status }) => (
                  <TableRow key={id}>
                    <TableCell>{assignedBy}</TableCell>
                    <TableCell>{assignedTo}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>{deadline}</TableCell>
                    <TableCell>{reason}</TableCell>
                    <TableCell>{status}</TableCell>
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
        <MuiAlert severity={snackbar.severity} elevation={6} variant="filled">
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default TaskExtend;
