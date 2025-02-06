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
  Button,
} from "@mui/material";
import axios from "axios";

const UserAnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const adminEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");
      const apiUrl =
        "https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/notification";

      if (!adminEmail || !authToken) {
        setError("User email or authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(apiUrl, {
          params: {
            adminEmail,
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

  const toggleReadStatus = async (id, currentStatus) => {
    const adminEmail = localStorage.getItem("email");
    const authToken = localStorage.getItem("token");
    const apiUrl = `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/notification/${id}/read`;

    if (!adminEmail || !authToken) {
      alert("User email or authentication token is missing.");
      return;
    }

    try {
      // Toggle the read status by sending the adminEmail as a query parameter
      await axios.patch(apiUrl, null, {
        params: {
          adminEmail,
          // Pass adminEmail as a query parameter
        },
        headers: {
          Authorization: authToken,
        },
      });
      // Update the local state to reflect the change
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === id
            ? { ...announcement, read: !currentStatus }
            : announcement
        )
      );
    } catch (err) {
      alert("Failed to update read status. Please try again.");
    }
  };

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
        Sub-admin Announcements
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
            <TableCell align="left" sx={{ fontWeight: "bold" }}>
              Action
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
              <TableCell>
                <Button
                  variant="contained"
                  color={announcement.read ? "default" : "primary"}
                  onClick={() =>
                    toggleReadStatus(announcement.id, announcement.read)
                  }
                >
                  {announcement.read ? "Mark as Unread" : "Mark as Read"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserAnnouncementTable;
