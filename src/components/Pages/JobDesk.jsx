import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
} from "@mui/material";
import InnerSidbar from "../Layout/InnerSidbar";
import Profile from "../Layout/Profile";
import LeaveAllowance from "./JobDesk/LeaveAllowance";
function JobDesk() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedComponent, setSelectedComponent] = useState("LeaveAllowance");

  // Components for each section
  const LeaveAllowance = () => (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Leave Allowance
      </Typography>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff9e6",
          padding: "10px 20px",
          borderLeft: "4px solid #ffcc00",
          marginBottom: "20px",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          <b>Allowance Policy</b>
        </Typography>
        <Typography variant="body2" sx={{ marginTop: "5px" }}>
          1. Leave will start from the month of January.
        </Typography>
        <Typography variant="body2">
          2. Any type of change will be effective on the next day.
        </Typography>
      </Paper>
    </Paper>
  );

  const Documents = () => (
    <Typography variant="h6">Documents Section Content</Typography>
  );

  const Assets = () => (
    <Typography variant="h6">Assets Section Content</Typography>
  );

  const JobHistory = () => (
    <Typography variant="h6">Job History Section Content</Typography>
  );

  const SalaryOverview = () => (
    <Typography variant="h6">Salary Overview Section Content</Typography>
  );

  const componentMap = {
    LeaveAllowance: <LeaveAllowance />,
    Documents: <Documents />,
    Assets: <Assets />,
    JobHistory: <JobHistory />,
    SalaryOverview: <SalaryOverview />,
  };

  return (
    <>

    <Profile/>
      
     
   
        <InnerSidbar/>
      
      
      
    </>
  );
}

export default JobDesk;
