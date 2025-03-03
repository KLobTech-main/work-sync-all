import React, { useState, useEffect } from "react";
import axios from "axios";
import Profile from "../../../components/Layout/EmployeeLayout/Profile";
import InnerSidbar from "../../../components/Layout/EmployeeLayout/InnerSidbar";
import {
  Typography,
  Paper,
  Grid,
  Box,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { SentimentDissatisfied } from "@mui/icons-material";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function JobHistory() {
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  const fetchJobHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${baseUrl}/api/jobHistory/?email=${email}`,
        {
          headers: { Authorization: token },
        }
      );
      setJobHistory(response.data || []);
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

  const sortedJobHistory = [...jobHistory].sort(
    (a, b) => new Date(b.endDate) - new Date(a.endDate)
  );

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <div style={{ flex: 1, padding: "24px", backgroundColor: "#f9fafb" }}>
          <Typography
            variant="h4"
            style={{ fontWeight: 600, marginBottom: "16px" }}
          >
            Job History
          </Typography>
          <Paper elevation={3} style={{ padding: "16px" }}>
            {loading ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "200px" }}
              >
                <CircularProgress />
                <Typography variant="body1" style={{ marginTop: "16px" }}>
                  Loading job history...
                </Typography>
              </Box>
            ) : error ? (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "200px", color: "red" }}
              >
                <SentimentDissatisfied style={{ fontSize: "48px" }} />
                <Typography variant="body1" style={{ marginTop: "16px" }}>
                  {error}
                </Typography>
                <IconButton color="primary" onClick={fetchJobHistory}>
                  Retry
                </IconButton>
              </Box>
            ) : sortedJobHistory.length > 0 ? (
              <Grid container spacing={3}>
                {sortedJobHistory.map((job, index) => (
                  <Grid item xs={12} key={index}>
                    <Box>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        {job.position}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {job.company}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ marginBottom: "8px" }}
                      >
                        {job.duration}
                      </Typography>
                      <Typography
                        variant="body1"
                        style={{ marginBottom: "16px" }}
                      >
                        {job.description}
                      </Typography>
                      <Divider />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                style={{ minHeight: "200px", color: "#6c757d" }}
              >
                <SentimentDissatisfied style={{ fontSize: "48px" }} />
                <Typography
                  variant="h6"
                  style={{ fontWeight: 600, marginTop: "16px" }}
                >
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
