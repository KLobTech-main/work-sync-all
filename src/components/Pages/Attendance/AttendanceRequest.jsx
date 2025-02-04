import React, { useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Search } from "@mui/icons-material";

function AttendanceRequest() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [filter, setFilter] = useState(null); 

  const attendanceData = [
    {
      id: 1,
      profile: "John Doe",
      punchedIn: "09:00 AM",
      punchedOut: "05:00 PM",
      requestType: "Correction",
      totalHours: "8",
      status: "Pending",
      entryDate: "2024-12-01",
      requestDate: "2024-12-02",
    },
    {
      id: 2,
      profile: "Jane Smith",
      punchedIn: "10:00 AM",
      punchedOut: "06:00 PM",
      requestType: "Approval",
      totalHours: "8",
      status: "Approved",
      entryDate: "2024-12-03",
      requestDate: "2024-12-04",
    },
    {
      id: 3,
      profile: "Alice Johnson",
      punchedIn: "08:00 AM",
      punchedOut: "04:00 PM",
      requestType: "Correction",
      totalHours: "8",
      status: "Rejected",
      entryDate: "2024-12-05",
      requestDate: "2024-12-06",
    },
  ];

  const filteredData = attendanceData.filter((row) => {
    const matchesSearchTerm =
      row.profile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "entryDate") {
      return matchesSearchTerm && row.entryDate === "2024-12-01"; 
    }
    if (filter === "requestDate") {
      return matchesSearchTerm && row.requestDate === "2024-12-06";
    }
    if (filter === "rejected") {
      return matchesSearchTerm && row.status === "Rejected";
    }
    if (filter === "requestType") {
      return matchesSearchTerm && row.requestType === "Correction";
    }

    return matchesSearchTerm;
  });

  const handleFilterClick = (type) => {
    setFilter(type); 
  };

  const handleReset = () => {
    setFilter(null);
    setSearchTerm("");
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-semibold text-gray-800">
          Attendance Request
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleOpenForm}
        >
          Request Attendance
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "entryDate" ? "contained" : "outlined"}
          size="small"
          onClick={() => handleFilterClick("entryDate")}
        >
          Entry Date
        </Button>
        <Button
          variant={filter === "requestDate" ? "contained" : "outlined"}
          size="small"
          onClick={() => handleFilterClick("requestDate")}
        >
          Request Date
        </Button>
        <Button
          variant={filter === "rejected" ? "contained" : "outlined"}
          size="small"
          onClick={() => handleFilterClick("rejected")}
        >
          See Rejected
        </Button>
        <Button
          variant={filter === "requestType" ? "contained" : "outlined"}
          size="small"
          onClick={() => handleFilterClick("requestType")}
        >
          Request Type
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="secondary"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>

      <div className="flex items-center justify-end mb-4">
        <Box className="flex items-center border rounded-md px-2 py-1">
          <TextField
            placeholder="Search"
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              disableUnderline: true,
            }}
          />
          <IconButton size="small">
            <Search />
          </IconButton>
        </Box>
      </div>

      <Paper elevation={1} className="rounded-lg">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Profile</TableCell>
                <TableCell>Punched In</TableCell>
                <TableCell>Punched Out</TableCell>
                <TableCell>Request Type</TableCell>
                <TableCell>Total Hours</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.profile}</TableCell>
                    <TableCell>{row.punchedIn}</TableCell>
                    <TableCell>{row.punchedOut}</TableCell>
                    <TableCell>{row.requestType}</TableCell>
                    <TableCell>{row.totalHours}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => alert(`Viewing request for ${row.profile}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <div className="flex flex-col items-center justify-center py-12">
                      <Typography variant="body1" className="text-gray-600">
                        No results found
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>Request Attendance</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <TextField
              label="Entry Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <TextField
              label="Punch In Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <TextField
              label="Punch Out Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
            <TextField
              label="Reason"
              multiline
              rows={3}
              fullWidth
              placeholder="Enter reason for attendance request"
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              alert("Attendance request submitted!");
              handleCloseForm();
            }}
            color="primary"
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AttendanceRequest;
