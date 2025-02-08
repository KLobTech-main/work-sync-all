import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import axios from "axios";

const JobHistory = () => {
  const [jobHistory, setJobHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [searchProfile, setSearchProfile] = useState("");

  useEffect(() => {
    const fetchJobHistory = async () => {
      const token = localStorage.getItem("token");
      const adminEmail = localStorage.getItem("email");

      try {
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/jobHistory/all`,
          {
            params: {
              adminEmail: adminEmail, // Get email from local storage
            },
            headers: {
              Authorization: token, // Pass token from local storage for authentication
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.status === 200) {
          setJobHistory(response.data);
        } else {
          console.error("Error fetching job history");
        }
      } catch (error) {
        console.error("Error fetching job history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobHistory();
  }, []);

  // Function to toggle sort order
  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
  };

  // Sorting function based on joiningDate
  const sortedJobHistory = [...jobHistory]
    .sort((a, b) => {
      const dateA = new Date(a.joiningDate);
      const dateB = new Date(b.joiningDate);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    })
    // Filter by name and profile
    .filter((job) => {
      const nameMatch = job.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const profileMatch = job.workShift.profile
        .toLowerCase()
        .includes(searchProfile.toLowerCase());
      return nameMatch && profileMatch;
    });

  return (
    <div>
      {/* Flex container for heading and search inputs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", // Spacing between heading and search section
          alignItems: "center", // Align both vertically
          padding: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Job History
        </Typography>

        {/* Search Inputs */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center", // Align inputs vertically in the middle
          }}
        >
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{ width: "300px" }} // Set width for better visibility
          />
          <FormControl variant="outlined" sx={{ width: "300px" }}>
            <InputLabel>Profile</InputLabel>
            <Select
              value={searchProfile}
              onChange={(e) => setSearchProfile(e.target.value)}
              label="Profile"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Software Developer">Software Developer</MenuItem>
              <MenuItem value="System Administrator">
                System Administrator
              </MenuItem>
              <MenuItem value="Network Engineer">Network Engineer</MenuItem>
              <MenuItem value="IT Support Specialist">
                IT Support Specialist
              </MenuItem>
              <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Typography variant="h6" align="center">
          Loading job history...
        </Typography>
      ) : (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Employee Email
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Employee Name
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>Role</TableCell>
                    <TableCell
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      onClick={handleSort} // Toggle sort order on click
                    >
                      Joining Date
                      <IconButton size="small">
                        {sortOrder === "asc" ? (
                          <ArrowUpward />
                        ) : (
                          <ArrowDownward />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Department
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Profile
                    </TableCell>
                    <TableCell style={{ fontWeight: "bold" }}>
                      Shift Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedJobHistory.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell>{job.email}</TableCell>
                      <TableCell>{job.name}</TableCell>
                      <TableCell>{job.designation}</TableCell>
                      <TableCell>{job.joiningDate}</TableCell>
                      <TableCell>{job.department}</TableCell>
                      <TableCell>{job.workShift.profile}</TableCell>
                      <TableCell>{job.workShift.shiftType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </div>
  );
};

export default JobHistory;
