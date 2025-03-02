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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  TablePagination,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchPriority, setSearchPriority] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const adminEmail = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/all-tickets",
          {
            params: { subAdminEmail: adminEmail },
            headers: { Authorization: token },
          }
        );

        setTickets(response.data.data); // API returns tickets in the `data` array
      } catch (err) {
        setError("Failed to fetch tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    const adminEmail = localStorage.getItem("email");
    const authToken = localStorage.getItem("token");

    if (!adminEmail || !authToken) {
      return alert("Email or Auth Token not found.");
    }

    try {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status } : ticket
        )
      );

      await axios.patch(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/tickets/status`,
        {},
        {
          params: { adminEmail, ticketId, status },
          headers: { Authorization: authToken },
        }
      );

      console.log(`Status updated for ticket ${ticketId} to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        `Failed to update status. ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchStatus ? ticket.status === searchStatus : true) &&
      (searchPriority ? ticket.priority === searchPriority : true) &&
      ticket.email.toLowerCase().includes(searchEmployee.toLowerCase())
    );
  });

  return (
    <div className="p-6">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Employee Tickets
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
        marginBottom={2}
        justifyContent="space-between"
      >
        <TextField
          label="Search by Issue"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: "200px" }}
        />
        <TextField
          label="Search by Employee"
          variant="outlined"
          value={searchEmployee}
          onChange={(e) => setSearchEmployee(e.target.value)}
          sx={{ flex: 1, minWidth: "200px" }}
        />
        <FormControl variant="outlined" sx={{ minWidth: "150px" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: "150px" }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={searchPriority}
            onChange={(e) => setSearchPriority(e.target.value)}
            label="Priority"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTickets.length > 0 ? (
                filteredTickets
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.id}</TableCell>
                      <TableCell>{ticket.email}</TableCell>
                      <TableCell>{ticket.title || "N/A"}</TableCell>
                      <TableCell>{ticket.description || "N/A"}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color:
                              ticket.status === "OPEN"
                                ? "red"
                                : ticket.status === "RESOLVED"
                                ? "green"
                                : "orange",
                          }}
                        >
                          {ticket.status}
                        </Typography>
                      </TableCell>
                      <TableCell>{ticket.priority || "N/A"}</TableCell>
                      <TableCell>
                        <FormControl variant="outlined" size="small">
                          <Select
                            value={ticket.status}
                            onChange={(e) =>
                              handleStatusChange(ticket.id, e.target.value)
                            }
                          >
                            <MenuItem value="OPEN">Open</MenuItem>
                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                            <MenuItem value="RESOLVED">Resolved</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        component="div"
        count={filteredTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </div>
  );
};

export default Ticket;
