import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Snackbar,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import MeetingForm from "./MeetingForm.jsx"

const Meetings = () => {
  const [hostMeetings, setHostMeetings] = useState([]);
  const [participantMeetings, setParticipantMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [newTime, setNewTime] = useState("");

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");
  const apiBaseUrl =
    "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/meetings";

  useEffect(() => {
    fetchMeetings();
  }, [email, token]);

  useEffect(() => {
    applyFilters();
  }, [searchTitle, searchDate, participantMeetings]);

  const fetchMeetings = async () => {
    if (!email || !token) {
      setError("Authentication information is missing.");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const hostResponse = await axios.get(apiBaseUrl, {
        headers: { Authorization: token },
      });
      setHostMeetings(hostResponse.data);

      const participantResponse = await axios.get(
        `${apiBaseUrl}/participant`,
        {
          params: { participant: email },
          headers: { Authorization: token },
        }
      );
      setParticipantMeetings(participantResponse.data);
      setFilteredMeetings(participantResponse.data);
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = participantMeetings;
    if (searchTitle) {
      filtered = filtered.filter((meeting) =>
        meeting.meetingTitle.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    if (searchDate) {
      filtered = filtered.filter((meeting) => meeting.date === searchDate);
    }
    setFilteredMeetings(filtered);
  };

  const openReschedule = (meeting) => {
    setSelectedMeeting(meeting);
    setOpenRescheduleDialog(true);
  };

  const handleReschedule = async () => {
    if (!selectedMeeting || !newTime) return;

    try {
      await axios.put(
        `${apiBaseUrl}/reschedule`,
        { meetingId: selectedMeeting.id, newTime },
        { headers: { Authorization: token } }
      );
      setError("Meeting rescheduled successfully!");
      setOpenSnackbar(true);
      fetchMeetings();
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true);
    } finally {
      setOpenRescheduleDialog(false);
      setNewTime("");
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
        Loading meetings...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#ffffff" }}>
      
      <div className="flex justify-between items-center">

      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Meetings
      </Typography>

  
      <Box sx={{ display: "flex", alignItems:'center', gap: 2, marginBottom: "20px" }}>
      <MeetingForm/>
        <TextField
          label="Search by Title"
          variant="outlined"
          fullWidth
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          />
        <TextField
          label="Search by Date"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          />
      </Box>
          </div>

      {/* Participant Meetings Table */}
      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Meetings You Are Attending
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Date</TableCell>
              
              <TableCell>Time</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Meeting Link</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMeetings.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell>{meeting.meetingTitle}</TableCell>

                <TableCell>{meeting.description}</TableCell>
                <TableCell>{meeting.participants.join(", ")}</TableCell>
                <TableCell>{meeting.date}</TableCell>
                <TableCell>
                  {new Date(meeting.scheduledTime).toLocaleTimeString()}
                </TableCell>
                <TableCell>{meeting.meetingMode}</TableCell>
                <TableCell>{meeting.status}</TableCell>
                <TableCell>
                  {meeting.meetingLink ? (
                    <Link href={meeting.meetingLink} target="_blank">
                      Join
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  {meeting.participants[0] === email && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => openReschedule(meeting)}
                    >
                      Reschedule
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Host Meetings Table */}
      <Typography variant="h6" sx={{ marginBottom: "20px", marginTop: "30px" }}>
        All Meetings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Participants</TableCell>
              <TableCell>Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hostMeetings.map((meeting) => (
              <TableRow key={meeting.id}>
                <TableCell>{meeting.meetingTitle}</TableCell>
                <TableCell>{meeting.date}</TableCell>
                <TableCell>
                  {new Date(meeting.scheduledTime).toLocaleTimeString()}
                </TableCell>
                <TableCell>{meeting.participants.join(", ")}</TableCell>
                <TableCell>{meeting.meetingMode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reschedule Dialog */}
      <Dialog open={openRescheduleDialog} onClose={() => setOpenRescheduleDialog(false)}>
        <DialogTitle>Reschedule Meeting</DialogTitle>
        <DialogContent>
          <TextField
            label="New Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRescheduleDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleReschedule}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} message={error} />
    </Box>
  );
};

export default Meetings;
