import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  FormControl,
  Typography,
} from "@mui/material";

const AnnouncementForm = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const recipient="employee"

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleSubmit = async () => {
    if (!title || !message || !recipient) {
      alert("Please fill all fields");
      return;
    }

    const adminEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    const requestData = {
      id: new Date().getTime().toString(),
      title,
      message,
      createdAt: new Date().toISOString(),
      recipientType: recipient,
      recipientId: "recipient-id-placeholder",
      read: false,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/createNotification",
        requestData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          params: { adminEmail },
        }
      );

      if (response.status === 200) {
        alert("Announcement created successfully");
        setAnnouncements([requestData, ...announcements]);
        setTitle("");
        setMessage("");
      } else {
        alert("Failed to create announcement");
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("An error occurred while creating the announcement");
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
      </FormControl>
      {/* Submit Button */}
      <Box >
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
