import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";

const InnerSidbar = () => {
  const location = useLocation();

  // Define sidebar links
  const links = [
    { path: "/jobdesk/leave-allowance", label: "Leave Allowance" },
    { path: "/jobdesk/document", label: "Document" },
    { path: "/jobdesk/Assets", label: "Assets" },
    { path: "/jobdesk/jobhistory", label: "Job History" },
    { path: "/jobdesk/salary-overview", label: "Salary Overview" },
    { path: "/jobdesk/payrun-and-badge", label: "Payrun And Badge" },
    { path: "/jobdesk/payslip", label: "Payslip" },
    { path: "/jobdesk/bank-detail", label: "Bank Detail" },
    { path: "/jobdesk/address", label: "Address Detail" },
    { path: "/jobdesk/Emergency", label: "Emergency" },
  ];

  return (
    <Box
      sx={{
        width: "250px",
        backgroundColor: "#fff",
        padding: "20px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        height: "100vh",
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "20px" }}>
        Navigation
      </Typography>
      <List>
        {links.map((link) => (
          <React.Fragment key={link.path}>
            <ListItem
              button
              component={Link}
              to={link.path}
              selected={location.pathname === link.path}
              sx={{
                backgroundColor: location.pathname === link.path ? "#f0f0f0" : "inherit",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
            >
              <ListItemText primary={link.label} />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default InnerSidbar;
