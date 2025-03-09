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
  Snackbar,
  Alert,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if (loading) {
    return (
      <>
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
            Loading
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <div className="p-5">
      <div className="flex flex-row justify-between items-center"> 

      <h2 className="text-xl font-bold">Employee Tasks</h2>
      <div className="flex gap-2  items-center">
      <CreateTask />

        <TextField
          label="Search by email "
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          />
          </div>
      </div>

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
                    .map((task, index) => (
                      <TableRow key={task.id} hover onClick={() => handleRowClick(task)}>
                        <TableCell>{++index}</TableCell>
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
