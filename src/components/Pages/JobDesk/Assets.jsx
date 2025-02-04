import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Profile from '../../Layout/Profile';
import InnerSidbar from '../../Layout/InnerSidbar';
import axios from 'axios';

function Assets() {
  const [assets, setAssets] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); 
  const token = localStorage.getItem('jwtToken');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(
          `https://work-sync-gbf0h9d5amcxhwcr.canadacentral-01.azurewebsites.net/api/assets/?email=${email}`,
          {
            headers: { Authorization: token },
     
          }
        );
        setAssets(response.data); 
      } catch (err) {
        setError('Failed to fetch assets. Please try again later.',err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [email, token]);

  const filteredAssets = assets.filter((asset) =>
    Object.values(asset).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />
        <Box sx={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>

          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Assets
          </Typography>

          <Grid container spacing={2} sx={{ Width:'100%',marginBottom: '20px' }}>
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
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: 'center', marginTop: '20px' }}>
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Asset Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Asset Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Serial No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Is Working</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset, index) => (
                        <TableRow key={index}>
                          <TableCell>{asset.assetName}</TableCell>
                          <TableCell>{asset.assetCode}</TableCell>
                          <TableCell>{asset.serialNo}</TableCell>
                          <TableCell>{asset.isWorking}</TableCell>
                          <TableCell>{asset.type}</TableCell>
                          <TableCell>{asset.date}</TableCell>
                          <TableCell>{asset.note}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <img
                              src="https://via.placeholder.com/80"
                              alt="No Data"
                              style={{ marginBottom: '10px' }}
                            />
                            <Typography variant="body1" sx={{ color: '#777', fontWeight: 'bold', marginBottom: '10px' }}>
                              Nothing to show here
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#777' }}>
                              Please add a new entity or manage the data table to see the content here.
                            </Typography>
                          </Box>
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
    </>
  );
}

export default Assets;
