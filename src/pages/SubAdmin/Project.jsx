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
} from "@mui/material";
import CreateProject from "./CreateProject";

function AboutProject() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/sub-admin/api/projects",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleOpen = (project) => {
    setSelectedProject(project);
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div className="flex flex-row justify-between items-center py-2 ">
        <Typography variant="h4" gutterBottom textAlign="center">
          Projects
        </Typography>
        <CreateProject />
      </div>

      {loading ? (
        <Typography>Loading projects...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {projects.map((project, index) => (
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
      )}

      {selectedProject && (
        <Dialog open={Boolean(selectedProject)} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedProject.projectName}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              <strong>Goal:</strong> {selectedProject.goal}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Objective:</strong> {selectedProject.objective}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Tech Stack:</strong> {selectedProject.techStack.join(", ")}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Team Members:</strong>
            </Typography>
            <ul>
              {selectedProject.teamMembers.map((member, idx) => (
                <li key={idx}>{member}</li>
              ))}
            </ul>
            <Typography variant="body1" gutterBottom>
              <strong>Deadline:</strong> {selectedProject.deadLine}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Client Info:</strong> {selectedProject.clientInfo}
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
