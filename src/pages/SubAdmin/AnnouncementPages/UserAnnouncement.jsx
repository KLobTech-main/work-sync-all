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
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const UserAnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const userEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");
      const apiUrl =
        "https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/notification/type";

      if (!userEmail || !authToken) {
        setError("User email or authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
         setLoading(true);
        setSnackbarOpen(true); 
       
        const response = await axios.get(apiUrl, {
          params: { recipientType: "user", userEmail },
          headers: { Authorization: authToken },
        });

        setAnnouncements(response.data);
        setSnackbar({ open: true, message: "Announcements Loaded!", severity: "success" });
      } catch {
        setError("Failed to fetch announcements. Please try again later.");
        setSnackbar({ open: true, message: "Error fetching data.", severity: "error" });
      } 
      finally {
        setLoading(false);
        setSnackbarOpen(false);
      }
    
    };

    fetchAnnouncements();
  }, []);


 
   const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  if (error) {
    return (
      <Typography variant="h6" color="error" style={{ textAlign: "center" }}>
        {error}
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ padding: "20px" }}>
      <Typography variant="h4">User Announcements</Typography>
      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Date</TableCell>
            <TableCell align="left" sx={{ fontWeight: "bold" }}>Read Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell>{announcement.title}</TableCell>
              <TableCell>{announcement.message}</TableCell>
              <TableCell>{new Date(announcement.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{announcement.read ? "Seen" : "Not Seen Yet"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Snackbar Notification */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </TableContainer>
  );
};

export default UserAnnouncementTable;
