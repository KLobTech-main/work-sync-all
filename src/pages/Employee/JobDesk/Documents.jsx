import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Profile from '../../../components/Layout/EmployeeLayout/Profile';
import InnerSidbar from '../../../components/Layout/EmployeeLayout/InnerSidbar';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('jwtToken');

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/documents/?email=${email}`,
        {
          headers: { Authorization: token },
        }
      );
      setDocuments(response.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to fetch documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    setUploading(true);
    try {
      await axios.post(
        'https://work-management-cvdpavakcsa5brfb.canadacentral-01.azurewebsites.net/api/documents/upload',
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setFile(null);
      setIsModalOpen(false);
      fetchDocuments(); 
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (url, fileName) => {
    try {
      const response = await axios.get(url, {
        responseType: 'blob', // Ensure the response is treated as a binary file
      });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // Set the download attribute to the desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up the blob URL
    } catch (error) {
      console.error('Error downloading the file:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setUploading(false);
  };

  const handleFileUpload = (event) => setFile(event.target.files[0]);

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />

        <Box sx={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Documents
            </Typography>
            <Button
              variant="contained"
              onClick={handleOpenModal}
              sx={{
                textTransform: 'none',
                backgroundColor: '#007bff',
                '&:hover': { backgroundColor: '#0056b3' },
              }}
              startIcon={<UploadFileIcon />}
            >
              Add New
            </Button>
          </Box>

          <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                placeholder="Search"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {loading ? (
            <Typography align="center">Loading...</Typography>
          ) : error ? (
            <Typography align="center" color="error">
              {error}
            </Typography>
          ) : (
            <Paper
              elevation={3}
              sx={{
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: '#fff',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>File Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Download Link</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc, index) => (
                        <TableRow key={index}>
                          <TableCell>{doc.fileName}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => downloadFile(doc.blobUrl, doc.fileName)}
                              variant="outlined"
                              size="small"
                            >
                              Download
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => window.open(doc.blobUrl, '_blank')}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No documents found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>Add New Document</DialogTitle>
        <DialogContent>
          <div>
            <Typography>Upload File</Typography>
            <input
              type="file"
              accept=".pdf,.docx,.png,.jpg"
              onChange={handleFileUpload}
              style={{ marginTop: '10px' }}
            />
            {file && (
              <Typography variant="body2">Selected File: {file.name}</Typography>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={uploadDocument}
            variant="contained"
            color="primary"
            disabled={!file || uploading}
            startIcon={uploading && <CircularProgress size={20} />}
          >
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Documents;
