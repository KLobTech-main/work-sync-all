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
} from "@mui/material";

const Meeting = () => {
  const [meetings, setMeetings] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [searchDate, setSearchDate] = useState(""); 
  const [page, setPage] = useState(0); 
  const [rowsPerPage, setRowsPerPage] = useState(10); 
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Authorization token is missing");
        setSnackbarOpen(true);
        return;
      }

      try {
        setLoading(true);
        setSnackbarOpen(true);

        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin-sub/all-meetings`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log("API Response:", response); 

        if (response.status === 204 || !response.data || !response.data.data) {
          setMeetings([]); 
        } else {
          setMeetings(response.data.data); 
        }
      } catch (error) {
        console.error("Error fetching meetings:", error);
        setErrorMessage("Failed to load meetings. Please try again.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  useEffect(() => {
    console.log("Meetings Data:", meetings);
  }, [meetings]);

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesTopic = meeting.meetingTitle
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = searchDate ? meeting.date === searchDate : true;
    return matchesTopic && matchesDate;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: "100%" }}>
          Loading...
        </Alert>
      </Snackbar>
    );
  }

  return (
    <div className="p-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <h2 className="text-xl font-bold mb-4">Employee Meetings</h2>
        <Box display="flex" gap={2} sx={{ width: "800px", justifyContent: "flex-end" }}>
          <TextField
            label="Search by Topic"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "400px" }}
          />
          <TextField
            label="Search by Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            sx={{ width: "400px" }}
          />
        </Box>
      </Box>

      {errorMessage && (
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      <Paper elevation={3} className="mt-4">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                <TableCell style={{ fontWeight: "bold" }}>ID</TableCell>
                <TableCell style={{ width: "130px", fontWeight: "bold" }}>
                  Meeting Title
                </TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Mode</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Participants</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Duration</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Time</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings?.length > 0 ? (
                filteredMeetings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.id || "N/A"}</TableCell>
                      <TableCell>{meeting.meetingTitle || "N/A"}</TableCell>
                      <TableCell>{meeting.description || "N/A"}</TableCell>
                      <TableCell>{meeting.meetingMode || "N/A"}</TableCell>
                      <TableCell>{meeting.participants?.join(", ") || "N/A"}</TableCell>
                      <TableCell>{meeting.duration || "N/A"}</TableCell>
                      <TableCell>{meeting.date || "N/A"}</TableCell>
                      <TableCell>
                        {meeting.scheduledTime
                          ? new Date(meeting.scheduledTime).toLocaleTimeString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {meeting.meetingLink ? (
                          <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                            Join
                          </a>
                        ) : (
                          "No Link"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No meetings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={filteredMeetings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default Meeting;
