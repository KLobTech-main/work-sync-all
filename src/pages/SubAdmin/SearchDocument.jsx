import React, { useState } from "react";
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
  CircularProgress,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const SearchDocuments = () => {
  const [email, setEmail] = useState("");
  const [documents, setDocuments] = useState(null); // Null by default
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Handle search
  const handleSearch = async () => {
    if (!email.trim()) {
      setDocuments([]); // Clear table when input is empty
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Authentication token is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/admin-sub/documents/?userEmail=${email}`,
        {
          headers: { Authorization: authToken },
        }
      );

      setDocuments(response.data); // Assume response.data is an array of documents
    } catch (error) {
      console.error("Error fetching documents:", error);
      alert("Failed to fetch documents.");
    }

    setLoading(false);
  };

  // Handle file download
  const handleDownload = (blobUrl, fileName) => {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMenuOpen = (event, doc) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  return (
    <Box className="flex flex-col items-center p-6">
      <div className="flex flex-row items-center justify-between w-full">

      <Typography variant="h4" gutterBottom textAlign="center">
               Documents
             </Typography>
      {/* Search Input */}
      <Box className="flex gap-4 mb-6 w-full max-w-lg">
        <TextField
          label="Enter Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading}
          >
          Search
        </Button>
      </Box>
          </div>

      {/* Loading Spinner */}
      {loading && <CircularProgress />}

      {/* Default message when documents is null */}
      {!loading && documents === null && (
        <Typography variant="h6" color="gray" className="mt-4">
          Enter an email to search for documents.
        </Typography>
      )}

      {/* Display Table if Documents Exist */}
      {!loading && documents !== null && documents.length > 0 && (
        <TableContainer component={Paper} className="shadow-lg rounded-lg w-full ">
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>File Name</strong></TableCell>
                <TableCell><strong>File Type</strong></TableCell>
                <TableCell><strong>File Size</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((doc,index) => (
                <TableRow key={doc.id}>
                  <TableCell>{++index}</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{doc.fileType}</TableCell>
                  <TableCell>{(doc.fileSize / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, doc)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => {
                        window.open(selectedDoc.blobUrl, "_blank");
                        handleMenuClose();
                      }}>View</MenuItem>
                      <MenuItem onClick={() => {
                        handleDownload(selectedDoc.blobUrl, selectedDoc.fileName);
                        handleMenuClose();
                      }}>Download</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Show message when input is empty or no results found */}
      {!loading && documents !== null && documents.length === 0 && (
        <Typography variant="h6" color="gray" className="mt-4">
          No documents found for this email.
        </Typography>
      )}
    </Box>
  );
};

export default SearchDocuments;
