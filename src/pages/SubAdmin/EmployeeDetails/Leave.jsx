import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  Typography,
} from "@mui/material";
import axios from "axios";

const EmployeeDetails = () => {
  const { state } = useLocation();
  const { employee } = state || {};
  const [leaves, setLeaves] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      setError(null);
      
      const adminEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");
      const employeeEmail = employee?.email;
      
      if (!adminEmail || !authToken || !employeeEmail) {
        setError("Missing admin email, authentication token, or employee email.");
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/api/leaves/by-email`,
          {
            params: { adminEmail, userEmail: employeeEmail },
            headers: { Authorization: authToken },
          }
        );
    
        if (response.status === 204) {
          setLeaves([]); // Set an empty array if no content is returned
        } else {
          setLeaves(response.data || []); // Default to empty array if response.data is undefined
        }
      } catch (err) {
        setError("Failed to fetch leave data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchLeaves();
  }, [employee]);

  const filteredLeaves = leaves.filter((leave) =>
    leave.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  if (loading) {
    return (
      <Typography variant="h6" color="primary" align="center">
        Loading leave data...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <div className="p-6 overflow-auto h-screen">
      <h2 className="text-xl font-bold">Leave Details</h2>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: 400 }}
        />
      </Box>
      {filteredLeaves.length === 0 ? (
        <Typography variant="h6" color="error" align="center" sx={{ mt: 2 }}>
          No data found
        </Typography>
      ) : (
        <Paper className="mt-4">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Leave ID</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Leave Type</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Start Date</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>End Date</TableCell>
                  <TableCell style={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave.leaveId}>
                    <TableCell>{leave.id}</TableCell>
                    <TableCell>{leave.name}</TableCell>
                    <TableCell>{leave.leaveType}</TableCell>
                    <TableCell>{leave.reason}</TableCell>
                    <TableCell>{leave.startDate}</TableCell>
                    <TableCell>{leave.endDate}</TableCell>
                    <TableCell>{leave.status}</TableCell>
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

export default EmployeeDetails;
