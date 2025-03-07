import { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobHistoryForm = ({ open, handleClose }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!adminEmail || !token) {
      alert("SubAdmin email or token is missing in local storage.");
      return;
    }

    const requestBody = {
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
    };

    try {
      const response = await axios.post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/jobHistory",
        requestBody,
        { headers: { Authorization: token, "Content-Type": "application/json" } }
      );
      alert("Job history successfully submitted!");
      navigate("/subadmin/jobHistory");
      handleClose();
    } catch (error) {
      console.error("Error submitting job history:", error);
      alert("Failed to submit job history. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Job History Form</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Employee Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Shift Type" name="shiftType" value={formData.shiftType} onChange={handleChange} fullWidth required>
                <MenuItem value="Day">Day</MenuItem>
                <MenuItem value="Night">Night</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Profile" name="profile" value={formData.profile} onChange={handleChange} fullWidth required>
                <MenuItem value="Software Developer">Software Developer</MenuItem>
                <MenuItem value="System Administrator">System Administrator</MenuItem>
                <MenuItem value="Network Engineer">Network Engineer</MenuItem>
                <MenuItem value="IT Support Specialist">IT Support Specialist</MenuItem>
                <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Designation" name="designation" value={formData.designation} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Employment Status" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} fullWidth required>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} fullWidth required InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

const JobHistoryPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="contained" color="primary"  sx={{padding:1.5}} onClick={() => setOpen(true)}>
        Create Job History
      </Button>
      <JobHistoryForm open={open} handleClose={() => setOpen(false)} />
    </div>
  );
};

export default JobHistoryPage;