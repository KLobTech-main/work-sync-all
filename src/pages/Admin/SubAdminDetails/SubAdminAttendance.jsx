import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Snackbar,
  Alert,
  Button,
  Box,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SubAdminAttendance = () => {
  const pathSegments = window.location.pathname.split("/");
  const email = pathSegments[3]
  const adminEmail = localStorage.getItem('email'); // Admin email from localStorage
  const token = localStorage.getItem('token'); // Token from localStorage

  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [selectedDate, setSelectedDate] = useState(''); // Date filter state

  useEffect(() => {
  
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/attendance/${email}?adminEmail=${adminEmail}`,
          { headers: { Authorization: token } }
        );
  
        setAttendanceData(response.data || []);
      } catch (err) {
        console.error(" API Error:", err);
        setError('Failed to fetch attendance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAttendance();
  }, [email, adminEmail, token]);
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Reset the date filter
  const handleReset = () => {
    setSelectedDate('');
  };

  // Filter attendance by date if a date is selected
  const filteredAttendance = selectedDate
    ? attendanceData.filter((record) => record.date === selectedDate)
    : attendanceData;

  // Paginate filtered data
  const currentPageData = filteredAttendance.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Format date and time for display
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (time) => (time ? new Date(time).toLocaleTimeString() : 'N/A');

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="p-6">
      {/* Snackbar for Loading */}
      <Snackbar open={snackbarOpen} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
          Loading...
        </Alert>
      </Snackbar>

      <div className="flex justify-between items-center py-4">
        <Typography variant="h4" gutterBottom>
          Attendance for {email || 'Unknown User'}
        </Typography>

        {/* Date Filter */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            variant="outlined"
            sx={{ width: '250px' }}
          />
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </div>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell style={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Punch In</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Punch Out</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPageData.map((attendance, index) => (
                    <TableRow key={attendance.id || index}>
                      <TableCell>{attendance.id || index + 1}</TableCell>
                      <TableCell>{attendance.name}</TableCell>
                      <TableCell>{formatDate(attendance.date)}</TableCell>
                      <TableCell>{formatTime(attendance.punchInTime)}</TableCell>
                      <TableCell>{formatTime(attendance.punchOutTime)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredAttendance.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      )}
    </div>
  );
};

export default SubAdminAttendance;
