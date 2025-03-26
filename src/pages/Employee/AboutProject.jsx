import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

const API_URL =
  "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/projects";

function AboutProject() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      const jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
        setError("Authentication token is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: jwtToken,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpen = (project) => setSelectedProject(project);
  const handleClose = () => setSelectedProject(null);

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Projects
      </Typography>

      {loading && (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={3} justifyContent="center">
        {!loading &&
          !error &&
          projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
                onClick={() => handleOpen(project)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {project.projectName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {project.goal}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {selectedProject && (
        <Dialog open={Boolean(selectedProject)} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedProject.projectName}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Status:</strong> {selectedProject.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Goal:</strong> {selectedProject.goal}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Objective:</strong> {selectedProject.objective}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Department:</strong> {selectedProject.department}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Tech Stack:</strong> {selectedProject.techStack.join(", ")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Team Members:</strong>
            </Typography>
            <ul>
              {selectedProject.teamMembers.map((email, idx) => (
                <li key={idx}>{email}</li>
              ))}
            </ul>
            <Typography variant="body1" gutterBottom>
              <strong>Client Info:</strong> {selectedProject.clientInfo}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Deadline:</strong> {selectedProject.deadLine}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default AboutProject;
