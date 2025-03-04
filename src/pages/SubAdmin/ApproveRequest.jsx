import React, { useState, useEffect, useCallback } from "react";
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
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // ✅ Fetch Employees Function
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
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      const employeeList = response.data?.data || [];
      if (!Array.isArray(employeeList)) {
        throw new Error("Invalid API response format");
      }

      setEmployees(employeeList);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to fetch employees. Try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Handle Toggle Approval
  const handleToggle = async (userEmail, approvedBySubAdmin) => {
    const token = localStorage.getItem("token");
    const subAdminEmail = localStorage.getItem("email");

    if (!token || !subAdminEmail) {
      setSnackbar({ open: true, message: "Unauthorized action!", severity: "error" });
      return;
    }

    try {
      await axios.patch(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/approve/access",
        { subAdminEmail, userEmail, approvedBySubAdmin },
        { headers: { Authorization: token, "Content-Type": "application/json" } }
      );

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.email === userEmail ? { ...emp, approvedBySubAdmin } : emp
        )
      );

      setSnackbar({ open: true, message: "Status updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Error updating employee status:", error);
      setSnackbar({ open: true, message: "Failed to update status.", severity: "error" });
    }
  };

  // ✅ Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h5" align="center" gutterBottom>
        Employee List
      </Typography>

      {/* ✅ Show Loading Indicator */}
      {loading && (
        <div style={{ textAlign: "center", margin: "20px" }}>
          <CircularProgress />
          <Typography>Loading employees...</Typography>
        </div>
      )}

      {/* ✅ Show Error Message */}
      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      {/* ✅ Show No Employees Message */}
      {!loading && employees.length === 0 && !error && (
        <Typography align="center" style={{ marginTop: "20px" }}>
          No employees found.
        </Typography>
      )}

      {/* ✅ Employee Table */}
      {!loading && employees.length > 0 && (
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
                {employees.map(({ id, name, email, role, approvedByAdmin }) => (
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

export default EmployeeTable;
