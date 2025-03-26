import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Snackbar,
  IconButton,
  Box,
} from "@mui/material";
import { AddCircleOutline as AddIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

const MeetingsForm = () => {
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    attendees: [],
    meetingLink: "",
    meetingMode: "Online",
  });
  const [employees, setEmployees] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("jwtToken");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const name = userData?.name || "User";

  useEffect(() => {
    fetchEmployees();
  }, [email, token]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/users/get-all-users-name-email?email=${email}`,
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        console.log("Fetched Employees:", response.data); // Debugging log
        console.log(response.data);
        setEmployees(response.data || []);
        setAttendees([email]); // Include the current user in attendees
      } else {
        setError("Failed to fetch employees.");
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError("Error fetching employees: " + err.message);
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAttendeesChange = (event) => {
    let selectedAttendees = event.target.value;
    
    // Ensure the current user's email is included
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
    const { title, description, date, time, meetingLink, meetingMode } = newMeeting;

    if (!title || !description || !date || !time) {
      setError("All fields are required.");
      setOpenSnackbar(true);
      return;
    }

    const meetingData = {
      name,
      email,
      meetingTitle: title,
      description,
      meetingMode,
      participants: attendees,
      duration: "1 hour",
      date,
      scheduledTime: `${date}T${time}:00Z`,
      status: "Scheduled",
      meetingLink,
    };

    try {
      await axios.post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/meetings",
        meetingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

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
      setOpenDialog(false);
    } catch (err) {
      setError("Error creating meeting: " + err.message);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#ffffff" }}>
      <Button
        sx={{ minHeight: "55px" }}
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Create Meeting
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create a New Meeting</DialogTitle>
        <DialogContent>
          <TextField
            label="Meeting Title"
            variant="outlined"
            fullWidth
            name="title"
            value={newMeeting.title}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Date"
            type="date"
            variant="outlined"
            fullWidth
            name="date"
            value={newMeeting.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Time"
            type="time"
            variant="outlined"
            fullWidth
            name="time"
            value={newMeeting.time}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <Select
            multiple
            fullWidth
            value={attendees}
            onChange={handleAttendeesChange}
            renderValue={(selected) => selected.join(", ")}
            sx={{ marginBottom: 2 }}
          >
            {employees.length > 0 ? (
              employees.map((employee) => (
                <MenuItem key={employee.email} value={employee.email}>
                  <Checkbox checked={attendees.includes(employee.email)} />
                  <ListItemText primary={employee.email} />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No employees found</MenuItem>
            )}
          </Select>
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            name="description"
            value={newMeeting.description}
            onChange={handleChange}
            multiline
            rows={3}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Meeting Link"
            variant="outlined"
            fullWidth
            name="meetingLink"
            value={newMeeting.meetingLink}
            onChange={handleChange}
            helperText="Optional - Enter a meeting link (Zoom, Google Meet, etc.)"
            sx={{ marginBottom: 2 }}
          />
          <Select
            fullWidth
            name="meetingMode"
            value={newMeeting.meetingMode}
            onChange={handleChange}
          >
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Offline">Offline</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateMeeting} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default MeetingsForm;
