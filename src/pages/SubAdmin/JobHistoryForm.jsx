import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobHistoryForm = () => {
  // State to store form values
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    department: "",
    shiftType: "",
    profile: "",
    designation: "",
    employmentStatus: "",
    joiningDate: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.toString(), // Ensure the value is always a string
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get admin email and token from local storage
    const adminEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!adminEmail || !token) {
      alert("Admin email or token is missing in local storage.");
      return;
    }

    // Prepare API body
    const requestBody = {
      adminEmail,
      jobHistory: {
        email: formData.email.toString(),
        name: formData.name.toString(),
        department: formData.department.toString(),
        workShift: {
          shiftType: formData.shiftType.toString(),
          profile: formData.profile.toString(),
        },
        designation: formData.designation.toString(),
        employmentStatus: formData.employmentStatus.toString(),
        joiningDate: formData.joiningDate.toString(),
      },
    };

    try {
      const response = await axios.post(
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/jobHistory/post",
        requestBody,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Job history successfully submitted!");
      navigate("/admin/jobHistory");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting job history:", error);
      alert("Failed to submit job history. Please try again.");
      console.log(token);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, width: "50%" }}>
        <Typography variant="h5" gutterBottom>
          Job History Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Email */}
            <Grid item xs={12}>
              <TextField
                label="Employee Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Name */}
            <Grid item xs={12}></Grid>
            {/* Department */}
            <Grid item xs={12}>
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Shift Type */}
            <Grid item xs={12}>
              <TextField
                select
                label="Shift Type"
                name="shiftType"
                value={formData.shiftType}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Day">Day</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
              </TextField>
            </Grid>
            {/* Profile */}
            <Grid item xs={12}>
              <TextField
                select
                label="Profile"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Software Developer">
                  Software Developer
                </MenuItem>
                <MenuItem value="System Administrator">
                  System Administrator bolt.
                </MenuItem>
                <MenuItem value="Network Engineer">Network Engineer</MenuItem>
                <MenuItem value="IT Support Specialist">
                  IT Support Specialist
                </MenuItem>
                <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
              </TextField>
            </Grid>
            {/* Designation */}
            <Grid item xs={12}>
              <TextField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Employment Status */}
            <Grid item xs={12}>
              <TextField
                select
                label="Employment Status"
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            {/* Joining Date */}
            <Grid item xs={12}>
              <TextField
                label="Joining Date"
                name="joiningDate"
                type="date"
                value={formData.joiningDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default JobHistoryForm;
