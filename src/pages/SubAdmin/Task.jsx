import { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Snackbar,
  Alert,
  TablePagination,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import CreateTask from "./CreateTask";
const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setSnackbarOpen(true);
        const token = localStorage.getItem("token");
        const adminEmail = localStorage.getItem("email");
        const response = await axios.get(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/all-tasks?subAdminEmail=${adminEmail}`,
          {
            headers: { Authorization: token },
          }
        );
        setTasks(response.data.data || []);
      } catch {
        setError("Failed to fetch tasks. Please try again.");
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks?.filter(
    (task) =>
      task?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRowClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
  };

  return (
    <div className="p-5">
      <Snackbar open={snackbarOpen} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity="info">Loading...</Alert>
      </Snackbar>

      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <h2 className="text-xl font-bold">Employee Tasks</h2>
        <Box sx={{ width: "500px", display: "flex", gap:2,alignItems: "center" }}> 
          <CreateTask/>

          <TextField
            label="Search by Name or Task"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && tasks.length === 0 && (
        <Typography variant="body1" align="center" mt={2}>
          No tasks available.
        </Typography>
      )}

      {!loading && tasks.length > 0 && (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Assigned By</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((task) => (
                      <TableRow key={task.id} hover onClick={() => handleRowClick(task)}>
                        <TableCell>{task.id}</TableCell>
                        <TableCell>{task.assignedBy}</TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{new Date(task.deadLine).toLocaleDateString()}</TableCell>
                        <TableCell>{task.status}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No tasks match the search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tasks.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filteredTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
        />
      )}

      <Dialog open={!!selectedTask} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Task Details</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <>
              <Typography><strong>Assigned By:</strong> {selectedTask.assignedBy}</Typography>
              <Typography><strong>Assigned To:</strong> {selectedTask.assignedTo}</Typography>
              <Typography><strong>Title:</strong> {selectedTask.title}</Typography>
              <Typography><strong>Description:</strong> {selectedTask.description}</Typography>
              <Typography><strong>Deadline:</strong> {new Date(selectedTask.deadLine).toLocaleDateString()}</Typography>
              <Typography><strong>Status:</strong> {selectedTask.status}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Task;
