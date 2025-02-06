import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const UserAnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const userEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");
      const apiUrl =
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/notification/type";

      if (!userEmail || !authToken) {
        setError("User email or authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(apiUrl, {
          params: {
            recipientType: "user",
            userEmail,
          },
          headers: {
            Authorization: authToken,
          },
        });
        setAnnouncements(response.data);
      } catch (err) {
        setError("Failed to fetch announcements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading Announcements...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" style={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Typography
        variant="h5"
        sx={{ padding: 2, backgroundColor: "#0D1B2A", color: "#E0F2F1" }}
      >
        User Announcements
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Title
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Description
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Date
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Read Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell>{announcement.title}</TableCell>
              <TableCell>{announcement.message}</TableCell>
              <TableCell>
                {new Date(announcement.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {announcement.read ? "Seen" : "Not Seen Yet"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserAnnouncementTable;
