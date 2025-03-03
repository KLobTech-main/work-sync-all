import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Grid,
  Link,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  Snackbar,
  IconButton,
} from "@mui/material";
import { AddCircleOutline as AddIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Meetings = () => {
  const [hostMeetings, setHostMeetings] = useState([]);
  const [participantMeetings, setParticipantMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    attendees: [],
    meetingLink: "",
    meetingMode: "Online", 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");

  const apiBaseUrl =
    "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/meetings";
  const usersApiUrl =
    `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get-all-users-name-email?email=${email} `;

  const fetchMeetings = async () => {
    if (!email || !token) {
      setError("Authentication information is missing.");
      setOpenSnackbar(true); 
      setLoading(false);
      return;
    }

    try {
      const hostResponse = await axios.get(`${apiBaseUrl}/get-all`, {
        params: { email },
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

      const usersResponse = await axios.get(usersApiUrl, {
        params: { email: email },
        headers: { Authorization: token },
      });
      setEmployees(usersResponse.data);
      setAttendees([email]); 
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [email, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAttendeesChange = (event) => {
    const selectedAttendees = event.target.value;

    if (!selectedAttendees.includes(email)) {
      selectedAttendees.push(email); 
    }

    setAttendees(selectedAttendees);
    setNewMeeting((prevState) => ({
      ...prevState,
      attendees: selectedAttendees,
    }));
  };

  const handleCreateMeeting = async () => {
    if (!email || !token) {
      setError("Authentication information is missing.");
      setOpenSnackbar(true); 
      return;
    }

    const { title, description, date, time, meetingLink, meetingMode } =
      newMeeting;

    if (!title || !description || !date || !time) {
      setError("All fields are required.");
      setOpenSnackbar(true); 
      return;
    }

    const meetingData = {
      meetingTitle: title,
      description,
      meetingMode,
      participants: attendees,
      duration: "1 hour",
      date,
      scheduledTime: `${date}T${time}`,
      meetingLink,
    };

    try {
      const response = await axios.post(`${apiBaseUrl}`, meetingData, {
        params: { email },
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      fetchMeetings();

      setNewMeeting({
        title: "",
        description: "",
        date: "",
        time: "",
        attendees: [],
        meetingLink: "",
        meetingMode: "Online", 
      });
      setAttendees([email]); 
    } catch (err) {
      setError(err.message);
      setOpenSnackbar(true); 
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (loading) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
        Loading meetings...
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Meetings
      </Typography>

      <Box sx={{ marginBottom: "30px" }}>
        <Typography variant="h6">Create a New Meeting</Typography>
        <Grid
          container
          spacing={2}
          sx={{
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "10px",
            marginTop: "10px",
          }}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              label="Meeting Title"
              variant="outlined"
              fullWidth
              name="title"
              value={newMeeting.title}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              variant="outlined"
              fullWidth
              name="date"
              value={newMeeting.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time"
              type="time"
              variant="outlined"
              fullWidth
              name="time"
              value={newMeeting.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select
              label="Attendees"
              multiple
              fullWidth
              value={attendees}
              onChange={handleAttendeesChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {employees.map((employee) => (
                <MenuItem key={employee.email} value={employee.email}>
                  <Checkbox checked={attendees.indexOf(employee.email) > -1} />
                  <ListItemText primary={employee.email} />
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={newMeeting.description}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Meeting Link"
              variant="outlined"
              fullWidth
              name="meetingLink"
              value={newMeeting.meetingLink}
              onChange={handleChange}
              helperText="Optional - Enter a meeting link (Zoom, Google Meet, etc.)"
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              label="Meeting Mode"
              fullWidth
              name="meetingMode"
              value={newMeeting.meetingMode}
              onChange={handleChange}
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Button
          sx={{ marginTop: "20px" }}
          variant="contained"
          color="primary"
          onClick={handleCreateMeeting}
          startIcon={<AddIcon />}
        >
          Create Meeting
        </Button>
      </Box>

     

      <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Meetings You Are Attending
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Attendees</TableCell>
              <TableCell>Meeting Link</TableCell>
              <TableCell>Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participantMeetings.length > 0 ? (
              participantMeetings.map((meeting, index) => (
                <TableRow key={index}>
                  <TableCell>{meeting.meetingTitle || "Untitled"}</TableCell>
                  <TableCell>{meeting.date || "N/A"}</TableCell>
                  <TableCell>{new Date(meeting.scheduledTime || "").toLocaleTimeString()}</TableCell>
                  <TableCell>{meeting.description || "No description"}</TableCell>
                  <TableCell>{meeting.participants ? meeting.participants.join(", ") : "No attendees"}</TableCell>
                  <TableCell>
                    {meeting.meetingLink ? (
                      <Link href={meeting.meetingLink} target="_blank" color="primary">
                        Join Meeting
                      </Link>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{meeting.meetingMode || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No participant meetings available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
 <Typography variant="h6" sx={{ marginBottom: "20px" }}>
        Meetings You Are Hosting
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: "30px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Attendees</TableCell>
              <TableCell>Mode</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hostMeetings.length > 0 ? (
              hostMeetings.map((meeting, index) => (
                <TableRow key={index}>
                  <TableCell>{meeting.date || "N/A"}</TableCell>
                  <TableCell>{new Date(meeting.scheduledTime || "").toLocaleTimeString()}</TableCell>
                  <TableCell>{meeting.participants ? meeting.participants.join(", ") : "No attendees"}</TableCell>
                  <TableCell>{meeting.meetingMode || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hosted meetings available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default Meetings;
