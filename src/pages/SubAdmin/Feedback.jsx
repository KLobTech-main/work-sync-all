import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TableFooter,
  TablePagination,
} from "@mui/material";
import axios from "axios";

const FeedbackTable = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default to 10 items per page

  useEffect(() => {
    const fetchFeedback = async () => {
      const adminEmail = localStorage.getItem("email");
      const authToken = localStorage.getItem("token");

      if (!adminEmail || !authToken) {
        alert("Admin email or auth token not found in local storage");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/admin/api/feedback/all`,
          {
            headers: {
              Authorization: authToken,
            },
            params: { adminEmail },
          }
        );
        setFeedbackData(response.data || []);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom style={{ marginTop: "20px" }}>
        Feedback
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((feedback, index) => (
                  <TableRow key={index}>
                    <TableCell>{feedback.email}</TableCell>
                    <TableCell>{feedback.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 30]}
                  count={feedbackData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default FeedbackTable;
