import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Modal,
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
import { Add } from "@mui/icons-material";

function Leave() { 
  const [leaveData, setLeaveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newLeave, setNewLeave] = useState({
    reason: "",
    leaveType: "",
    days: 0,
    startDate: "",
    endDate: "",
    dayType: "Full Day", // Default to Full Day
  });
  const [formError, setFormError] = useState("");

  const leaveTypes = [
    "Sick Leave",
    "Annual Leave",
    "Casual Leave",
    "Optional Leave",
  ];

  // Dummy data for leave requests
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

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    setNewLeave({
      reason: "",
      leaveType: "",
      days: 0,
      startDate: "",
      endDate: "",
      dayType: "Full Day",
    });
    setFormError("");
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewLeave((prev) => {
      const updatedLeave = { ...prev, [name]: value };

      if (updatedLeave.dayType === "Half Day") {
        updatedLeave.endDate = updatedLeave.startDate;
        updatedLeave.days = 0.5;
      } else if (updatedLeave.startDate && updatedLeave.endDate) {
        const startDate = new Date(updatedLeave.startDate);
        const endDate = new Date(updatedLeave.endDate);
        if (endDate >= startDate) {
          const daysDiff = Math.ceil(
            (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
          );
          updatedLeave.days = daysDiff;
        } else {
          updatedLeave.days = 0;
        }
      }

      return updatedLeave;
    });
  };

  const handleSubmitLeave = () => {
    const { reason, leaveType, startDate, endDate, dayType } = newLeave;

    if (!reason || !leaveType || !startDate || (dayType === "Full Day" && !endDate)) {
      setFormError("All fields are required.");
      return;
    }

    const currentDate = new Date();
    const start = new Date(startDate);

    currentDate.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);

    if (start < currentDate) {
      setFormError("Leave dates cannot be in the past.");
      return;
    }

    // Adding the new leave data to the dummy data
    const newLeaveData = {
      leaveType,
      reason,
      startDate,
      endDate: dayType === "Half Day" ? startDate : endDate,
      days: newLeave.days,
      status: "PENDING", // By default, the status will be "Pending"
    };
    setLeaveData((prev) => [...prev, newLeaveData]);
    handleModalClose();
  };

  return (
    <Box className="p-5 bg-gray-50 min-h-screen">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h6" className="font-bold text-gray-700">
          Leave Request
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="bg-blue-500 text-white"
          onClick={handleModalOpen}
        >
          Request Leave
        </Button>
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
                  No leave requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleModalClose}>
        <Box className="p-6 bg-white shadow-lg rounded-lg w-96 mx-auto mt-20">
          <Typography variant="h6" className="font-bold mb-4">
            Request Leave
          </Typography>
          <form className="flex flex-col space-y-4">
            <TextField
              fullWidth
              label="Reason"
              name="reason"
              value={newLeave.reason}
              onChange={handleInputChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                name="leaveType"
                value={newLeave.leaveType}
                onChange={handleInputChange}
                required
              >
                {leaveTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Day Type</InputLabel>
              <Select
                name="dayType"
                value={newLeave.dayType}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Full Day">Full Day</MenuItem>
                <MenuItem value="Half Day">Half Day</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              value={newLeave.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            {newLeave.dayType === "Full Day" && (
              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="endDate"
                value={newLeave.endDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            )}
            <TextField
              fullWidth
              label="Days"
              type="number"
              name="days"
              value={newLeave.days}
              InputProps={{ readOnly: true }}
            />
            {formError && (
              <Typography color="error" variant="body2">
                {formError}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              className="bg-blue-500 text-white"
              onClick={handleSubmitLeave}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default Leave;
