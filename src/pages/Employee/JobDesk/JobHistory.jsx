import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";
import InnerSidbar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { SentimentDissatisfied, Refresh, Work, Business, Schedule } from "@mui/icons-material";

function JobHistory() {
  const [jobHistory, setJobHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  const fetchJobHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/jobHistory/?email=${email}`,
        {
          headers: { Authorization: token },
        }
      );

      // Ensure jobHistory is always an array
      setJobHistory(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error("Error fetching job history:", err);
      setError("Failed to load job history. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobHistory();
  }, []);

  // Sorting function
  const handleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    const sortedData = [...jobHistory].sort((a, b) => {
      const dateA = new Date(a.joiningDate);
      const dateB = new Date(b.joiningDate);
      return newDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

    setJobHistory(sortedData);
  };

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <div style={{ flex: 1, padding: "24px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
          <Typography variant="h4" style={{ fontWeight: 600, marginBottom: "24px", color: "#333" }}>
            Job History
          </Typography>

          <Paper elevation={3} style={{ padding: "20px", borderRadius: "10px" }}>
            {loading ? (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ minHeight: "200px" }}>
                <CircularProgress />
                <Typography variant="body1" style={{ marginTop: "16px" }}>
                  Loading job history...
                </Typography>
              </Box>
            ) : error ? (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ minHeight: "200px", color: "red" }}>
                <SentimentDissatisfied style={{ fontSize: "48px" }} />
                <Typography variant="body1" style={{ marginTop: "16px" }}>
                  {error}
                </Typography>
                <IconButton color="primary" onClick={fetchJobHistory}>
                  <Refresh />
                </IconButton>
              </Box>
            ) : jobHistory.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="job history table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#e0e0e0" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Designation</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Work Shift</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}> Designation</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Employment Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <TableSortLabel
                          active={true}
                          direction={sortDirection}
                          onClick={handleSort}
                        >
                          Joining Date
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {jobHistory.map((job, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Work color="primary" style={{ marginRight: 8 }} />
                            {job.designation}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Business color="secondary" style={{ marginRight: 8 }} />
                            {job.department}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Schedule style={{ marginRight: 8 }} />
                            {job.workShift?.shiftType} 
                          </Box>
                        </TableCell>
                        <TableCell>
                            {job.workShift?.profile}
                        </TableCell>
                        <TableCell>{job.employmentStatus}</TableCell>
                        <TableCell>{new Date(job.joiningDate).toDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" style={{ minHeight: "200px", color: "#6c757d" }}>
                <SentimentDissatisfied style={{ fontSize: "48px" }} />
                <Typography variant="h6" style={{ fontWeight: 600, marginTop: "16px" }}>
                  No Job History Found
                </Typography>
                <Typography variant="body1">
                  Your job history will appear here once added.
                </Typography>
              </Box>
            )}
          </Paper>
        </div>
      </div>
    </>
  );
}

export default JobHistory;
