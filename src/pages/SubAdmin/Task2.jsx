import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Typography,
} from "@mui/material";

const Task = () => {
  const [tasks, setTasks] = useState([]); // State for tasks
  const [error, setError] = useState(null); // State for error
  const [searchTerm, setSearchTerm] = useState(""); // State for search filter
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setSnackbarOpen(true);
        const token = localStorage.getItem("token");
        const adminEmail = "example@company.com"; // Retrieve email from localStorage
        // const token =
        //   "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJleGFtcGxlQGNvbXBhbnkuY29tIiwiaWF0IjoxNzM1MTkzNDQyLCJleHAiOjE3MzUyMjk0NDJ9.TFMeMTNRUfeqIxxwTgAt-J2PCXXO4nLz22AeS4SsuNg"; // Retrieve token from localStorage

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/tasks/all?adminEmail=${adminEmail}`,
          {
            headers: {
              Authorization: token, // Add token to request headers
            },
          }
        );

        setTasks(response.data); // Update tasks state
      } catch (err) {
        setError("Failed to fetch tasks. Please try again."); // Handle errors
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on search input
  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page is changed
  };

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if (loading) {
    return (
      <>
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%" }}
          >
            Loading
          </Alert>
        </Snackbar>
      </>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="p-6">
      {/* Header and Search Box */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <h2 className="text-xl font-bold">Employee Tasks</h2>
        {/* Search Input on the Right */}
        <Box sx={{ width: "400px" }}>
          <TextField
            label="Search by Name or Task"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </Box>
      </Box>

      {/* Task Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Assigned By</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Show `rowsPerPage` tasks per page
                  .map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.id}</TableCell>
                      <TableCell>{task.assignedBy}</TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>{task.deadLine}</TableCell>
                      <TableCell>{task.status}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tasks match the search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10]} // Allow only 10 rows per page
        component="div"
        count={filteredTasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage} // Allow changing rows per page
      />
    </div>
  );
};

export default Task;
