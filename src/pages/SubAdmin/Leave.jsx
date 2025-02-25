import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

function Leave() {
  const [leaveData, setLeaveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const leaveTypes = [
    "Sick Leave",
    "Annual Leave",
    "Casual Leave",
    "Optional Leave",
  ];

  // Dummy data for leave records
  const dummyData = [
    {
      leaveType: "Sick Leave",
      reason: "Fever",
      startDate: "2024-12-20",
      endDate: "2024-12-22",
      days: 3,
      status: "APPROVED",
    },
    {
      leaveType: "Annual Leave",
      reason: "Vacation",
      startDate: "2024-12-15",
      endDate: "2024-12-18",
      days: 4,
      status: "PENDING",
    },
    {
      leaveType: "Casual Leave",
      reason: "Personal work",
      startDate: "2024-12-10",
      endDate: "2024-12-10",
      days: 1,
      status: "REJECTED",
    },
  ];

  useEffect(() => {
    // Set dummy data on initial load
    setLeaveData(dummyData);
    setFilteredData(dummyData);
  }, []);

  useEffect(() => {
    let filtered = leaveData;

    if (filterType) {
      filtered = filtered.filter((leave) => leave.leaveType === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((leave) =>
        filterStatus === "Approved"
          ? leave.status === "APPROVED"
          : filterStatus === "Pending"
          ? leave.status === "PENDING"
          : leave.status === "REJECTED"
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((leave) =>
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchQuery, filterType, filterStatus, leaveData]);

  return (
    <Box className="p-5 bg-gray-50 min-h-screen">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="font-bold text-gray-700">
          Leave Records
        </Typography>
      </Box>

      <Box className="flex flex-wrap items-center gap-4 mb-6">
        <TextField
          label="Search by Reason"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl variant="outlined" size="small" sx={{ width: "200px" }}>
          <InputLabel>Filter by Leave Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            label="Filter by Leave Type"
          >
            <MenuItem value="">All</MenuItem>
            {leaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" size="small" sx={{ width: "200px" }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f0f0f0' }}>
              <TableCell style={{ fontWeight: 'bold' }}>Leave Type</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Reason</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Days</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((leave, index) => (
                <TableRow key={index}>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>
                    {leave.status === "PENDING"
                      ? "Pending"
                      : leave.status === "REJECTED"
                      ? "Rejected"
                      : "Approved"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No leave records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Leave;
