import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";

const AnnouncementForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);
  const handleRecipientChange = (e) => setRecipient(e.target.value);

  useEffect(() => {
    const fetchEmployeeEmails = async () => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      try {
        setLoading(true); // Show loading state

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/get-all-users`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            params: {
              adminEmail: email, // Add email as query parameter
            },
          }
        );

        if (response.status === 200) {
          const emails = response.data.map((employee) => employee.email); // Extract only emails
          setEmployeeEmails(emails); // Save only emails to state
        } else {
          console.error("Failed to fetch employees:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchEmployeeEmails();
  }, []);

  const handleSubmit = async () => {
    if (!title || !message || !recipient) {
      alert("Please fill in all fields.");
      return;
    }

    const senderEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!senderEmail || !token) {
      alert("User not authenticated.");
      return;
    }

    const requestData = {
      title,
      message,
      read: false,
    };

    try {
      setLoading(true);

      const response = await axios.post(
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/notification",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          params: {
            senderEmail, // Sender's email in query parameter
            recipientType: "USER", // Set recipient type as 'USER'
          },
        }
      );

      if (response.status === 200) {
        alert("Announcement created successfully.");
        // Optionally update announcements list or perform other UI updates
        setTitle("");
        setMessage("");
        setRecipient("");
      } else {
        alert("Failed to create announcement.");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("An error occurred while creating the announcement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Create Announcement
      </Typography>

      {/* Title Input */}
      <TextField
        label="Title"
        value={title}
        onChange={handleTitleChange}
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: 2,
          backgroundColor: "#f9f9f9",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />

      {/* Announcement Message Input */}
      <TextField
        label="Announcement Message"
        multiline
        rows={4}
        value={message}
        onChange={handleMessageChange}
        fullWidth
        variant="outlined"
        sx={{
          marginBottom: 2,
          backgroundColor: "#f9f9f9",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />

      {/* Recipient Selection */}
      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Recipient</InputLabel>
        <Select
          value={recipient}
          onChange={handleRecipientChange}
          label="Recipient"
          sx={{
            backgroundColor: "#f9f9f9",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        >
          <MenuItem value="">None</MenuItem>
          {employeeEmails.map((email, index) => (
            <MenuItem key={index} value={email}>
              {email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Submit Button */}
      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{
            borderRadius: "8px",
            fontWeight: "bold",
            padding: "12px",
            width: "200px",
            backgroundColor: "#007bff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Announcement"}
        </Button>
      </Box>
    </Box>
  );
};

export default AnnouncementForm;
