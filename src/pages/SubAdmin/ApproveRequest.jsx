import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Snackbar,
  Switch,
} from "@mui/material";
import axios from "axios";

const ApproveRequest = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      try {
        setLoading(true);
        setSnackbarOpen(true);

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/get-all-users`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            params: { adminEmail: email },
          }
        );

        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleToggle = async (email, approvedByAdmin) => {
    const token = localStorage.getItem("token");
    const adminEmail = localStorage.getItem("email");

    try {
      await axios.patch(
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin-sub/approve/access",
        {
          adminEmail,
          email,
          approvedByAdmin,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.email === email ? { ...employee, approvedByAdmin } : employee
        )
      );
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };

  return (
    <div className="p-6">
      <Typography variant="h4" gutterBottom>
        Approve Request
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.email}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                        {employee.approvedByAdmin ? "Approved" : "Pending"}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={!!employee.approvedByAdmin}
                          onChange={(e) =>
                            handleToggle(employee.email, e.target.checked)
                          }
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Snackbar
        open={snackbarOpen}
        message="Fetching employee data..."
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3000}
      />
    </div>
  );
};

export default ApproveRequest;
