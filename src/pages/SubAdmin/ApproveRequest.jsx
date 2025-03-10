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
  Typography,
  Switch,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const fetchEmployees = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized access! Please log in.");
      return;
    }

    try { setLoading(true);
      setSnackbarOpen(true); 
     
      const response = await axios.get(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/allUsers",
        { headers: { Authorization: token, "Content-Type": "application/json" } }
      );
      setEmployees(response.data?.data || []);
    } catch (err) {
      setError("Failed to fetch employees. Try again later.");
    } finally {
      setLoading(false);
      setSnackbarOpen(false);
  
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleToggle = async (userEmail, approvedBySubAdmin) => {
    const token = localStorage.getItem("token");
    const subAdminEmail = localStorage.getItem("email");
    if (!token || !subAdminEmail) {
      setSnackbar({ open: true, message: "Unauthorized action!", severity: "error" });
      return;
    }

    setEmployees((prevEmployees) =>
      prevEmployees.map((emp) =>
        emp.email === userEmail ? { ...emp, approvedByAdmin: approvedBySubAdmin } : emp
      )
    );

    try {
      await axios.patch(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/approve/access",
        { subAdminEmail, userEmail, approvedBySubAdmin },
        { headers: { Authorization: token, "Content-Type": "application/json" } }
      );
      setSnackbar({
        open: true,
        message: approvedBySubAdmin ? "Employee approved!" : "Approval revoked!",
        severity: "success",
      });
    } catch (error) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.email === userEmail ? { ...emp, approvedByAdmin: !approvedBySubAdmin } : emp
        )
      );
      setSnackbar({ open: true, message: "Failed to update status.", severity: "error" });
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if(loading){
    return(
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
    )
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex flex-row justify-between items-center">

      <Typography variant="h5" align="center" gutterBottom>
        Employee List
      </Typography>

      <TextField
      width="400px"
        label="Search Employees"
        variant="outlined"
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        />
        </div>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      {!loading && filteredEmployees.length === 0 && !error && (
        <Typography align="center" style={{ marginTop: "20px" }}>
          No employees found.
        </Typography>
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
                        onChange={() => handleToggle(email, !approvedByAdmin)}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EmployeeTable;
