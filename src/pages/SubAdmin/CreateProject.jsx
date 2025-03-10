import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const CreateProject = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    projectName: "",
    status: "",
    title: "",
    goal: "",
    objective: "",
    department: "",
    techStack: [],
    teamMembers: [],
    clientInfo: "",
    deadLine: "",
  });

  // Open & Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add & Remove Tech Stack
  const addTechStack = () => {
    setFormData({ ...formData, techStack: [...formData.techStack, ""] });
  };
  const removeTechStack = (index) => {
    const updatedTechStack = [...formData.techStack];
    updatedTechStack.splice(index, 1);
    setFormData({ ...formData, techStack: updatedTechStack });
  };
  const handleTechStackChange = (index, value) => {
    const updatedTechStack = [...formData.techStack];
    updatedTechStack[index] = value;
    setFormData({ ...formData, techStack: updatedTechStack });
  };

  // Add & Remove Team Members
  const addTeamMember = () => {
    setFormData({ ...formData, teamMembers: [...formData.teamMembers, ""] });
  };
  const removeTeamMember = (index) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers: updatedTeamMembers });
  };
  const handleTeamMemberChange = (index, value) => {
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers[index] = value;
    setFormData({ ...formData, teamMembers: updatedTeamMembers });
  };

  // Handle Form Submission (API Call)
  const handleSubmit = async () => {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Authentication token is missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/sub-admin/api/projects",
        formData,
        {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Project created successfully!");
      console.log(response.data);
      handleClose();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center ">
      {/* Create Project Button */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Project
      </Button>

      {/* Dialog (Modal) */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Create Project
        </DialogTitle>
        <DialogContent>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
            <Grid container spacing={2}>
              {/* Project Name */}
              <Grid item xs={12}>
                <TextField fullWidth label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} variant="outlined" />
              </Grid>

              {/* Goal */}
              <Grid item xs={12}>
                <TextField fullWidth label="Goal" name="goal" value={formData.goal} onChange={handleChange} variant="outlined" multiline rows={2} />
              </Grid>

              {/* Objective */}
              <Grid item xs={12}>
                <TextField fullWidth label="Objective" name="objective" value={formData.objective} onChange={handleChange} variant="outlined" multiline rows={2} />
              </Grid>

              {/* Status */}
              <Grid item xs={6}>
                <TextField fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} variant="outlined" />
              </Grid>

              {/* Title */}
              <Grid item xs={6}>
                <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} variant="outlined" />
              </Grid>

              {/* Department */}
              <Grid item xs={6}>
                <TextField fullWidth label="Department" name="department" value={formData.department} onChange={handleChange} variant="outlined" />
              </Grid>

              {/* Deadline */}
              <Grid item xs={6}>
                <TextField fullWidth type="date" label="Deadline" name="deadLine" value={formData.deadLine} onChange={handleChange} variant="outlined" InputLabelProps={{ shrink: true }} />
              </Grid>

              {/* Client Info */}
              <Grid item xs={12}>
                <TextField fullWidth label="Client Info" name="clientInfo" value={formData.clientInfo} onChange={handleChange} variant="outlined" />
              </Grid>

              {/* Tech Stack */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  Tech Stack
                </Typography>
                {formData.techStack.map((tech, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} my={1}>
                    <TextField fullWidth label={`Technology ${index + 1}`} value={tech} onChange={(e) => handleTechStackChange(index, e.target.value)} variant="outlined" />
                    <IconButton onClick={() => removeTechStack(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button onClick={addTechStack} startIcon={<Add />} variant="outlined">
                  Add Tech
                </Button>
              </Grid>

              {/* Team Members */}
              <Grid item xs={12}>
                <Typography variant="h6" fontWeight="bold">
                  Team Members
                </Typography>
                {formData.teamMembers.map((member, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} my={1}>
                    <TextField fullWidth label={`Member ${index + 1}`} value={member} onChange={(e) => handleTeamMemberChange(index, e.target.value)} variant="outlined" />
                    <IconButton onClick={() => removeTeamMember(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button onClick={addTeamMember} startIcon={<Add />} variant="outlined">
                  Add Member
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", padding: 2 }}>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateProject;
