import React from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

function Layout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f4f7fa" }}>

      <Box
        sx={{
          width: "250px",
          backgroundColor: "#fff",
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "20px" }}>
          Navigation
        </Typography>
        <List>
          <ListItem button component={Link} to="/leave-allowance">
            <ListItemText primary="Leave Allowance" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/documents">
            <ListItemText primary="Documents" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/assets">
            <ListItemText primary="Assets" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/job-history">
            <ListItemText primary="Job History" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/salary-overview">
            <ListItemText primary="Salary Overview" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ flex: 1, padding: "20px" }}>
        <Outlet /> {/* This renders the content for the current route */}
      </Box>
    </Box>
  );
}

export default Layout;
