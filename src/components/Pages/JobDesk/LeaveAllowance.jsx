import React from 'react';
import InnerSidbar from '../../Layout/InnerSidbar';
import Profile from '../../Layout/Profile';
import { Box, Typography, Paper, Grid } from '@mui/material';

function LeaveAllowance() {
  return (
    <>
      <Profile />
      <div className="flex">
        <InnerSidbar />

        <Box sx={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
          {/* Header Section */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
            Leave Allowance
          </Typography>

          {/* Allowance Policy Section */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: '#fff9e6',
              padding: '15px',
              borderLeft: '4px solid #ffcc00',
              marginBottom: '20px',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ff9900', marginBottom: '10px' }}>
              📖 Allowance Policy
            </Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>
              1. Leave will start from the month of January.
            </Typography>
            <Typography variant="body2" sx={{ color: '#333' }}>
              2. Any type of change will be effective on the next day.
            </Typography>
          </Paper>

          {/* Leave Details Section */}
          <Paper
            elevation={3}
            sx={{
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: '#fff',
              maxWidth: '300px',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                marginBottom: '10px',
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px',
              }}
            >
              Casual Leave
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <b>Type:</b> Paid
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <b>Allowance:</b> 18.00
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <b>Earned:</b> 16.50
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <b>Taken:</b> 0.00
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: '#555' }}>
                  <b>Availability:</b> 16.50
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </div>
    </>
  );
}

export default LeaveAllowance;
