import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  Snackbar,
  Alert,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const Meeting = () => {
  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("Authorization token is missing");
       return;
        }

  setLoading(true);
  setSnackbarOpen(true); 
        const response = await axios.get(
          `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/all-meetings`,
          {
            headers: { Authorization: token },
          }
        );
        setMeetings(response.data.data || []);
      } catch (error) {
        setErrorMessage("Failed to load meetings. Please try again.");
         }

  finally {
    setLoading(false);
    setSnackbarOpen(false);
  }

    };
    fetchMeetings();
  }, []);

  const filteredMeetings = meetings.filter((meeting) =>
    meeting.meetingTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (meeting) => {
    setSelectedMeeting(meeting);
  };

  const handleCloseDialog = () => {
    setSelectedMeeting(null);
  };
  const [loading, setLoading] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  if(loading){
    return(
      <>
    <Snackbar
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
        Loading
      </Alert>
    </Snackbar>
      </>
    )
  }

  return (
    <div className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <h2 className="text-xl font-bold mb-4">Employee Meetings</h2>
        <TextField
          label="Search by Topic"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "400px" }}
        />
      </Box>

      {errorMessage && (
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}

      <Paper elevation={3} className="mt-4">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                <TableCell>ID</TableCell>
                <TableCell>Meeting Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Participants</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((meeting,index) => (
                <TableRow key={meeting.id} onClick={() => handleRowClick(meeting)} style={{ cursor: "pointer" }}>
                  <TableCell>{++index}</TableCell>
                  <TableCell>{meeting.meetingTitle || "N/A"}</TableCell>
                  <TableCell>
                    {meeting.description?.split(" ").slice(0, 5).join(" ") + (meeting.description?.split(" ").length > 5 ? "..." : "")}
                  </TableCell>
                  <TableCell>{meeting.participants?.slice(0, 2).join(", ") + (meeting.participants?.length > 2 ? "..." : "") || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        component="div"
        count={filteredMeetings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
      />

      <Dialog open={Boolean(selectedMeeting)} onClose={handleCloseDialog}>
        <DialogTitle>Meeting Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>ID:</strong> {selectedMeeting?.id} <br />
            <strong>Title:</strong> {selectedMeeting?.meetingTitle} <br />
            <strong>Description:</strong> {selectedMeeting?.description} <br />
            <strong>Participants:</strong> {selectedMeeting?.participants?.join(", ") || "N/A"} <br />
            <strong>Mode:</strong> {selectedMeeting?.meetingMode || "N/A"} <br />
            <strong>Duration:</strong> {selectedMeeting?.duration || "N/A"} <br />
            <strong>Date:</strong> {selectedMeeting?.date || "N/A"} <br />
            <strong>Time:</strong> {selectedMeeting?.scheduledTime ? new Date(selectedMeeting.scheduledTime).toLocaleTimeString() : "N/A"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Meeting;