import { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const SubAdminAnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      setSnackbarOpen(true);

      const adminEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");
      const apiUrl =
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/notification";

      if (!adminEmail || !authToken) {
        setError("User email or authentication token is missing.");
        setLoading(false);
        setSnackbarOpen(false);
        return;
      }

      try {
        const response = await axios.get(apiUrl, {
          params: { adminEmail },
          headers: { Authorization: authToken },
        });
        setAnnouncements(response.data);
      } catch {
        setError("Failed to fetch announcements. Please try again later.");
      } finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const toggleReadStatus = async (id, currentStatus) => {
    setLoading(true);
    setSnackbarOpen(true);

    const adminEmail = localStorage.getItem("email");
    const authToken = localStorage.getItem("token");
    const apiUrl = `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin/api/notification/${id}/read`;

    if (!adminEmail || !authToken) {
      setLoading(false);
      setSnackbarOpen(false);
      return;
    }

    try {
      await axios.patch(apiUrl, null, {
        params: { adminEmail },
        headers: { Authorization: authToken },
      });

      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === id
            ? { ...announcement, read: !currentStatus }
            : announcement
        )
      );
    } catch {
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
      setSnackbarOpen(false);
    }
  };

  if (loading) {
    return (
      <>
        <Snackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: "100%" }}>
            Loading...
          </Alert>
        </Snackbar>
       
      </>
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
    <TableContainer component={Paper} sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Sub-admin Announcements
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Read Status</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Action</TableCell>
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
                  onClick={() => toggleReadStatus(announcement.id, announcement.read)}
                >
                  {announcement.read ? "Mark as Unread" : "Mark as Read"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
          Action Completed!
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default SubAdminAnnouncementTable;
