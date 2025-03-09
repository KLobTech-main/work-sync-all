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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";

const TaskExtend = () => {
  const [search, setSearch] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // ✅ Dummy Data
  const [tasks, setTasks] = useState([
    {
      id: 1,
      assignedBy: "John Doe",
      assignedTo: "Alice Smith",
      title: "API Development",
      deadline: "2025-03-12",
      status: "Pending",
      reason: "Need more time for testing",
      newDate: "",
    },
    {
      id: 2,
      assignedBy: "Michael Brown",
      assignedTo: "Robert Wilson",
      title: "UI Redesign",
      deadline: "2025-03-15",
      status: "Pending",
      reason: "Client requested changes",
      newDate: "",
    },
  ]);

  // ✅ Approve Dialog State
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newDeadline, setNewDeadline] = useState("");
  const [note, setNote] = useState("");

  // ✅ Handle Status Change
  const handleStatusChange = (taskId, newStatus) => {
    if (newStatus === "Approved") {
      // Open dialog for new date input
      const task = tasks.find((task) => task.id === taskId);
      setSelectedTask(task);
      setOpenDialog(true);
    } else {
      // Directly reject the task
      updateTaskStatus(taskId, "Rejected", "", "");
      setSnackbar({ open: true, message: "Task Rejected!", severity: "error" });
    }
  };

  // ✅ Update Task Status
  const updateTaskStatus = (taskId, newStatus, newDeadline, note) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, newDate: newDeadline, note } : task
      )
    );
    setOpenDialog(false);
    setSnackbar({ open: true, message: `Task ${newStatus}!`, severity: "success" });
  };

  // ✅ Submit Approve Form
  const handleApproveSubmit = () => {
    if (!newDeadline) {
      setSnackbar({ open: true, message: "Please select a new deadline!", severity: "warning" });
      return;
    }
    updateTaskStatus(selectedTask.id, "Approved", newDeadline, note);
  };

  // ✅ Filtered Tasks Based on Search
  const filteredTasks = tasks.filter(({ assignedBy, assignedTo, title, reason }) =>
    `${assignedBy} ${assignedTo} ${title} ${reason}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px"}}>
        <div className="flex flex-row justify-between">

      <Typography variant="h4" align="center" gutterBottom>
        Task Extension Requests
      </Typography>

      {/* ✅ Search Bar */}
      <TextField
       width="300px"
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

      {/* ✅ Show No Requests Message */}
      {filteredTasks.length === 0 && (
        <Typography align="center" style={{ marginTop: "20px" }}>
          No matching task extension requests found.
        </Typography>
      )}

      {/* ✅ Task Extension Requests Table */}
      {filteredTasks.length > 0 && (
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
                  <TableCell style={{ fontWeight: "bold" }}>New Date</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.map(({ id, assignedBy, assignedTo, title, deadline, reason, newDate, status }) => (
                  <TableRow key={id}>
                    <TableCell>{assignedBy}</TableCell>
                    <TableCell>{assignedTo}</TableCell>
                    <TableCell>{title}</TableCell>
                    <TableCell>{deadline}</TableCell>
                    <TableCell>{reason}</TableCell>
                    <TableCell>{newDate || "N/A"}</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={status}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                          disabled={status !== "Pending"}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Approved">Approve</MenuItem>
                          <MenuItem value="Rejected">Reject</MenuItem>
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

      {/* ✅ Approve Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Approve Task Extension</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="New Deadline"
            variant="outlined"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
            style={{ marginBottom: "15px" }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Optional Note"
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleApproveSubmit}>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

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
