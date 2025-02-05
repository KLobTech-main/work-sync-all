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
  IconButton,
  Pagination,
  Menu,
} from "@mui/material";
import { Add, MoreVert } from "@mui/icons-material";
import axios from "axios";

function LeaveRequest() {
  const [leaveData, setLeaveData] = useState([]);

    const [page, setPage] = useState(1);
    const totalPages = 10; // Define total pages here
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
    dayType: "Full Day",
  });
  const [formError, setFormError] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  
  const leaveTypes = [
    "Sick Leave",
    "Annual Leave",
    "Casual Leave",
    "Optional Leave",
  ];

  const downloadFile = async (url, fileName) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  const handleClickMenu = (event, leave) => {
    setAnchorEl(event.currentTarget);
    setSelectedLeave(leave);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedLeave(null);
  };
  const handlePageChange = (event, value) => {
    setPage(value);
    console.log("Current Page:", value);
  };

  const handleDownload = () => {
    if (selectedLeave) {
      downloadFile(selectedLeave.blobUrl, selectedLeave.fileName);
      handleCloseMenu();
    }
  };

  const handleView = () => {
    if (selectedLeave) {
      window.open(selectedLeave.blobUrl, '_blank');
      handleCloseMenu();
    }
  };

  useEffect(() => {
    if (email && token) {
      axios
        .get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/leaves/${email}`,
          {
            headers: { Authorization: token },
          }
        )
        .then((response) => {
          setLeaveData(response.data);
        })
        .catch((error) => console.error("Error fetching leave data:", error));
    }
  }, [email, token]);

  const handleModalOpen = () => setOpenModal(true);

  const handleModalClose = () => {
    setOpenModal(false);
    resetForm();
    setFormError("");
  };

  const resetForm = () => {
    setNewLeave({
      reason: "",
      leaveType: "",
      days: 0,
      startDate: "",
      endDate: "",
      dayType: "Full Day",
    });
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

    const lastUpdatedMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (email && token) {
      axios
        .post(
          "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/leaves",
          {
            email,
            reason,
            leaveType,
            days: newLeave.days,
            startDate,
            endDate: dayType === "Half Day" ? startDate : endDate,
            approvedByAdmin: false,
            lastUpdatedMonth,
          },
          { headers: { Authorization: token } }
        )
        .then((response) => {
          setLeaveData((prev) => [...prev, response.data]);
          handleModalClose();
        })
        .catch((error) => console.error("Error submitting leave request:", error));
    }
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

      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Leave Type</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Days</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveData.length > 0 ? (
              leaveData.map((leave, index) => (
                <TableRow key={index}>
                  <TableCell>{leave.leaveType}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.days}</TableCell>
                  <TableCell>{leave.status}</TableCell>


                  <TableCell>

                    {leave.blobUrl ? (
                      <>
                        <IconButton onClick={(event) => handleClickMenu(event, leave)}>

                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem onClick={handleDownload}>Download</MenuItem>
                          <MenuItem onClick={handleView}>View</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No Attachment Available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>

              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
       <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Pagination
              page={page} // Current page
              onChange={handlePageChange} // Page change handler
              siblingCount={0} // Removes numbers between arrows
              boundaryCount={1} // Shows only the first and last page
              shape="rounded" // Rounded arrows
              color="primary" // Styling
            />
          </Box>
    </Box>
  );
}

export default LeaveRequest;
