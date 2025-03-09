import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Switch,
  Snackbar,
  TextField,
} from "@mui/material";
const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const fetchEmployees = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized access! Please log in.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
        }
      );
      setEmployees(response.data?.data || []);
    } catch (err) {
      setError("Failed to fetch employees. Try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter(
    ({ name, email }) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Employee List
      </Typography>
      
      {/* Search Bar */}
      <TextField
        label="Search Employees"
        variant="outlined"
        size="small"
        style={{ width: "300px", marginBottom: "15px" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {loading && (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <CircularProgress />
          <Typography>Loading employees...</Typography>
        </div>
      )}
      {error && <Typography color="error" align="center">{error}</Typography>}
      {!loading && filteredEmployees.length === 0 && !error && (
        <Typography align="center">No employees found.</Typography>
      )}

      {!loading && filteredEmployees.length > 0 && (
        <Paper elevation={3} style={{ marginTop: "20px", padding: "10px" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Role</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map(({ id, name, email, role, approvedByAdmin }) => (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell>{approvedByAdmin ? "Approved" : "Pending"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={!!approvedByAdmin}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </div>
  );
};

export default EmployeeTable;
